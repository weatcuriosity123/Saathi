const { z } = require('zod');

const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).trim().optional(),
  bio: z.string().max(500).optional(),
  expertise: z.array(z.string().trim().max(40)).max(10).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: 'Current password is required' }).min(1),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, 'Password must be at least 8 characters'),
});

module.exports = { updateProfileSchema, changePasswordSchema };
