const User = require('../user/user.model');
const AppError = require('../../utils/AppError');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  buildTokenPayload,
} = require('../../utils/token');

/**
 * Auth Service — pure business logic, no HTTP concerns (req/res).
 * Controller calls these methods and handles the response.
 * This separation makes the logic independently testable.
 */

/**
 * registerUser
 * - Checks for duplicate email
 * - Creates user (password hashed in model pre-save hook)
 * - Returns token pair + safe user object
 */
const registerUser = async ({ name, email, password, role }) => {
  // Check duplicate — Mongoose will also throw code 11000, but this gives
  // a cleaner error message and avoids hitting the DB write path
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  // Prevent tutor role from being approved at registration
  const user = await User.create({
    name,
    email,
    password,
    role,
    // Initialize tutorProfile shell if registering as tutor
    ...(role === 'tutor' && {
      tutorProfile: {
        verificationStatus: 'pending',
        isApproved: false,
      },
    }),
  });

  const tokenPayload = buildTokenPayload(user);
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: user.toSafeObject(),
    accessToken,
    refreshToken,
  };
};

/**
 * loginUser
 * - Validates credentials
 * - Returns token pair + safe user object
 */
const loginUser = async ({ email, password }) => {
  // Explicitly select password — it's excluded by default (select: false in schema)
  const user = await User.findOne({ email }).select('+password +accountVersion');

  if (!user || !(await user.comparePassword(password))) {
    // Same error for both cases — don't leak which field is wrong
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 403);
  }

  const tokenPayload = buildTokenPayload(user);
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: user.toSafeObject(),
    accessToken,
    refreshToken,
  };
};

/**
 * refreshAccessToken
 * - Validates the refresh token from the HttpOnly cookie
 * - Issues a new access token (and optionally rotates the refresh token)
 */
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token missing', 401);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid or expired session. Please log in again.', 401);
  }

  const user = await User.findById(decoded.id).select('+accountVersion');
  if (!user || !user.isActive) {
    throw new AppError('User not found or deactivated', 401);
  }

  if (user.accountVersion !== decoded.accountVersion) {
    throw new AppError('Session expired due to account change. Please log in again.', 401);
  }

  const tokenPayload = buildTokenPayload(user);
  const newAccessToken = generateAccessToken(tokenPayload);
  // Rotate refresh token on each use (optional but more secure)
  const newRefreshToken = generateRefreshToken(tokenPayload);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

/**
 * getMe
 * - Returns the logged-in user's profile
 * - req.user is already attached by protect middleware
 */
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user.toSafeObject();
};

module.exports = { registerUser, loginUser, refreshAccessToken, getMe };
