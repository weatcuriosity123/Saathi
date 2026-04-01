const AppError = require('../utils/AppError');

/**
 * Global error handler — must be registered LAST in app.js (after all routes).
 * Express identifies it as error middleware because it has 4 params: (err, req, res, next).
 */
const errorMiddleware = (err, req, res, next) => {
  // Defaults
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // ── Mongoose: Document not found ────────────────────────────────────────
  if (err.name === 'CastError') {
    message = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  // ── Mongoose: Duplicate key (e.g. email already exists) ──────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    statusCode = 409;
  }

  // ── Mongoose: Validation error ────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    statusCode = 400;
  }

  // ── JWT: Token expired ────────────────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    message = 'Session expired. Please log in again.';
    statusCode = 401;
  }

  // ── JWT: Invalid token ────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token. Please log in again.';
    statusCode = 401;
  }

  // ── Log unexpected errors (not operational) ───────────────────────────────
  if (!err.isOperational) {
    console.error('[UNEXPECTED ERROR]', err);
  }

  const body = { success: false, message };
  if (errors) body.errors = errors;

  // Never leak stack traces to client in production
  if (process.env.NODE_ENV === 'development') {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};

module.exports = errorMiddleware;
