import * as z from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string().optional(),
  status: z.string(),
});
