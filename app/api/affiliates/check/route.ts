import { z } from 'zod';
import { NextRequest } from 'next/server';

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { isAuthenticatedSVOnly } from '@/lib/auth';

const affiliateSchema = z.object({
  code: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const jsonData = await request.json();
    const data = affiliateSchema.parse(jsonData);

    const { isValidToken } = await isAuthenticatedSVOnly(request);

    const affiliate = await prisma.affiliate.findUnique({
      where: {
        code: data.code,
      },
      select: {
        code: true,
        friendEarnings: true,
      }
    });

    if (!affiliate) {
      throw { message: 'Ref code not valid' };
    }

    let discountPercent = 0;
    if (isValidToken) {
      const totalCompletedOrder = await prisma.order.count({
        where: {
          status: 'COMPLETED',
          userId: isValidToken.userId
        }
      });

      if (totalCompletedOrder <= 0) {
        discountPercent = affiliate.friendEarnings;
      }
    }

    return successResponseJson({
      data: {
        code: data.code,
        discountPercent
      },
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
