const User = require('../user/user.model');
const Course = require('../course/course.model');
const AppError = require('../../utils/AppError');

/**
 * getProfile
 * Public tutor profile — shown on course detail page.
 * Returns basic info + their published courses.
 */
const getProfile = async (tutorId) => {
  const tutor = await User.findOne({
    _id: tutorId,
    role: 'tutor',
    isActive: true,
  }).select('name avatar tutorProfile.bio tutorProfile.expertise tutorProfile.isApproved createdAt');

  if (!tutor) throw new AppError('Tutor not found', 404);

  const courses = await Course.find({ tutorId, status: 'published' })
    .select('title slug thumbnail rating totalStudents price level category')
    .sort({ publishedAt: -1 })
    .lean();

  return { tutor, courses };
};

/**
 * updateProfile
 * Tutor updates their own bio, expertise, and name.
 * Avatar is handled separately via /uploads/avatar.
 */
const updateProfile = async (tutorId, { name, bio, expertise }) => {
  const user = await User.findById(tutorId);
  if (!user) throw new AppError('User not found', 404);

  if (name) user.name = name;

  if (!user.tutorProfile) {
    throw new AppError('Tutor profile not initialized. Contact support.', 400);
  }

  if (bio !== undefined) user.tutorProfile.bio = bio;
  if (expertise !== undefined) user.tutorProfile.expertise = expertise;

  // markModified needed for mixed/embedded subdoc updates
  user.markModified('tutorProfile');
  await user.save();

  return user.toSafeObject();
};

/**
 * changePassword
 * Any logged-in user can change their password.
 * Incrementing accountVersion invalidates all existing JWTs immediately.
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password +accountVersion');
  if (!user) throw new AppError('User not found', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('Current password is incorrect', 400);

  if (currentPassword === newPassword) {
    throw new AppError('New password must be different from current password', 400);
  }

  user.password = newPassword; // hashed by pre-save hook
  await user.incrementAccountVersion(); // invalidates all existing tokens
};

module.exports = { getProfile, updateProfile, changePassword };
