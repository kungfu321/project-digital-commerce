import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = Number(searchParams.get('skip') || 0);
    let take = Number(searchParams.get('take') || 10);
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const newest = searchParams.get('newest');
    const isTrending = searchParams.get('isTrending');
    const isBestseller = searchParams.get('isBestseller');

    if (take > 50) {
      take = 50;
    }

    let countQuery: Prisma.ProductCountArgs = {

    };

    let query: Prisma.ProductFindManyArgs = {
      where: {
        status: 'PUBLISHED',
      },
    };

    if (q) {
      query = {
        ...query,
        where: {
          ...query.where,
          name: {
            contains: q.toLocaleLowerCase(),
            mode: 'insensitive'
          }
        }
      };
    }

    if (category) {
      query = {
        ...query,
        where: {
          ...query.where,
          category: {
            slug: category
          }
        },
      };
    }

    if (isTrending) {
      query = {
        ...query,
        where: {
          ...query.where,
          isTrending: Boolean(isTrending)
        },
      };
    }

    if (newest) {
      query = {
        ...query,
        orderBy: {
          updatedAt: 'asc'
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

    countQuery = { ...query } as Prisma.ProductCountArgs;

    query = {
      ...query,
      skip,
      take,
      select: {
        id: true,
        name: true,
        slug: true,
        stock: true,
        price: true,
        discountPrice: true,
        imageUrl: true
      }
    }

    const products = await prisma.product.findMany(query);

    const totalProduct = await prisma.product.count(countQuery);

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
