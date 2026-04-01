const { verifyAccessToken } = require('../utils/token');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../modules/user/user.model');

/**
 * protect — verifies the JWT and attaches the user to req.user.
 *
 * Token location: Authorization: Bearer <token>
 *
 * Security checks performed:
 *  1. Token exists and is a valid JWT
 *  2. User still exists in DB (not deleted)
 *  3. accountVersion matches — catches tokens issued before a password change
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication token missing', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token); // throws JsonWebTokenError / TokenExpiredError

  // Pull minimal user data — only what's needed for auth checks
  const user = await User.findById(decoded.id).select(
    '_id name email role isActive accountVersion'
  );

  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Contact support.', 403);
  }

  // Invalidates tokens issued before a password change
  if (user.accountVersion !== decoded.accountVersion) {
    throw new AppError('Session expired due to account change. Please log in again.', 401);
  }

  req.user = user;
  next();
});

/**
 * restrictTo — role-based access control.
 * Always used AFTER protect.
 *
 * Usage:
 *   router.get('/admin/tutors', protect, restrictTo('admin'), getTutors);
 *   router.post('/course', protect, restrictTo('tutor', 'admin'), createCourse);
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

module.exports = { protect, restrictTo };
