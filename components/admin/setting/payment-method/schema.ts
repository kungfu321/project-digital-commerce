import * as z from 'zod';

export const paymentMethodFormSchema = z.object({
  name: z.string().min(1).max(255),
  code: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  isActive: z.boolean(),
});
