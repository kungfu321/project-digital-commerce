import { z } from 'zod';

export const couponSchema = z.object({
  name: z.string().min(3).max(255),
  code: z.string().min(3).max(255),
  type: z.enum(['fixed', 'percent']),
  description: z.string().optional(),
  status: z.enum(['INACTIVE', 'ACTIVE']),
  discount: z.number().min(1),
  maxDiscountValue: z.number().min(0),
  minOrderValue: z.number().min(0),
  quantity: z.number().min(1),
  validFrom: z.coerce.date(),
  validTo: z.coerce.date(),
});

export const updateCouponSchema = z.object({
  status: z.enum(['INACTIVE', 'ACTIVE']),
});
