const mongoose = require('mongoose');
const Module = require('./module.model');
const Course = require('../course/course.model');
const AppError = require('../../utils/AppError');
const vimeoService = require('../../services/vimeo.service');

/**
 * getModules
 * Returns modules for a course.
 * - Enrolled users / tutors / admins: full list with vimeoId (needed for playback)
 * - Everyone else: only free modules, no vimeoId
 */
const getModules = async (courseId, user) => {
  const isPrivileged =
    user &&
    (user.role === 'admin' ||
      (await Course.exists({ _id: courseId, tutorId: user.id })) ||
      // Enrollment check is already done by isEnrolled middleware before this runs
      user._isEnrolled);

  const query = Module.find({ courseId }).sort({ order: 1 });

  if (isPrivileged) {
    return query.select('-__v').lean();
  }

  // Public: only free modules, strip vimeoId (no playback data)
  return query
    .where({ isFree: true })
    .select('title description order duration points isFree')
    .lean();
};

/**
 * addModule
 * Creates a module record and requests a Vimeo upload slot.
 * Returns the Vimeo upload URL to the frontend so the browser can upload directly.
 */
const addModule = async (courseId, tutorId, data) => {
  const { title, description, points, isFree, fileSize } = data;

  // Determine the next order number
  const lastModule = await Module.findOne({ courseId }).sort({ order: -1 }).select('order');
  const nextOrder = lastModule ? lastModule.order + 1 : 1;

  // Create Vimeo upload slot (browser will upload directly via TUS)
  const { vimeoId, uploadUrl } = await vimeoService.createUploadSlot({
    title: `[${courseId}] ${title}`,
    description,
    fileSize,
  });

  // Set domain-level privacy immediately so the video is never publicly accessible
  await vimeoService.setVideoDomainPrivacy(vimeoId, process.env.CLIENT_DOMAIN || 'localhost');

  const module = await Module.create({
    courseId,
    title,
    description,
    points,
    isFree,
    vimeoId,
    vimeoStatus: 'uploading',
    order: nextOrder,
  });

  // Update course's totalModules count
  await Course.findByIdAndUpdate(courseId, { $inc: { totalModules: 1 } });

  // Return module data + upload URL (upload URL is only needed once — not stored in DB)
  return { module, uploadUrl };
};

/**
 * updateModule — partial update of module metadata (not video).
 */
const updateModule = async (courseId, moduleId, data) => {
  const module = await Module.findOne({ _id: moduleId, courseId });
  if (!module) throw new AppError('Module not found', 404);

  Object.assign(module, data);
  await module.save();
  return module;
};

/**
 * handleVimeoWebhook
 * Called by the Vimeo webhook when a video finishes transcoding.
 * Updates module status + duration, and recalculates course totalDuration.
 */
const handleVimeoWebhook = async ({ vimeoId, status, duration }) => {
  const module = await Module.findOne({ vimeoId });
  if (!module) {
    // Could be a video not belonging to this platform — ignore silently
    return;
  }

  const prevDuration = module.duration;
  module.vimeoStatus = status === 'available' ? 'ready' : 'error';
  module.duration = duration || 0;
  await module.save();

  // Keep course totalDuration in sync
  const durationDelta = module.duration - prevDuration;
  await Course.findByIdAndUpdate(module.courseId, {
    $inc: { totalDuration: durationDelta },
  });
};

/**
 * reorderModules
 * Accepts a full reorder map: [{ moduleId, order }]
 * Uses a MongoDB transaction to update all orders atomically.
 */
const reorderModules = async (courseId, orderMap) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updates = orderMap.map(({ moduleId, order }) =>
      Module.findOneAndUpdate(
        { _id: moduleId, courseId },
        { order },
        { session, new: true }
      )
    );

    await Promise.all(updates);
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new AppError('Reorder failed. Please try again.', 500);
  } finally {
    session.endSession();
  }

  return Module.find({ courseId }).sort({ order: 1 }).select('_id title order').lean();
};

/**
 * deleteModule — removes module and its Vimeo video.
 * Recalculates course totalModules and totalDuration.
 */
const deleteModule = async (courseId, moduleId) => {
  const module = await Module.findOne({ _id: moduleId, courseId });
  if (!module) throw new AppError('Module not found', 404);

  // Delete video from Vimeo
  if (module.vimeoId) {
    await vimeoService.deleteVideo(module.vimeoId);
  }

  await module.deleteOne();

  // Decrement course counters
  await Course.findByIdAndUpdate(courseId, {
    $inc: {
      totalModules: -1,
      totalDuration: -(module.duration || 0),
    },
  });
};

/**
 * getModulePlayer
 * Returns a signed Vimeo embed token for an enrolled student to play a module.
 * The token expires in 2 hours and is tied to the session.
 */
const getModulePlayer = async (courseId, moduleId) => {
  const module = await Module.findOne({ _id: moduleId, courseId }).select(
    'vimeoId vimeoStatus title'
  );

  if (!module) throw new AppError('Module not found', 404);

  if (module.vimeoStatus !== 'ready') {
    throw new AppError('This module video is not ready yet. Please check back soon.', 409);
  }

  const embedToken = await vimeoService.generateEmbedToken(module.vimeoId);

  return {
    moduleId: module._id,
    title: module.title,
    vimeoId: module.vimeoId,
    embedToken,
  };
};

module.exports = {
  getModules,
  addModule,
  updateModule,
  handleVimeoWebhook,
  reorderModules,
  deleteModule,
  getModulePlayer,
};
