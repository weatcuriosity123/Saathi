const mongoose = require('mongoose');

const VIMEO_STATUS = Object.freeze({
  UPLOADING: 'uploading',     // TUS upload in progress (browser → Vimeo)
  TRANSCODING: 'transcoding', // Vimeo processing the video
  READY: 'ready',             // Available for playback
  ERROR: 'error',             // Vimeo processing failed
});

/**
 * A Module is a single video lesson within a Course.
 * Videos are stored on Vimeo (under the platform's Vimeo account).
 * We only store the Vimeo video ID — Vimeo owns storage, transcoding, and CDN.
 */
const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },

    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },

    // ── Vimeo ─────────────────────────────────────────────────────────────────
    vimeoId: {
      type: String,
      default: null, // Set after tutor initiates upload
    },

    vimeoStatus: {
      type: String,
      enum: Object.values(VIMEO_STATUS),
      default: VIMEO_STATUS.UPLOADING,
    },

    duration: {
      type: Number,
      default: 0, // seconds — filled in by Vimeo webhook on transcode.complete
    },

    // ── Learning ──────────────────────────────────────────────────────────────
    order: {
      type: Number,
      required: true,
    },

    // Points awarded when student completes this module
    points: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },

    // Free preview — non-enrolled users can watch this module
    isFree: {
      type: Boolean,
      default: false,
    },

    // Downloadable resources attached to this module (Cloudinary URLs)
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },   // Cloudinary URL
        type: { type: String, enum: ['pdf', 'zip', 'doc', 'other'], default: 'other' },
      },
    ],
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
moduleSchema.index({ courseId: 1, order: 1 }); // most common query pattern
moduleSchema.index({ vimeoId: 1 });             // for webhook lookup by vimeoId

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
module.exports.VIMEO_STATUS = VIMEO_STATUS;
