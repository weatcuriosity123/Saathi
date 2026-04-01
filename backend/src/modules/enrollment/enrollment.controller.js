const enrollmentService = require('./enrollment.service');
const { respond } = require('../../utils/ApiResponse');

const initiateEnrollment = async (req, res) => {
  const result = await enrollmentService.initiateEnrollment(req.user.id, req.params.courseId);

  if (result.free) {
    return respond(res).created({ enrollment: result.enrollment }, 'Enrolled successfully (free course)');
  }

  return respond(res).success(result, 'Order created. Complete payment to enroll.');
};

const verifyPayment = async (req, res) => {
  const enrollment = await enrollmentService.verifyPayment(req.user.id, req.body);
  return respond(res).success({ enrollment }, 'Payment verified. You are now enrolled!');
};

/**
 * Razorpay webhook — raw body is needed for HMAC verification.
 * express.raw() is applied in the route, not globally, so JSON body
 * parser doesn't interfere with the signature check.
 */
const razorpayWebhook = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  await enrollmentService.handleRazorpayWebhook(req.body.toString(), signature);
  return respond(res).success(null, 'Webhook processed');
};

const getMyEnrollments = async (req, res) => {
  const enrollments = await enrollmentService.getMyEnrollments(req.user.id);
  return respond(res).success({ enrollments });
};

const checkEnrollment = async (req, res) => {
  const result = await enrollmentService.checkEnrollment(req.user.id, req.params.courseId);
  return respond(res).success(result);
};

module.exports = {
  initiateEnrollment,
  verifyPayment,
  razorpayWebhook,
  getMyEnrollments,
  checkEnrollment,
};
