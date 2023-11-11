import { z } from 'zod';

export const paymentMethodSchema = z.object({
  name: z.string().min(1).max(255),
  code: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  isActive: z.boolean(),
});
