import { z } from 'zod';

export const bannerSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  position: z.number().int(),
  backgroundUrl: z.string(),
});
