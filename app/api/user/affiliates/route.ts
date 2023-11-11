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
    const orders = await prisma.order.findMany({
      take,
      skip,
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        status: 'COMPLETED',
        affiliate: {
          userId: isValidToken.userId
        }
      },
      select: {
        createdAt: true,
        total: true,
        affiliateEarnings: true,
        orderItems: {
          select: {
            productName: true
          }
        }
      }
    });

    const totalCompletedOrder = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        affiliate: {
          userId: isValidToken.userId
        }
      },
      select: {
        total: true,
        affiliateEarnings: true
      }
    });

    const totalPointReceived = totalCompletedOrder.reduce((p, c) => p + (c.total * Number(c.affiliateEarnings)) / 100, 0);
    const totalOrder = totalCompletedOrder.length;

    const totalReferrer = await prisma.user.count({
      where: { referredById: isValidToken.userId }
    });

    return successResponseJson({
      data: {
        orders,
        point: {
          totalReferrer,
          totalPointReceived
        }
      },
      pagination: {
        total: totalOrder,
        take,
        skip,
        pageCount: Math.ceil(totalOrder / take)
      }
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
