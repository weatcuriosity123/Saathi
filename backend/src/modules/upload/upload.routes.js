const express = require('express');
const router = express.Router();

const asyncHandler = require('../../utils/asyncHandler');
const { protect, restrictTo } = require('../../middleware/auth.middleware');
const { imageUpload } = require('../../middleware/upload.middleware');
const uploadController = require('./upload.controller');

// Avatar — any logged-in user
router.post(
  '/avatar',
  protect,
  imageUpload.single('avatar'),
  asyncHandler(uploadController.uploadAvatar)
);

// Course thumbnail — tutor or admin
router.post(
  '/courses/:courseId/thumbnail',
  protect,
  restrictTo('tutor', 'admin'),
  imageUpload.single('thumbnail'),
  asyncHandler(uploadController.uploadCourseThumbnail)
);

module.exports = router;
