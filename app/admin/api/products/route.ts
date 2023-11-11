import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = Number(searchParams.get('skip') || 0);
    let take = Number(searchParams.get('take') || 10);
    const q = searchParams.get('q') || '';
    const isBestseller = searchParams.get('isBestseller');

    if (take > 50) {
      take = 50;
    }

    let query = {
      skip,
      take,
      where: {},
      include: {
        category: true
      }
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

    if (isBestseller) {
      const bestsellers = await prisma.orderItem.groupBy({
        by: ['productId'],
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take,
      });

      const bestsellerProductIds = bestsellers.map(({ productId }) => productId);

      query = {
        ...query,
        where: {
          ...query.where,
          id: {
            in: bestsellerProductIds,
          },
        },
      };
    }

    const products = await prisma.product.findMany(query);
    const totalProduct = await prisma.product.count();

    return successResponseJson({
      data: products,
      pagination: {
        total: totalProduct,
        take,
        skip,
        pageCount: Math.ceil(totalProduct / take)
      }
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
