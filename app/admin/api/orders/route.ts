import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = Number(searchParams.get('skip') || 0);
    let take = Number(searchParams.get('take') || 10);
    let status = searchParams.get('status');

    if (take > 50) {
      take = 50;
    }

    let query: Prisma.OrderFindManyArgs = {
      skip,
      take,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    };

    if (status) {
      query = {
        ...query,
        where: {
          status
        }
      }
    }

    const orders = await prisma.order.findMany(query);

    const totalOrders = await prisma.order.count();

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
