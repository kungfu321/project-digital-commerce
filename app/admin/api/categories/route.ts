import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = Number(searchParams.get('skip') || 0);
    let take = Number(searchParams.get('take') || 10);
    const q = searchParams.get('q') || '';

    if (take > 50) {
      take = 50;
    }

    let query = {
      skip,
      take,
      where: {}
    };

    if (q) {
      query = {
        ...query,
        where: {
          name: {
            contains: q
          }
        }
      };
    }

    const categories = await prisma.category.findMany(query);

    const totalCategory = await prisma.category.count();

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
