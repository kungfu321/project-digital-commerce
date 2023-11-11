import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1).max(255),
  sku: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  variantLabel: z.string().optional(),
  shortName: z.string().optional(),
  price: z.number().min(0),
  discountPrice: z.number().min(0),
  imageUrl: z.string().url(),
  isTrending: z.boolean(),
  showNoteForm: z.boolean(),
  noteFormLabel: z.string().optional(),
  noteFormPlaceholder: z.string().optional(),
  noteFormDescription: z.string().optional(),
  stock: z.number().int().min(0),
  maxPurchaseQuantity: z.number().int(),
  categoryId: z.number().int().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  gallery: z.array(z.string().url()).optional(),
  variants: z.array(z.number()).optional(),
});
