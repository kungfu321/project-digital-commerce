import * as z from 'zod';

export const couponFormSchema = z.object({
  name: z.string().min(3).max(255),
  code: z.string().min(3).max(255),
  discount: z.coerce.number().min(1),
  validFrom: z.date(),
  validTo: z.date(),
  quantity: z.coerce.number().min(1),
  maxDiscountValue: z.coerce.number().min(0),
  minOrderValue: z.coerce.number().min(0),
  type: z.string(),
  description: z.string().optional(),
  status: z.string(),
});
