const { z } = require('zod');

/**
 * Zod schemas for auth endpoints.
 * These are the single source of truth for what shape of data is accepted.
 * The validate() middleware uses these and strips unknown fields automatically.
 */

const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name cannot exceed 60 characters')
    .trim(),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email')
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password too long') // bcrypt silently truncates at 72 chars
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  role: z
    .enum(['student', 'tutor'], {
      errorMap: () => ({ message: 'Role must be student or tutor' }),
    })
    .default('student'),
  // Admin accounts are created manually — never via public register
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email')
    .toLowerCase()
    .trim(),

  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

module.exports = { registerSchema, loginSchema };
