import * as z from 'zod';

export const userFormSchema = z.object({
  name: z.string().min(1).max(255),
  status: z.string(),
  role: z.string(),
  email: z.string().email(),
});