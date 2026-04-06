const express = require('express');
const router = express.Router();

const asyncHandler = require('../../utils/asyncHandler');
const { protect } = require('../../middleware/auth.middleware');
const certificateController = require('./certificate.controller');

// Public: verify any certificate by ID
router.get('/verify/:certificateId', asyncHandler(certificateController.verifyCertificate));

// Protected: student views their own certificates
router.get('/my', protect, asyncHandler(certificateController.getMyCertificates));

module.exports = router;
