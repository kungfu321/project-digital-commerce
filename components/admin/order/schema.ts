import * as z from 'zod';

export const orderFormSchema = z.object({
  status: z.string(),
  note: z.string().optional(),
});

export const orderItemFormSchema = z.object({
  productIds: z.array(z.string()),
});
