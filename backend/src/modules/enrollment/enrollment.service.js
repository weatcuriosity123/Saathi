const crypto = require('crypto');
const Course = require('../course/course.model');
const Enrollment = require('./enrollment.model');
const User = require('../user/user.model');
const AppError = require('../../utils/AppError');
const { sendEnrollmentConfirm } = require('../../services/email.service');

const { ENROLLMENT_STATUS } = require('./enrollment.model');
const { COURSE_STATUS } = require('../course/course.model');

/**
 * Razorpay client — initialized lazily so the app starts without real credentials.
 * Replace placeholder block when adding real Razorpay keys.
 */
let razorpayClient = null;

const getRazorpay = () => {
  if (razorpayClient) return razorpayClient;

  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'placeholder') {
    // Return a mock for development
    console.warn('[Razorpay] PLACEHOLDER: Using mock Razorpay client. Configure real keys for payments.');
    return {
      orders: {
        create: async (opts) => ({
          id: `order_placeholder_${Date.now()}`,
          amount: opts.amount,
          currency: opts.currency,
          receipt: opts.receipt,
        }),
      },
    };
  }

  // const Razorpay = require('razorpay');  // npm install razorpay
  // razorpayClient = new Razorpay({
  //   key_id: process.env.RAZORPAY_KEY_ID,
  //   key_secret: process.env.RAZORPAY_KEY_SECRET,
  // });
  // return razorpayClient;
};

// ── Service Methods ───────────────────────────────────────────────────────────

/**
 * initiateEnrollment
 * Step 1 of the payment flow:
 *   - Validates course exists and is published
 *   - Handles free courses instantly
 *   - Creates a Razorpay order for paid courses
 *   - Creates a PENDING enrollment record (idempotent)
 */
const initiateEnrollment = async (userId, courseId) => {
  const course = await Course.findOne({
    _id: courseId,
    status: COURSE_STATUS.PUBLISHED,
  });

  if (!course) throw new AppError('Course not found or not available', 404);

  // Prevent tutor from enrolling in their own course
  if (course.tutorId.toString() === userId.toString()) {
    throw new AppError('Tutors cannot enroll in their own courses', 400);
  }

  // Check for existing completed enrollment (already purchased)
  const existingEnrollment = await Enrollment.findOne({ userId, courseId });
  if (existingEnrollment?.status === ENROLLMENT_STATUS.COMPLETED) {
    throw new AppError('You are already enrolled in this course', 409);
  }

  // ── Free Course: instant enrollment ──────────────────────────────────────
  if (course.price === 0) {
    const enrollment = await Enrollment.findOneAndUpdate(
      { userId, courseId },
      {
        userId,
        courseId,
        amount: 0,
        status: ENROLLMENT_STATUS.COMPLETED,
        enrolledAt: new Date(),
      },
      { upsert: true, new: true }
    );
    await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
    const user = await User.findById(userId).select('name email');
    sendEnrollmentConfirm(user.email, user.name, course.title, course.slug);
    return { enrollment, free: true };
  }

  // ── Paid Course: create Razorpay order ────────────────────────────────────
  const razorpay = getRazorpay();
  const amountInPaise = course.price * 100; // Razorpay uses smallest currency unit

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: `enroll_${userId}_${courseId}_${Date.now()}`.substring(0, 40),
    notes: {
      courseId: courseId.toString(),
      userId: userId.toString(),
    },
  });

  // Upsert: if a failed attempt existed, reuse the enrollment record
  const enrollment = await Enrollment.findOneAndUpdate(
    { userId, courseId },
    {
      userId,
      courseId,
      amount: course.price,
      razorpayOrderId: order.id,
      status: ENROLLMENT_STATUS.PENDING,
    },
    { upsert: true, new: true }
  );

  return {
    enrollment,
    free: false,
    order: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    },
    course: {
      title: course.title,
      thumbnail: course.thumbnail,
    },
  };
};

