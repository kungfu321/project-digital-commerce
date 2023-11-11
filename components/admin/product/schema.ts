import * as z from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(1).max(255),
  sku: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.coerce.number().int(),
  discountPrice: z.coerce.number().int(),
  imageUrl: z.string().url(),
  isTrending: z.boolean(),
  stock: z.coerce.number().int(),
  maxPurchaseQuantity: z.coerce.number().int(),
  categoryId: z.string(),
  showNoteForm: z.boolean(),
  noteFormLabel: z.string().optional(),
  noteFormPlaceholder: z.string().optional(),
  noteFormDescription: z.string().optional(),
  status: z.string(),
  gallery: z.array(z.string().url()).optional(),
  variants: z.array(z.string()),
});
