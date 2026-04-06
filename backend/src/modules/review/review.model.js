const mongoose = require('mongoose');

/**
 * Review = a student's rating + optional comment for a completed course.
 * One review per (userId, courseId) — enforced by unique index.
 *
 * After save/delete, the Course rating.average and rating.count are
 * recalculated in review.service.js (aggregation pipeline).
 */
const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },

    comment: {
      type: String,
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// One review per student per course
reviewSchema.index({ userId: 1, courseId: 1 }, { unique: true });
// Fast lookup: all reviews for a course
reviewSchema.index({ courseId: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
