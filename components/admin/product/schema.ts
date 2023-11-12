import * as z from 'zod';

import { seoFormSchema } from '../seo/schema';

export const productFormSchema = z.object({
  name: z.string().min(1).max(255),
  sku: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  shortName: z.string().optional(),
  price: z.coerce.number().int().min(0),
  discountPrice: z.coerce.number().int().min(0),
  imageUrl: z.string().url(),
  isTrending: z.boolean(),
  stock: z.coerce.number().int().min(0),
  maxPurchaseQuantity: z.coerce.number().int().min(0),
  categoryId: z.string(),
  showNoteForm: z.boolean(),
  noteFormLabel: z.string().optional(),
  noteFormPlaceholder: z.string().optional(),
  noteFormDescription: z.string().optional(),
  status: z.string(),
  gallery: z.array(z.string().url()).optional(),
  variants: z.array(z.string()),
  seo: seoFormSchema
});
