const { z } = require('zod');

const createReviewSchema = z.object({
  rating: z.coerce
    .number({ required_error: 'Rating is required' })
    .int()
    .min(1, 'Minimum rating is 1')
    .max(5, 'Maximum rating is 5'),
  comment: z.string().max(1000).optional(),
});

const updateReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  comment: z.string().max(1000).optional(),
});

module.exports = { createReviewSchema, updateReviewSchema };
