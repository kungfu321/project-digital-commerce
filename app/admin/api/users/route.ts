import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = Number(searchParams.get('skip') || 0);
    let take = Number(searchParams.get('take') || 10);
    const q = searchParams.get('q') || '';
    const role = searchParams.get('role');

    let query = {
      skip,
      take,
      where: {},
      include: {
        referredBy: {
          include: {
            user: true
          }
        }
      },
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

    if (role) {
      query = {
        ...query,
        where: {
          role
        }
      };
    }

    const users = await prisma.user.findMany(query);

    const totalCategory = await prisma.user.count();

    return successResponseJson({
      data: users,
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
