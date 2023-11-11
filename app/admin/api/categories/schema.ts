import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});
