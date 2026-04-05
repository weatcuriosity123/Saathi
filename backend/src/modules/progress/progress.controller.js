const progressService = require('./progress.service');
const { respond } = require('../../utils/ApiResponse');

const getProgress = async (req, res) => {
  const progress = await progressService.getProgress(req.user.id, req.params.courseId);
  return respond(res).success({ progress });
};

const markComplete = async (req, res) => {
  const progress = await progressService.markModuleComplete(
    req.user.id,
    req.params.courseId,
    req.params.moduleId
  );
  return respond(res).success({ progress }, 'Module marked as complete');
};

const unmarkComplete = async (req, res) => {
  const progress = await progressService.unmarkModuleComplete(
    req.user.id,
    req.params.courseId,
    req.params.moduleId
  );
  return respond(res).success({ progress }, 'Module unmarked');
};

const getMyCourses = async (req, res) => {
  const data = await progressService.getMyCoursesWithProgress(req.user.id);
  return respond(res).success(data);
};

module.exports = { getProgress, markComplete, unmarkComplete, getMyCourses };
