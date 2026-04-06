const express = require('express');
const router = express.Router({ mergeParams: true }); // access :courseId from parent

const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const { protect, restrictTo } = require('../../middleware/auth.middleware');
const reviewController = require('./review.controller');
const { createReviewSchema, updateReviewSchema } = require('./review.validation');

// Public: anyone can read reviews
router.get('/', asyncHandler(reviewController.getReviews));

// Enrolled students: create / update / delete own review
router.post(
  '/',
  protect,
  restrictTo('student', 'tutor'),
  validate(createReviewSchema),
  asyncHandler(reviewController.createReview)
);

router.patch(
  '/my',
  protect,
  restrictTo('student', 'tutor'),
  validate(updateReviewSchema),
  asyncHandler(reviewController.updateReview)
);

router.delete(
  '/my',
  protect,
  restrictTo('student', 'tutor', 'admin'),
  asyncHandler(reviewController.deleteReview)
);

module.exports = router;
