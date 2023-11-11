import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = Number(searchParams.get('skip') || 0);
    let take = Number(searchParams.get('take') || 10);

    if (take > 50) {
      take = 50;
    }

    const coupons = await prisma.coupon.findMany({
      skip,
      take,
    });

    const totalCoupon = await prisma.coupon.count();

    return successResponseJson({
      data: coupons,
      pagination: {
        total: totalCoupon,
        take,
        skip,
        pageCount: Math.ceil(totalCoupon / take)
      },
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
