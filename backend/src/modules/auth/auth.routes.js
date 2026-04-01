const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authController = require('./auth.controller');
const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { registerSchema, loginSchema } = require('./auth.validation');

// ── Rate Limiters ─────────────────────────────────────────────────────────────

/**
 * Strict limiter for login/register — prevents brute force attacks.
 * 10 attempts per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Lighter limiter for token refresh — prevents token-refresh abuse.
 */
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many refresh requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Routes ────────────────────────────────────────────────────────────────────

// Public
router.post('/register', authLimiter, validate(registerSchema), asyncHandler(authController.register));
router.post('/login',    authLimiter, validate(loginSchema),    asyncHandler(authController.login));
router.post('/refresh-token', refreshLimiter, asyncHandler(authController.refreshToken));
router.post('/logout',   asyncHandler(authController.logout));

// Protected
router.get('/me', protect, asyncHandler(authController.getMe));

module.exports = router;
