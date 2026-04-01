const moduleService = require('./module.service');
const { respond } = require('../../utils/ApiResponse');

const getModules = async (req, res) => {
  // Pass user + enrollment flag so service can decide what to expose
  const user = req.user
    ? { ...req.user.toObject(), _isEnrolled: !!req.enrollment }
    : null;

  const modules = await moduleService.getModules(req.params.courseId, user);
  return respond(res).success({ modules });
};

const addModule = async (req, res) => {
  const { module, uploadUrl } = await moduleService.addModule(
    req.params.courseId,
    req.user.id,
    req.body
  );
  // uploadUrl is returned once — frontend must begin TUS upload immediately
  return respond(res).created({ module, uploadUrl }, 'Module created. Upload video to the provided URL.');
};

const updateModule = async (req, res) => {
  const module = await moduleService.updateModule(
    req.params.courseId,
    req.params.moduleId,
    req.body
  );
  return respond(res).success({ module }, 'Module updated');
};

const reorderModules = async (req, res) => {
  const modules = await moduleService.reorderModules(req.params.courseId, req.body.order);
  return respond(res).success({ modules }, 'Modules reordered');
};

const deleteModule = async (req, res) => {
  await moduleService.deleteModule(req.params.courseId, req.params.moduleId);
  return respond(res).success(null, 'Module deleted');
};

const getModulePlayer = async (req, res) => {
  const playerData = await moduleService.getModulePlayer(
    req.params.courseId,
    req.params.moduleId
  );
  return respond(res).success(playerData);
};

// Called by Vimeo's webhook system
const vimeoWebhook = async (req, res) => {
  const event = req.body;
  // Vimeo sends different event types — we only care about transcode completion
  if (event.type === 'video.transcode.complete' || event.type === 'video.available') {
    const vimeoId = event.data?.video?.uri?.split('/').pop();
    await moduleService.handleVimeoWebhook({
      vimeoId,
      status: 'available',
      duration: event.data?.video?.duration || 0,
    });
  }
  // Always return 200 quickly — Vimeo retries on non-200
  return respond(res).success(null, 'Webhook received');
};

module.exports = {
  getModules,
  addModule,
  updateModule,
  reorderModules,
  deleteModule,
  getModulePlayer,
  vimeoWebhook,
};
