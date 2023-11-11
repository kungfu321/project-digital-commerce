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

    if (take > 50) {
      take = 50;
    }

    const transactions = await prisma.paymentTransaction.findMany({
      skip,
      take,
      where: {
        order: {
          userId: isValidToken.userId
        },
        status: 'RECEIVED'
      },
      select: {
        updatedAt: true,
        amount: true,
        order: {
          select: {
            orderId: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
    });

    const wallet = await prisma.wallet.findUnique({
      where: { userId: isValidToken.userId },
      select: {
        amount: true
      }
    });

    const totalTransactions = await prisma.paymentTransaction.count({
      where: {
        order: {
          userId: isValidToken.userId
        },
        status: 'RECEIVED'
      },
    });

    return successResponseJson({
      data: {
        transactions,
        walletBalance: wallet?.amount || 0
      },
      pagination: {
        total: totalTransactions,
        take,
        skip,
        pageCount: Math.ceil(totalTransactions / take)
      },
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
