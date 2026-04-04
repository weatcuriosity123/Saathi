const Review = require('./review.model');
const Course = require('../course/course.model');
const Enrollment = require('../enrollment/enrollment.model');
const AppError = require('../../utils/AppError');

/**
 * recalculateCourseRating
 * Runs an aggregation to recompute average and count, then updates Course.
 * Called after any review create/update/delete.
 */
const recalculateCourseRating = async (courseId) => {
  const result = await Review.aggregate([
    { $match: { courseId: courseId } },
    {
      $group: {
        _id: '$courseId',
        average: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  const stats = result[0] || { average: 0, count: 0 };

  await Course.findByIdAndUpdate(courseId, {
    'rating.average': Math.round(stats.average * 10) / 10, // round to 1 decimal
    'rating.count': stats.count,
  });
};

/**
 * getReviews
 * Public — paginated list of reviews for a course.
 */
const getReviews = async (courseId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ courseId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments({ courseId }),
  ]);

  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * createReview
 * Only enrolled students can review. One review per course.
 */
const createReview = async (userId, courseId, { rating, comment }) => {
  // Must be enrolled to review
  const enrollment = await Enrollment.findOne({
    userId,
    courseId,
    status: 'completed',
  });
  if (!enrollment) {
    throw new AppError('You must be enrolled in this course to leave a review', 403);
  }

  // Upsert — if they already reviewed, update it
  const review = await Review.findOneAndUpdate(
    { userId, courseId },
    { rating, comment: comment || '' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await recalculateCourseRating(courseId);
  return review;
};

/**
 * updateReview — student edits their own review.
 */
const updateReview = async (userId, courseId, { rating, comment }) => {
  const review = await Review.findOne({ userId, courseId });
  if (!review) throw new AppError('Review not found', 404);

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  await review.save();

  await recalculateCourseRating(courseId);
  return review;
};

/**
 * deleteReview — student deletes their review, or admin removes any review.
 */
const deleteReview = async (userId, courseId, isAdmin = false) => {
  const filter = isAdmin ? { courseId } : { userId, courseId };
  const review = await Review.findOne(filter);
  if (!review) throw new AppError('Review not found', 404);

  await review.deleteOne();
  await recalculateCourseRating(courseId);
};

module.exports = { getReviews, createReview, updateReview, deleteReview };
