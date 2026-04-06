const certificateService = require('./certificate.service');
const { respond } = require('../../utils/ApiResponse');

const getMyCertificates = async (req, res) => {
  const certificates = await certificateService.getMyCertificates(req.user.id);
  return respond(res).success({ certificates });
};

const verifyCertificate = async (req, res) => {
  const result = await certificateService.verifyCertificate(req.params.certificateId);
  return respond(res).success(result);
};

module.exports = { getMyCertificates, verifyCertificate };
