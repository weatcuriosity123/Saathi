const express = require('express');
const router = express.Router();

const asyncHandler = require('../../utils/asyncHandler');
const { protect, restrictTo } = require('../../middleware/auth.middleware');
const enrollmentController = require('./enrollment.controller');

// ── Razorpay Webhook ──────────────────────────────────────────────────────────
// IMPORTANT: Must use express.raw() here — Razorpay signature is computed on raw body.
// If JSON parser runs first, the raw body is gone and signature check ALWAYS fails.
router.post(
  '/webhook/razorpay',
  express.raw({ type: 'application/json' }),
  asyncHandler(enrollmentController.razorpayWebhook)
);

// ── Student Routes ────────────────────────────────────────────────────────────
router.get(
  '/my-courses',
  protect,
  restrictTo('student', 'tutor', 'admin'),
  asyncHandler(enrollmentController.getMyEnrollments)
);

router.get(
  '/check/:courseId',
  protect,
  asyncHandler(enrollmentController.checkEnrollment)
);

router.post(
  '/:courseId/initiate',
  protect,
  restrictTo('student', 'tutor'),
  asyncHandler(enrollmentController.initiateEnrollment)
);

router.post(
  '/verify-payment',
  protect,
  restrictTo('student', 'tutor'),
  asyncHandler(enrollmentController.verifyPayment)
);

module.exports = router;
