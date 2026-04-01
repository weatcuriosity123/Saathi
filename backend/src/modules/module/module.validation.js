const { z } = require('zod');

const createModuleSchema = z.object({
  title: z
    .string({ required_error: 'Module title is required' })
    .min(3, 'Title must be at least 3 characters')
    .max(120)
    .trim(),

  description: z.string().max(500).default(''),

  points: z.coerce.number().int().min(0).max(100).default(10),

  isFree: z.boolean().default(false),

  // fileSize is required to create the Vimeo TUS upload slot
  fileSize: z
    .number({ required_error: 'File size in bytes is required for upload slot creation' })
    .int()
    .positive(),
});

const updateModuleSchema = z.object({
  title: z.string().min(3).max(120).trim().optional(),
  description: z.string().max(500).optional(),
  points: z.coerce.number().int().min(0).max(100).optional(),
  isFree: z.boolean().optional(),
});

const reorderSchema = z.object({
  // Array of { moduleId, order } — full reorder map
  order: z
    .array(
      z.object({
        moduleId: z.string().length(24, 'Invalid module ID'),
        order: z.number().int().min(1),
      })
    )
    .min(1),
});

module.exports = { createModuleSchema, updateModuleSchema, reorderSchema };
