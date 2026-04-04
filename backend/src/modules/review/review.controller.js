const reviewService = require('./review.service');
const { respond } = require('../../utils/ApiResponse');

const getReviews = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await reviewService.getReviews(req.params.courseId, {
    page: Number(page),
    limit: Number(limit),
  });
  return respond(res).success(result);
};

const createReview = async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.params.courseId, req.body);
  return respond(res).created({ review }, 'Review submitted');
};

const updateReview = async (req, res) => {
  const review = await reviewService.updateReview(req.user.id, req.params.courseId, req.body);
  return respond(res).success({ review }, 'Review updated');
};

const deleteReview = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  await reviewService.deleteReview(req.user.id, req.params.courseId, isAdmin);
  return respond(res).success(null, 'Review deleted');
};

module.exports = { getReviews, createReview, updateReview, deleteReview };
