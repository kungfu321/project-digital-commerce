import * as z from 'zod';

export const transactionFormSchema = z.object({
  status: z.string(),
  methodId: z.string(),
  transactionId: z.string().optional(),
  note: z.string().optional(),
  amount: z.coerce.number().int(),
  transactionDate: z.coerce.date(),
});