/**
 * verifyPayment
 * Step 2 of the payment flow (called from frontend after Razorpay modal closes):
 *   - Verifies HMAC signature (the real security check — never skip this)
 *   - Activates the enrollment
 *
 * The Razorpay webhook (reconciliation) handles edge cases where this fails.
 */
const verifyPayment = async (userId, { razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  // ── Signature verification ────────────────────────────────────────────────
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new AppError('Payment verification failed. Invalid signature.', 400);
  }

  // ── Find the pending enrollment ───────────────────────────────────────────
  const enrollment = await Enrollment.findOne({
    userId,
    razorpayOrderId,
    status: ENROLLMENT_STATUS.PENDING,
  });

  if (!enrollment) {
    // Could be already verified (webhook arrived first) or invalid orderId
    const completed = await Enrollment.findOne({ userId, razorpayOrderId, status: ENROLLMENT_STATUS.COMPLETED });
    if (completed) return completed; // idempotent — already done
    throw new AppError('Enrollment record not found', 404);
  }

  // ── Activate enrollment ───────────────────────────────────────────────────
  enrollment.status = ENROLLMENT_STATUS.COMPLETED;
  enrollment.razorpayPaymentId = razorpayPaymentId;
  enrollment.razorpaySignature = razorpaySignature;
  enrollment.enrolledAt = new Date();
  await enrollment.save();

  await Course.findByIdAndUpdate(enrollment.courseId, { $inc: { totalStudents: 1 } });

  const [enrolledUser, enrolledCourse] = await Promise.all([
    User.findById(userId).select('name email'),
    Course.findById(enrollment.courseId).select('title slug'),
  ]);
  if (enrolledUser && enrolledCourse) {
    sendEnrollmentConfirm(enrolledUser.email, enrolledUser.name, enrolledCourse.title, enrolledCourse.slug);
  }

  return enrollment;
};

/**
 * handleRazorpayWebhook
 * Reconciliation layer — handles cases where verifyPayment wasn't called
 * (network drop, browser closed after payment).
 * Must be idempotent — Razorpay can retry webhooks.
 */
const handleRazorpayWebhook = async (rawBody, signature) => {
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret')
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new AppError('Invalid webhook signature', 400);
  }

  const event = JSON.parse(rawBody);
  const { event: eventType, payload } = event;

  if (eventType === 'payment.captured') {
    const orderId = payload.payment.entity.order_id;
    const paymentId = payload.payment.entity.id;

    // Idempotency: skip if already completed
    const enrollment = await Enrollment.findOne({
      razorpayOrderId: orderId,
      status: ENROLLMENT_STATUS.PENDING,
    });

    if (!enrollment) return; // already processed

    enrollment.status = ENROLLMENT_STATUS.COMPLETED;
    enrollment.razorpayPaymentId = paymentId;
    enrollment.enrolledAt = new Date();
    await enrollment.save();

    await Course.findByIdAndUpdate(enrollment.courseId, { $inc: { totalStudents: 1 } });
  }

  if (eventType === 'payment.failed') {
    const orderId = payload.payment.entity.order_id;
    await Enrollment.findOneAndUpdate(
      { razorpayOrderId: orderId, status: ENROLLMENT_STATUS.PENDING },
      { status: ENROLLMENT_STATUS.FAILED }
    );
  }
};

/**
 * getMyEnrollments — all courses a student is enrolled in.
 */
const getMyEnrollments = async (userId) => {
  return Enrollment.find({ userId, status: ENROLLMENT_STATUS.COMPLETED })
    .populate({
      path: 'courseId',
      select: 'title slug thumbnail totalModules totalDuration tutorId',
      populate: { path: 'tutorId', select: 'name' },
    })
    .sort({ enrolledAt: -1 })
    .lean();
};

/**
 * checkEnrollment — is this user enrolled in this specific course?
 */
const checkEnrollment = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    userId,
    courseId,
    status: ENROLLMENT_STATUS.COMPLETED,
  }).lean();
  return { isEnrolled: !!enrollment, enrollment };
};

module.exports = {
  initiateEnrollment,
  verifyPayment,
  handleRazorpayWebhook,
  getMyEnrollments,
  checkEnrollment,
};
