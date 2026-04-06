const User = require('../user/user.model');
const Course = require('../course/course.model');
const Enrollment = require('../enrollment/enrollment.model');
const AppError = require('../../utils/AppError');
const {
  sendTutorApproved,
  sendCourseApproved,
  sendCourseRejected,
} = require('../../services/email.service');

const { ROLES } = require('../user/user.model');
const { COURSE_STATUS } = require('../course/course.model');

// ── Tutor Management ──────────────────────────────────────────────────────────

const getPendingTutors = async () => {
  return User.find({
    role: ROLES.TUTOR,
    'tutorProfile.verificationStatus': 'pending',
  })
    .select('name email avatar tutorProfile createdAt')
    .sort({ createdAt: 1 }) // oldest first — FIFO review queue
    .lean();
};

const getAllTutors = async () => {
  return User.find({ role: ROLES.TUTOR })
    .select('name email avatar isActive tutorProfile createdAt')
    .sort({ createdAt: -1 })
    .lean();
};

const approveTutor = async (tutorId) => {
  const user = await User.findOne({ _id: tutorId, role: ROLES.TUTOR });
  if (!user) throw new AppError('Tutor not found', 404);

  user.tutorProfile.verificationStatus = 'approved';
  user.tutorProfile.isApproved = true;
  user.tutorProfile.verificationNote = null;
  await user.save();
  sendTutorApproved(user.email, user.name);
  return user.toSafeObject();
};

const rejectTutor = async (tutorId, note) => {
  const user = await User.findOne({ _id: tutorId, role: ROLES.TUTOR });
  if (!user) throw new AppError('Tutor not found', 404);

  user.tutorProfile.verificationStatus = 'rejected';
  user.tutorProfile.isApproved = false;
  user.tutorProfile.verificationNote = note || 'Application rejected by admin.';
  await user.save();
  return user.toSafeObject();
};

// ── Course Review ─────────────────────────────────────────────────────────────

const getCoursesUnderReview = async () => {
  return Course.find({ status: COURSE_STATUS.UNDER_REVIEW })
    .select('title slug category level price thumbnail tutorId createdAt')
    .populate('tutorId', 'name email')
    .sort({ updatedAt: 1 }) // oldest submitted first
    .lean();
};

const publishCourse = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found', 404);

  if (course.status !== COURSE_STATUS.UNDER_REVIEW) {
    throw new AppError(`Cannot publish a course with status "${course.status}"`, 400);
  }

  course.status = COURSE_STATUS.PUBLISHED;
  course.publishedAt = new Date();
  course.reviewNote = null;
  await course.save();
  const tutor = await User.findById(course.tutorId).select('name email');
  if (tutor) sendCourseApproved(tutor.email, tutor.name, course.title);
  return course;
};

const rejectCourse = async (courseId, note) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found', 404);

  if (course.status !== COURSE_STATUS.UNDER_REVIEW) {
    throw new AppError(`Cannot reject a course with status "${course.status}"`, 400);
  }

  // Send back to draft with a note so tutor can fix and resubmit
  course.status = COURSE_STATUS.DRAFT;
  course.reviewNote = note || 'Course rejected. Please review and resubmit.';
  await course.save();
  const tutor = await User.findById(course.tutorId).select('name email');
  if (tutor) sendCourseRejected(tutor.email, tutor.name, course.title, course.reviewNote);
  return course;
};

const unpublishCourse = async (courseId, note) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found', 404);

  course.status = COURSE_STATUS.REMOVED;
  course.reviewNote = note || 'Unpublished by admin.';
  await course.save();
  return course;
};

// ── User Management ───────────────────────────────────────────────────────────

const getAllUsers = async ({ page, limit, role, search }) => {
  const filter = {};
  if (role) filter.role = role;
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('name email role avatar isActive isEmailVerified createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const toggleUserActive = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  // Prevent deactivating admin accounts
  if (user.role === ROLES.ADMIN) {
    throw new AppError('Cannot deactivate an admin account', 400);
  }

  user.isActive = !user.isActive;
  await user.save();
  return { id: user._id, isActive: user.isActive };
};

// ── Dashboard Stats ───────────────────────────────────────────────────────────

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalStudents,
    totalTutors,
    pendingTutors,
    totalCourses,
    publishedCourses,
    pendingReviewCourses,
    totalEnrollments,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'student', isActive: true }),
    User.countDocuments({ role: 'tutor', isActive: true }),
    User.countDocuments({ role: 'tutor', 'tutorProfile.verificationStatus': 'pending' }),
    Course.countDocuments(),
    Course.countDocuments({ status: COURSE_STATUS.PUBLISHED }),
    Course.countDocuments({ status: COURSE_STATUS.UNDER_REVIEW }),
    Enrollment.countDocuments({ status: 'completed' }),
  ]);

  return {
    users: { total: totalUsers, students: totalStudents, tutors: totalTutors, pendingTutors },
    courses: { total: totalCourses, published: publishedCourses, pendingReview: pendingReviewCourses },
    enrollments: { total: totalEnrollments },
  };
};

module.exports = {
  getPendingTutors,
  getAllTutors,
  approveTutor,
  rejectTutor,
  getCoursesUnderReview,
  publishCourse,
  rejectCourse,
  unpublishCourse,
  getAllUsers,
  toggleUserActive,
  getDashboardStats,
};
