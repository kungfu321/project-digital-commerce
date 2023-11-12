import { z } from 'zod';

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

const commentSchema = z.object({
  code: z.string(),
});

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();
    const data = commentSchema.parse(jsonData);

    const totalUsed = await prisma.order.count({
      where: { couponCode: data.code }
    });

    const currentDate = new Date();
    const coupon = await prisma.coupon.findUnique({
      where: {
        code: data.code,
        status: 'ACTIVE',
        validFrom: {
          lte: currentDate,
        },
        validTo: {
          gte: currentDate,
        },
      },
      select: {
        code: true,
        quantity: true,
        type: true,
        discount: true
      }
    });

    if (!coupon || totalUsed >= coupon.quantity) {
      throw { message: 'Coupon code not valid' };
    }

    const { quantity, ...couponResp } = coupon;

    return successResponseJson({
      data: couponResp,
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
