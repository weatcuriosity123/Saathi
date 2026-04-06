const Progress = require('./progress.model');
const Module = require('../module/module.model');
const Course = require('../course/course.model');
const Enrollment = require('../enrollment/enrollment.model');
const AppError = require('../../utils/AppError');
const { addCertificateJob } = require('../../queues/certificate.queue');

/**
 * getProgress
 * Returns full progress for a student in a course.
 * Also checks enrollment so this endpoint can double as an access guard.
 */
const getProgress = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    userId,
    courseId,
    status: 'completed',
  });
  if (!enrollment) throw new AppError('You are not enrolled in this course', 403);

  const progress = await Progress.findOne({ userId, courseId }).lean();

  // No progress doc yet — return zero state
  if (!progress) {
    return {
      courseId,
      completedModules: [],
      percentage: 0,
      totalPoints: 0,
      lastModuleId: null,
      completedAt: null,
    };
  }

  return progress;
};

/**
 * markModuleComplete
 * Marks a single module as complete for the student.
 * Recalculates percentage and points.
 * Sets completedAt if course is now 100% done.
 *
 * Idempotent — calling it twice on the same module is safe.
 */
const markModuleComplete = async (userId, courseId, moduleId) => {
  // Verify the module belongs to this course
  const module = await Module.findOne({ _id: moduleId, courseId }).select('points');
  if (!module) throw new AppError('Module not found in this course', 404);

  // Total module count for % calculation
  const totalModules = await Module.countDocuments({ courseId });
  if (totalModules === 0) throw new AppError('This course has no modules yet', 400);

  // Upsert progress doc
  const progress = await Progress.findOneAndUpdate(
    { userId, courseId },
    {
      $setOnInsert: { userId, courseId },
    },
    { upsert: true, new: true }
  );

  // Idempotency: skip if already completed
  const alreadyDone = progress.completedModules.some(
    (id) => id.toString() === moduleId.toString()
  );

  if (!alreadyDone) {
    progress.completedModules.push(moduleId);
    progress.totalPoints += module.points;
  }

  progress.lastModuleId = moduleId;
  progress.percentage = Math.round((progress.completedModules.length / totalModules) * 100);

  if (progress.percentage === 100 && !progress.completedAt) {
    progress.completedAt = new Date();
    // Enqueue certificate generation — worker picks this up async
    await addCertificateJob(userId, courseId);
  }

  await progress.save();
  return progress;
};

/**
 * unmarkModuleComplete
 * Lets a student uncheck a module (e.g. they want to re-watch and re-complete).
 */
const unmarkModuleComplete = async (userId, courseId, moduleId) => {
  const module = await Module.findOne({ _id: moduleId, courseId }).select('points');
  if (!module) throw new AppError('Module not found in this course', 404);

  const totalModules = await Module.countDocuments({ courseId });

  const progress = await Progress.findOne({ userId, courseId });
  if (!progress) return; // nothing to unmark

  const wasDone = progress.completedModules.some(
    (id) => id.toString() === moduleId.toString()
  );

  if (wasDone) {
    progress.completedModules = progress.completedModules.filter(
      (id) => id.toString() !== moduleId.toString()
    );
    progress.totalPoints = Math.max(0, progress.totalPoints - module.points);
  }

  progress.percentage = totalModules
    ? Math.round((progress.completedModules.length / totalModules) * 100)
    : 0;

  // Reset completion if un-marking brings it below 100
  if (progress.percentage < 100) {
    progress.completedAt = null;
  }

  await progress.save();
  return progress;
};

/**
 * getMyCoursesWithProgress
 * Returns all enrolled courses for a student with their progress percentage.
 * Powers the "My Learning" dashboard page.
 */
const getMyCoursesWithProgress = async (userId) => {
  const enrollments = await Enrollment.find({ userId, status: 'completed' })
    .populate({
      path: 'courseId',
      select: 'title slug thumbnail totalModules totalDuration tutorId',
      populate: { path: 'tutorId', select: 'name' },
    })
    .lean();

  const courseIds = enrollments.map((e) => e.courseId?._id).filter(Boolean);

  const progressDocs = await Progress.find({
    userId,
    courseId: { $in: courseIds },
  }).lean();

  const progressMap = {};
  progressDocs.forEach((p) => {
    progressMap[p.courseId.toString()] = p;
  });

  return enrollments.map((enrollment) => {
    const course = enrollment.courseId;
    const progressDoc = progressMap[course?._id?.toString()] || null;
    return {
      course,
      progress: progressDoc
        ? {
            percentage: progressDoc.percentage,
            lastModuleId: progressDoc.lastModuleId,
            completedModules: progressDoc.completedModules,
            totalPoints: progressDoc.totalPoints,
            completedAt: progressDoc.completedAt,
          }
        : {
            percentage: 0,
            lastModuleId: null,
            completedModules: [],
            totalPoints: 0,
            completedAt: null,
          },
    };
  });
};

module.exports = {
  getProgress,
  markModuleComplete,
  unmarkModuleComplete,
  getMyCoursesWithProgress,
};
