import { z } from 'zod';

export const orderSchema = z.object({
  status: z.enum(['PENDING', 'ON_HOLD', 'PROCESSING', 'COMPLETED', 'REFUNDED', 'CANCELLED']),
});

export const orderItemsSchema = z.object({
  productIds: z.array(z.number()),
});
