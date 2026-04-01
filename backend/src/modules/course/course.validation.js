const { z } = require('zod');
const { CATEGORIES, LEVELS } = require('./course.model');

const createCourseSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(10, 'Title must be at least 10 characters')
    .max(120, 'Title cannot exceed 120 characters')
    .trim(),

  description: z
    .string({ required_error: 'Description is required' })
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),

  shortDescription: z.string().max(200).optional(),

  price: z
    .number({ required_error: 'Price is required', invalid_type_error: 'Price must be a number' })
    .min(0, 'Price cannot be negative')
    .max(10000, 'Price cannot exceed ₹10,000'),

  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${CATEGORIES.join(', ')}` }),
  }),

  level: z.enum(LEVELS).default('beginner'),

  language: z.string().max(30).default('English'),

  tags: z.array(z.string().max(30)).max(10, 'Maximum 10 tags').default([]),

  requirements: z.array(z.string().trim()).max(10).default([]),

  outcomes: z.array(z.string().trim()).max(20).default([]),
});

const updateCourseSchema = createCourseSchema.partial(); // all fields optional on update

const courseQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.enum(CATEGORIES).optional(),
  level: z.enum(LEVELS).optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  search: z.string().max(100).optional(),
  sort: z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'rating']).default('newest'),
});

module.exports = { createCourseSchema, updateCourseSchema, courseQuerySchema };
