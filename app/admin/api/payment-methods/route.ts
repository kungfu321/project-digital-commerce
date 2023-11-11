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

    const paymentMethods = await prisma.paymentMethod.findMany({
      skip,
      take,
    });

    const totalPaymentMethod = await prisma.product.count();

    return successResponseJson({
      data: paymentMethods,
      pagination: {
        total: totalPaymentMethod,
        take,
        skip,
        pageCount: Math.ceil(totalPaymentMethod / take)
      }
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
