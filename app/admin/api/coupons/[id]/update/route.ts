import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { updateCouponSchema } from "../../schema";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { addLogEntry } from "@/lib/database";
import { isAuthenticatedSVOnly } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const coupon = await prisma.$transaction(async (prismaTSC) => {
      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const oldCoupon = await prismaTSC.coupon.findUniqueOrThrow({
        where: { id: Number(params.id) },
      });

      const jsonData = await request.json();
      const data = updateCouponSchema.parse(jsonData);

      const coupon = await prismaTSC.coupon.update({
        where: { id: Number(params.id) },
        data
      });

      await addLogEntry({
        entityId: coupon.id,
        userId: isValidToken.userId,
        newData: coupon,
        oldData: oldCoupon,
        action: 'UPDATE',
        entity: 'COUPON'
      }, prismaTSC as PrismaClient);

      return coupon;
    });

    return successResponseJson({
      data: coupon,
      tags: ['coupons', `coupon-${coupon.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
