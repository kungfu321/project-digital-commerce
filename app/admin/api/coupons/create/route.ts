import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { couponSchema } from "../schema";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { addLogEntry } from "@/lib/database";
import { isAuthenticatedSVOnly } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const coupon = await prisma.$transaction(async (prismaTSC) => {
      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const jsonData = await request.json();
      const data = couponSchema.parse(jsonData);

      if (data.maxDiscountValue > data.discount) {
        throw { message: 'Max discount value must be less than or equal to Discount value' };
      }

      const coupon = await prismaTSC.coupon.create({ data });

      await addLogEntry({
        entityId: coupon.id,
        userId: isValidToken.userId,
        newData: coupon,
        action: 'CREATE',
        entity: 'COUPON'
      }, prismaTSC as PrismaClient);

      return coupon;
    });

    return successResponseJson({
      data: coupon,
      tags: ['coupons']
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
