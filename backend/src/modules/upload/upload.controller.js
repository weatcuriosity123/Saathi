const cloudinaryService = require('../../services/cloudinary.service');
const User = require('../user/user.model');
const Course = require('../course/course.model');
const AppError = require('../../utils/AppError');
const { respond } = require('../../utils/ApiResponse');

/**
 * uploadAvatar
 * Replaces the user's avatar. Deletes the old Cloudinary image first.
 */
const uploadAvatar = async (req, res) => {
  if (!req.file) throw new AppError('No image file provided', 400);

  const user = await User.findById(req.user.id).select('avatar');

  // Delete old avatar from Cloudinary
  if (user.avatar) {
    const oldPublicId = cloudinaryService.extractPublicId(user.avatar);
    await cloudinaryService.deleteImage(oldPublicId);
  }

  const { url } = await cloudinaryService.uploadImage(req.file.buffer, 'avatars', {
    transformation: [
      { width: 300, height: 300, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });

  user.avatar = url;
  await user.save();

  return respond(res).success({ avatar: url }, 'Avatar updated');
};

/**
 * uploadCourseThumbnail
 * Tutor uploads a thumbnail for their course.
 * Only the course owner or admin can call this.
 */
const uploadCourseThumbnail = async (req, res) => {
  if (!req.file) throw new AppError('No image file provided', 400);

  const course = await Course.findById(req.params.courseId).select('thumbnail tutorId');
  if (!course) throw new AppError('Course not found', 404);

  // Ownership check (admin bypasses)
  if (
    req.user.role !== 'admin' &&
    course.tutorId.toString() !== req.user.id.toString()
  ) {
    throw new AppError('You do not own this course', 403);
  }

  // Delete old thumbnail
  if (course.thumbnail) {
    const oldPublicId = cloudinaryService.extractPublicId(course.thumbnail);
    await cloudinaryService.deleteImage(oldPublicId);
  }

  const { url } = await cloudinaryService.uploadImage(req.file.buffer, 'thumbnails', {
    transformation: [
      { width: 1280, height: 720, crop: 'fill' }, // 16:9
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });

  course.thumbnail = url;
  await course.save();

  return respond(res).success({ thumbnail: url }, 'Thumbnail updated');
};

module.exports = { uploadAvatar, uploadCourseThumbnail };
