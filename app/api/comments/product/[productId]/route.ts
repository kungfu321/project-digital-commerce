import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { isAuthenticatedSVOnly } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = Number(searchParams.get('skip') || 0);
    let take = Number(searchParams.get('take') || 10);

    if (take > 50) {
      take = 50;
    }

    const { isValidToken } = await isAuthenticatedSVOnly(request);

    let whereCondition = {};
    if (isValidToken) {
      whereCondition = {
        AND: [
          {
            OR: [
              {
                status: 'PUBLISHED',
              },
              {
                status: 'IN_REVIEW',
                userId: isValidToken.userId,
              }
            ]
          },
          {
            productId: Number(params.productId)
          }
        ],
      };
    } else {
      whereCondition = {
        status: 'PUBLISHED',
        productId: Number(params.productId)
      };
    }

    const comments = await prisma.comment.findMany({
      skip,
      take,
      where: whereCondition,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        createdAt: true,
        text: true,
        user: {
          select: {
            name: true,
            imageUrl: true,
            orders: {
              select: {
                userId: true,
              },
              where: {
                orderItems: {
                  some: {
                    productId: Number(params.productId),
                  },
                },
              },
            },
          },
        }
      }
    });

    const totalComments = await prisma.comment.count(
      { where: whereCondition }
    );

    return successResponseJson({
      data: comments,
      pagination: {
        total: totalComments,
        take,
        skip,
        pageCount: Math.ceil(totalComments / take)
      },
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
