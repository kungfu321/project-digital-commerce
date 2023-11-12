import * as z from 'zod';

export const seoFormSchema = z.object({
  title: z.string(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
  entityData: z.string().optional(),
});
