const AppError = require('../utils/AppError');

/**
 * Zod request validation middleware factory.
 * Pass a Zod schema and it validates req.body, attaching the parsed
 * (type-coerced, stripped) result back to req.body.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), authController.register);
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return next(new AppError('Validation failed', 400, errors));
  }

  // Replace req.body with the parsed output (strips unknown fields, applies defaults)
  req.body = result.data;
  next();
};

module.exports = validate;
