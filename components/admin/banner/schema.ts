import * as z from 'zod';

export const bannerFormSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  status: z.string(),
  position: z.coerce.number().int(),
  backgroundUrl: z.string(),
});
