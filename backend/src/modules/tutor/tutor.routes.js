const express = require('express');
const router = express.Router();

const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const { protect, restrictTo } = require('../../middleware/auth.middleware');
const tutorController = require('./tutor.controller');
const { updateProfileSchema, changePasswordSchema } = require('./tutor.validation');

// Public: anyone can view a tutor's profile page
router.get('/:tutorId/profile', asyncHandler(tutorController.getProfile));

// Protected: tutor edits their own profile
router.patch(
  '/me/profile',
  protect,
  restrictTo('tutor', 'admin'),
  validate(updateProfileSchema),
  asyncHandler(tutorController.updateProfile)
);

// Any logged-in user can change their own password
router.patch(
  '/me/password',
  protect,
  validate(changePasswordSchema),
  asyncHandler(tutorController.changePassword)
);

module.exports = router;
