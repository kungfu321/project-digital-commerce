import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const skip = Number(searchParams.get('skip') || 0);
    let take = Number(searchParams.get('take') || 10);

    const notifications = await prisma.notification.findMany({
      take,
      skip,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const totalNotification = await prisma.notification.count();

    return successResponseJson({
      data: notifications,
      pagination: {
        total: totalNotification,
        take,
        skip,
        pageCount: Math.ceil(totalNotification / take)
      }
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
