const express = require('express');
// mergeParams: true — allows access to :courseId from the parent course router
const router = express.Router({ mergeParams: true });

const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const { protect, restrictTo } = require('../../middleware/auth.middleware');
const { isCourseOwner, isEnrolled } = require('../../middleware/course.middleware');

const moduleController = require('./module.controller');
const { createModuleSchema, updateModuleSchema, reorderSchema } = require('./module.validation');

// ── Semi-public: auth optional — service decides what to expose ─────────────────
// Enrolled students get full list; others see only free modules
router.get(
  '/',
  (req, res, next) => { req.enrollment = null; next(); }, // default: not enrolled
  asyncHandler(moduleController.getModules)
);

// ── Enrolled student: play a specific module ────────────────────────────────────
router.get(
  '/:moduleId/player',
  protect,
  isEnrolled,
  asyncHandler(moduleController.getModulePlayer)
);

// ── Tutor / Admin: manage modules ──────────────────────────────────────────────
router.post(
  '/',
  protect,
  restrictTo('tutor', 'admin'),
  isCourseOwner,
  validate(createModuleSchema),
  asyncHandler(moduleController.addModule)
);

router.patch(
  '/reorder',
  protect,
  restrictTo('tutor', 'admin'),
  isCourseOwner,
  validate(reorderSchema),
  asyncHandler(moduleController.reorderModules)
);

router.patch(
  '/:moduleId',
  protect,
  restrictTo('tutor', 'admin'),
  isCourseOwner,
  validate(updateModuleSchema),
  asyncHandler(moduleController.updateModule)
);

router.delete(
  '/:moduleId',
  protect,
  restrictTo('tutor', 'admin'),
  isCourseOwner,
  asyncHandler(moduleController.deleteModule)
);

module.exports = router;
