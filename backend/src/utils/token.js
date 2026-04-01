const jwt = require('jsonwebtoken');

/**
 * Token utility — single place for all JWT operations.
 * Never generate/verify tokens outside this file.
 */

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

/**
 * Builds the token payload from a user document.
 * Keep payload minimal — it's in every request.
 * accountVersion allows instant token invalidation on password change.
 */
const buildTokenPayload = (user) => ({
  id: user._id.toString(),
  role: user.role,
  accountVersion: user.accountVersion,
});

/**
 * Sets refresh token as an HttpOnly cookie.
 * HttpOnly = not accessible via JS → XSS can't steal it.
 * SameSite=Strict = CSRF protection.
 */
const setRefreshTokenCookie = (res, token) => {
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: sevenDays,
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  buildTokenPayload,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
