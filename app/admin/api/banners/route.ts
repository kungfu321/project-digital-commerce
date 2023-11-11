import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = Number(searchParams.get('skip') || 0);
    let take = Number(searchParams.get('take') || 10);

    const banners = await prisma.banner.findMany({
      skip,
      take,
    });

    const totalBanner = await prisma.banner.count();

    return successResponseJson({
      data: banners,
      pagination: {
        total: totalBanner,
        take,
        skip,
        pageCount: Math.ceil(totalBanner / take)
      }
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
