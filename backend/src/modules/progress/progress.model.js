const mongoose = require('mongoose');

/**
 * Progress tracks which modules a student has completed within a course.
 * One document per (userId, courseId) pair.
 *
 * completedModules: array of module IDs the student has marked done.
 * percentage: denormalized for fast display — recalculated on every completion.
 * lastModuleId: "resume where you left off" pointer.
 * completedAt: set when percentage hits 100 (triggers certificate generation later).
 */
const progressSchema = new mongoose.Schema(
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

    completedModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
      },
    ],

    // 0–100, recalculated on each markComplete / unmark
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Points earned from completed modules
    totalPoints: {
      type: Number,
      default: 0,
    },

    // Last watched module — used for "continue" button on course card
    lastModuleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      default: null,
    },

    // Set when percentage reaches 100
    completedAt: {
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

// One progress doc per student per course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
