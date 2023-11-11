import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = Number(searchParams.get('skip') || 0);
    let take = Number(searchParams.get('take') || 10);

    const categories = await prisma.category.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        slug: true,
        name: true
      }
    });

    const totalCategory = await prisma.category.count({
      where: {
        status: 'PUBLISHED'
      },
    });

    return successResponseJson({
      data: categories,
      pagination: {
        total: totalCategory,
        take,
        skip,
        pageCount: Math.ceil(totalCategory / take)
      }
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
