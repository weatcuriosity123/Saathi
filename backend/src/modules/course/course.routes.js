const express = require('express');
const router = express.Router();

const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const { protect, restrictTo } = require('../../middleware/auth.middleware');
const { isCourseOwner } = require('../../middleware/course.middleware');

const courseController = require('./course.controller');
const { createCourseSchema, updateCourseSchema, courseQuerySchema } = require('./course.validation');

// Mount module routes under courses
const moduleRouter = require('../module/module.routes');
router.use('/:courseId/modules', moduleRouter);

// ── Public ─────────────────────────────────────────────────────────────────────
router.get(
  '/',
  (req, res, next) => { req.query = courseQuerySchema.parse(req.query); next(); },
  asyncHandler(courseController.listCourses)
);

router.get('/:id', asyncHandler(courseController.getCourse));

// ── Tutor: own courses ─────────────────────────────────────────────────────────
router.get(
  '/tutor/my-courses',
  protect,
  restrictTo('tutor', 'admin'),
  asyncHandler(courseController.getMyDraftCourses)
);

router.post(
  '/',
  protect,
  restrictTo('tutor', 'admin'),
  validate(createCourseSchema),
  asyncHandler(courseController.createCourse)
);

router.patch(
  '/:id',
  protect,
  restrictTo('tutor', 'admin'),
  isCourseOwner,
  validate(updateCourseSchema),
  asyncHandler(courseController.updateCourse)
);

router.post(
  '/:id/submit-review',
  protect,
  restrictTo('tutor', 'admin'),
  isCourseOwner,
  asyncHandler(courseController.submitForReview)
);

router.delete(
  '/:id',
  protect,
  restrictTo('tutor', 'admin'),
  isCourseOwner,
  asyncHandler(courseController.deleteCourse)
);

module.exports = router;
