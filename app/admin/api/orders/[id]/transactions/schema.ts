import * as z from 'zod';

export const transactionSchema = z.object({
  status: z.enum(['PENDING', 'FAILED', 'RECEIVED']),
  methodId: z.coerce.number().int(),
  transactionId: z.string().optional(),
  note: z.string().optional(),
  amount: z.coerce.number().int(),
  transactionDate: z.coerce.date(),
});

export const updateTransactionSchema = z.object({
  status: z.enum(['FAILED', 'RECEIVED']),
  note: z.string().optional(),
});
