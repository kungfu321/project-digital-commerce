import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1).max(255),
  role: z.enum(['ADMIN', 'CUSTOMER']),
  email: z.string().email(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});
