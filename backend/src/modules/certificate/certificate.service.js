const Certificate = require('./certificate.model');
const AppError = require('../../utils/AppError');

/**
 * getMyCertificates
 * Returns all certificates earned by a student.
 */
const getMyCertificates = async (userId) => {
  return Certificate.find({ userId })
    .populate('courseId', 'title slug thumbnail')
    .sort({ issuedAt: -1 })
    .lean();
};

/**
 * verifyCertificate
 * Public endpoint — anyone can verify a certificate by its ID.
 * Useful for employers checking legitimacy.
 */
const verifyCertificate = async (certificateId) => {
  const certificate = await Certificate.findOne({ certificateId })
    .populate('userId', 'name')
    .populate('courseId', 'title')
    .lean();

  if (!certificate) throw new AppError('Certificate not found or invalid ID', 404);

  return {
    valid: true,
    certificateId: certificate.certificateId,
    studentName: certificate.userId?.name,
    courseTitle: certificate.courseId?.title,
    issuedAt: certificate.issuedAt,
  };
};

module.exports = { getMyCertificates, verifyCertificate };
