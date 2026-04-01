/**
 * Wraps async route handlers to eliminate try/catch boilerplate.
 * Forwards any thrown error to Express error middleware via next(err).
 *
 * Usage:
 *   router.post('/register', asyncHandler(authController.register));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
