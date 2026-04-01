const mongoose = require('mongoose');

const COURSE_STATUS = Object.freeze({
  DRAFT: 'draft',
  UNDER_REVIEW: 'under_review', // submitted by tutor, pending admin check
  PUBLISHED: 'published',
  REMOVED: 'removed',           // soft-deleted by admin
});

const LEVELS = Object.freeze(['beginner', 'intermediate', 'advanced']);

const CATEGORIES = Object.freeze([
  'programming',
  'design',
  'business',
  'marketing',
  'data-science',
  'personal-development',
  'language',
  'other',
]);

const ratingSchema = new mongoose.Schema(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      // Auto-generated from title in pre-save hook
    },

    description: {
      type: String,
      required: [true, 'Course description is required'],
      minlength: [50, 'Description must be at least 50 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },

    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      max: [10000, 'Price cannot exceed ₹10,000'],
    },

    // ── Relations ────────────────────────────────────────────────────────────
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ── Metadata ─────────────────────────────────────────────────────────────
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Category is required'],
    },

    level: {
      type: String,
      enum: LEVELS,
      default: 'beginner',
    },

    language: {
      type: String,
      default: 'English',
      maxlength: 30,
    },

    tags: [{ type: String, trim: true, maxlength: 30 }],

    // What students need before taking this course
    requirements: [{ type: String, trim: true }],

    // What students will learn (shown on course detail page)
    outcomes: [{ type: String, trim: true }],

    // ── Media ─────────────────────────────────────────────────────────────────
    thumbnail: {
      type: String,
      default: null, // Cloudinary URL
    },

    // ── Stats (denormalized for fast listing queries) ─────────────────────────
    totalModules: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 }, // seconds
    totalStudents: { type: Number, default: 0 },
    rating: { type: ratingSchema, default: () => ({}) },

    // ── Status ────────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: Object.values(COURSE_STATUS),
      default: COURSE_STATUS.DRAFT,
    },

    // Admin note on rejection
    reviewNote: {
      type: String,
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
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

// ── Indexes ───────────────────────────────────────────────────────────────────
courseSchema.index({ tutorId: 1 });
courseSchema.index({ status: 1, category: 1 });
courseSchema.index({ status: 1, price: 1 });
courseSchema.index({ 'rating.average': -1 });
// Text index for search
courseSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, description: 1 } }
);

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Auto-generate slug from title.
 * Appends a short random suffix to handle duplicate titles.
 */
courseSchema.pre('save', function (next) {
  if (!this.isModified('title')) return next();

  const base = this.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);

  const suffix = Math.random().toString(36).substring(2, 7);
  this.slug = `${base}-${suffix}`;
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
module.exports.COURSE_STATUS = COURSE_STATUS;
module.exports.CATEGORIES = CATEGORIES;
module.exports.LEVELS = LEVELS;
