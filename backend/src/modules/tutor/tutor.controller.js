const tutorService = require('./tutor.service');
const { respond } = require('../../utils/ApiResponse');

const getProfile = async (req, res) => {
  const result = await tutorService.getProfile(req.params.tutorId);
  return respond(res).success(result);
};

const updateProfile = async (req, res) => {
  const user = await tutorService.updateProfile(req.user.id, req.body);
  return respond(res).success({ user }, 'Profile updated');
};

const changePassword = async (req, res) => {
  await tutorService.changePassword(req.user.id, req.body);
  return respond(res).success(null, 'Password changed. Please log in again with your new password.');
};

module.exports = { getProfile, updateProfile, changePassword };
