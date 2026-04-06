const adminService = require('./admin.service');
const { respond } = require('../../utils/ApiResponse');

// Dashboard
const getDashboardStats = async (req, res) => {
  const stats = await adminService.getDashboardStats();
  return respond(res).success({ stats });
};

// Users
const getAllUsers = async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const result = await adminService.getAllUsers({
    page: Number(page),
    limit: Number(limit),
    role,
    search,
  });
  return respond(res).success(result);
};

const toggleUserActive = async (req, res) => {
  const result = await adminService.toggleUserActive(req.params.userId);
  const msg = result.isActive ? 'User activated' : 'User deactivated';
  return respond(res).success(result, msg);
};

// Tutor management
const getPendingTutors = async (req, res) => {
  const tutors = await adminService.getPendingTutors();
  return respond(res).success({ tutors });
};

const getAllTutors = async (req, res) => {
  const tutors = await adminService.getAllTutors();
  return respond(res).success({ tutors });
};

const approveTutor = async (req, res) => {
  const user = await adminService.approveTutor(req.params.tutorId);
  return respond(res).success({ user }, 'Tutor approved');
};

const rejectTutor = async (req, res) => {
  const user = await adminService.rejectTutor(req.params.tutorId, req.body.note);
  return respond(res).success({ user }, 'Tutor rejected');
};

// Course review
const getCoursesUnderReview = async (req, res) => {
  const courses = await adminService.getCoursesUnderReview();
  return respond(res).success({ courses });
};

const publishCourse = async (req, res) => {
  const course = await adminService.publishCourse(req.params.courseId);
  return respond(res).success({ course }, 'Course published');
};

const rejectCourse = async (req, res) => {
  const course = await adminService.rejectCourse(req.params.courseId, req.body.note);
  return respond(res).success({ course }, 'Course sent back to draft with review note');
};

const unpublishCourse = async (req, res) => {
  const course = await adminService.unpublishCourse(req.params.courseId, req.body.note);
  return respond(res).success({ course }, 'Course unpublished');
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserActive,
  getPendingTutors,
  getAllTutors,
  approveTutor,
  rejectTutor,
  getCoursesUnderReview,
  publishCourse,
  rejectCourse,
  unpublishCourse,
};
