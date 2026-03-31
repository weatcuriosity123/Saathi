const mongoose = require('mongoose');

const ENROLLMENT_STATUS = Object.freeze({
  PENDING: 'pending',       // Razorpay order created, payment not yet confirmed
  COMPLETED: 'completed',   // Payment verified — student has access
  FAILED: 'failed',         // Payment failed or expired
  REFUNDED: 'refunded',     // Refund processed — access revoked
});

/**
 * Enrollment = a student's purchase record for a course.
 * This is the access-control source of truth:
 *   - status === 'completed' → student can access all modules
 *   - anything else → access denied
 *
 * Free courses (price === 0) get a COMPLETED enrollment instantly without payment.
 */
const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    // ── Payment ───────────────────────────────────────────────────────────────
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Razorpay order ID (created before payment)
    razorpayOrderId: {
      type: String,
      default: null,
    },

    // Razorpay payment ID (received after successful payment)
    razorpayPaymentId: {
      type: String,
      default: null,
    },

    // Razorpay signature (stored for audit trail, verified before granting access)
    razorpaySignature: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(ENROLLMENT_STATUS),
      default: ENROLLMENT_STATUS.PENDING,
    },

    // Timestamp when access was granted
    enrolledAt: {
      type: Date,
      default: null,
    },

    // Timestamp when refund was processed
    refundedAt: {
      type: Date,
      default: null,
    },

    refundNote: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // Never expose signature to client
        delete ret.razorpaySignature;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Primary lookup: "is this user enrolled in this course?"
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ userId: 1, status: 1 });
enrollmentSchema.index({ razorpayOrderId: 1 });  // for webhook lookup

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
module.exports.ENROLLMENT_STATUS = ENROLLMENT_STATUS;
