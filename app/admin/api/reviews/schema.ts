import { z } from 'zod';

export const reviewSchema = z.object({
  productId: z.number().int(),
  userId: z.number().int(),
  rating: z.number().int().min(1).max(5),
  status: z.enum(['IN_REVIEW', 'PUBLISHED', 'HIDDEN']),
  content: z.string().optional(),
});
