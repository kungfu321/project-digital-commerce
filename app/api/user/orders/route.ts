import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { isAuthenticatedSVOnly } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = Number(searchParams.get('skip') || 0);
    let take = Number(searchParams.get('take') || 10);
    const { isValidToken } = await isAuthenticatedSVOnly(request);

    if (take > 50) {
      take = 50;
    }

    const orders = await prisma.order.findMany({
      skip,
      take,
      where: {
        userId: isValidToken.userId
      },
      orderBy: {
        createdAt: 'desc'
      },
    });

    const totalOrders = await prisma.order.count({
      where: {
        userId: isValidToken.userId
      }
    });

    return successResponseJson({
      data: orders,
      pagination: {
        total: totalOrders,
        take,
        skip,
        pageCount: Math.ceil(totalOrders / take)
      },
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
