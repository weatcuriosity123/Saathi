const Course = require('./course.model');
const Module = require('../module/module.model');
const Enrollment = require('../enrollment/enrollment.model');
const AppError = require('../../utils/AppError');

const { COURSE_STATUS } = require('./course.model');

// ── Helpers ───────────────────────────────────────────────────────────────────

const buildSortQuery = (sort) => {
  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { 'rating.average': -1 },
  };
  return sortMap[sort] || { createdAt: -1 };
};

// ── Service Methods ───────────────────────────────────────────────────────────

/**
 * getCourses — public listing with filtering, search, and pagination.
 */
const getCourses = async (query) => {
  const { page, limit, category, level, priceMin, priceMax, search, sort } = query;

  const filter = { status: COURSE_STATUS.PUBLISHED };

  if (category) filter.category = category;
  if (level) filter.level = level;
  if (priceMin !== undefined || priceMax !== undefined) {
    filter.price = {};
    if (priceMin !== undefined) filter.price.$gte = priceMin;
    if (priceMax !== undefined) filter.price.$lte = priceMax;
  }
  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (page - 1) * limit;
  const sortQuery = buildSortQuery(sort);

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .select('title slug shortDescription price thumbnail category level rating totalStudents totalModules totalDuration tutorId createdAt')
      .populate('tutorId', 'name avatar')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean(),
    Course.countDocuments(filter),
  ]);

  return {
    courses,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
    },
  };
};

/**
 * getCourseById — public detail view.
 * Modules are included but vimeoId is stripped for non-enrolled users.
 */
const getCourseById = async (courseIdOrSlug, userId = null) => {
  // Support both _id and slug lookups
  const query = courseIdOrSlug.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: courseIdOrSlug }
    : { slug: courseIdOrSlug };

  const course = await Course.findOne({ ...query, status: COURSE_STATUS.PUBLISHED })
    .populate('tutorId', 'name avatar tutorProfile.bio tutorProfile.expertise')
    .lean();

  if (!course) throw new AppError('Course not found', 404);

  // Fetch modules (sorted by order)
  const modules = await Module.find({ courseId: course._id })
    .select('title description order duration points isFree vimeoStatus')
    .sort({ order: 1 })
    .lean();

  // Check enrollment if user is authenticated
  let isEnrolled = false;
  if (userId) {
    const enrollment = await Enrollment.findOne({
      userId,
      courseId: course._id,
      status: 'completed',
    });
    isEnrolled = !!enrollment;
  }

  return { ...course, modules, isEnrolled };
};

/**
 * createCourse — tutor creates a new draft course.
 */
const createCourse = async (tutorId, data) => {
  const course = await Course.create({ ...data, tutorId, status: COURSE_STATUS.DRAFT });
  return course;
};

/**
 * updateCourse — partial update. Ownership is checked in middleware (req.course attached).
 */
const updateCourse = async (course, data) => {
  // Prevent status change via this endpoint (use publishCourse/unpublishCourse instead)
  delete data.status;
  delete data.tutorId;

  Object.assign(course, data);
  await course.save();
  return course;
};

/**
 * submitForReview — tutor submits draft course for admin review.
 * Validates the course has at least one ready module before submission.
 */
const submitForReview = async (course) => {
  if (course.status !== COURSE_STATUS.DRAFT) {
    throw new AppError(`Cannot submit a course with status "${course.status}"`, 400);
  }

  const readyModules = await Module.countDocuments({
    courseId: course._id,
    vimeoStatus: 'ready',
  });

  if (readyModules === 0) {
    throw new AppError(
      'Course must have at least one video module ready before submitting for review',
      400
    );
  }

  course.status = COURSE_STATUS.UNDER_REVIEW;
  await course.save();
  return course;
};

/**
 * getTutorCourses — all courses owned by a tutor (any status).
 */
const getTutorCourses = async (tutorId) => {
  return Course.find({ tutorId })
    .select('title slug status price rating totalStudents totalModules thumbnail createdAt')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * deleteCourse — soft delete. Only allowed if no enrolled students.
 */
const deleteCourse = async (course) => {
  const hasStudents = await Enrollment.exists({
    courseId: course._id,
    status: 'completed',
  });

  if (hasStudents) {
    throw new AppError(
      'Cannot delete a course with enrolled students. Contact admin to unpublish it.',
      400
    );
  }

  course.status = COURSE_STATUS.REMOVED;
  await course.save();
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  submitForReview,
  getTutorCourses,
  deleteCourse,
};
