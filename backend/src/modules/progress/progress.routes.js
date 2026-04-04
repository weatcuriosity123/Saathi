const express = require('express');
const router = express.Router();

const asyncHandler = require('../../utils/asyncHandler');
const { protect, restrictTo } = require('../../middleware/auth.middleware');
const progressController = require('./progress.controller');

// All progress routes require a logged-in student (or tutor/admin for their own data)
router.use(protect);

// "My Learning" page — all enrolled courses with progress
router.get('/my-learning', asyncHandler(progressController.getMyCourses));

// Progress for a specific course
router.get('/:courseId', asyncHandler(progressController.getProgress));

// Mark / unmark a module complete
router.post(
  '/:courseId/modules/:moduleId/complete',
  restrictTo('student', 'tutor', 'admin'),
  asyncHandler(progressController.markComplete)
);

router.delete(
  '/:courseId/modules/:moduleId/complete',
  restrictTo('student', 'tutor', 'admin'),
  asyncHandler(progressController.unmarkComplete)
);

module.exports = router;
