const courseService = require('./course.service');
const { respond } = require('../../utils/ApiResponse');

const listCourses = async (req, res) => {
  const result = await courseService.getCourses(req.query);
  return respond(res).success(result);
};

const getCourse = async (req, res) => {
  const userId = req.user?.id || null;
  const course = await courseService.getCourseById(req.params.id, userId);
  return respond(res).success({ course });
};

const createCourse = async (req, res) => {
  const course = await courseService.createCourse(req.user.id, req.body);
  return respond(res).created({ course }, 'Course created as draft');
};

const updateCourse = async (req, res) => {
  // req.course attached by isCourseOwner middleware
  const course = await courseService.updateCourse(req.course, req.body);
  return respond(res).success({ course }, 'Course updated');
};

const submitForReview = async (req, res) => {
  const course = await courseService.submitForReview(req.course);
  return respond(res).success({ course }, 'Course submitted for review');
};

const getMyDraftCourses = async (req, res) => {
  const courses = await courseService.getTutorCourses(req.user.id);
  return respond(res).success({ courses });
};

const deleteCourse = async (req, res) => {
  await courseService.deleteCourse(req.course);
  return respond(res).success(null, 'Course removed');
};

module.exports = {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  submitForReview,
  getMyDraftCourses,
  deleteCourse,
};
