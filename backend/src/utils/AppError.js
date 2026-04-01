/**
 * Custom application error class.
 * Throw this anywhere in your service/controller layer instead of generic Error.
 * The error middleware catches it and returns a clean JSON response.
 *
 * Usage:
 *   throw new AppError('Course not found', 404);
 *   throw new AppError('Email already registered', 409);
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;       // optional: array of field-level validation errors
    this.isOperational = true;  // distinguishes known errors from unexpected bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
