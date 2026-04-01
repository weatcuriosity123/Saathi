const Course = require('../modules/course/course.model');
const Enrollment = require('../modules/enrollment/enrollment.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * isCourseOwner
 * Verifies the authenticated user owns the course (or is admin).
 * Attaches course to req.course so the controller doesn't re-fetch it.
 *
 * Usage: router.patch('/:id', protect, restrictTo('tutor','admin'), isCourseOwner, updateCourse)
 */
const isCourseOwner = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId || req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Admins can manage any course
  if (req.user.role === 'admin') {
    req.course = course;
    return next();
  }

  if (course.tutorId.toString() !== req.user.id.toString()) {
    throw new AppError('You do not have permission to manage this course', 403);
  }

  req.course = course;
  next();
});

/**
 * isEnrolled
 * Checks if the authenticated user has an active enrollment for the course.
 * Used to gate module access — only enrolled students can watch paid modules.
 *
 * Usage: router.get('/:courseId/modules', protect, isEnrolled, getModules)
 */
const isEnrolled = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId || req.params.id;

  // Admins and course tutors always have access
  if (req.user.role === 'admin') return next();

  const course = await Course.findById(courseId).select('tutorId price');
  if (!course) throw new AppError('Course not found', 404);

  if (course.tutorId.toString() === req.user.id.toString()) {
    req.course = course;
    return next();
  }

  // Free courses — no enrollment check needed
  if (course.price === 0) {
    req.course = course;
    return next();
  }

  const enrollment = await Enrollment.findOne({
    userId: req.user.id,
    courseId,
    status: 'completed',
  });

  if (!enrollment) {
    throw new AppError('You must purchase this course to access its content', 403);
  }

  req.course = course;
  req.enrollment = enrollment;
  next();
});

module.exports = { isCourseOwner, isEnrolled };
