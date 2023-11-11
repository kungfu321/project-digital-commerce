import { NextRequest } from 'next/server';

import { isAuthenticatedSVOnly } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from '@/lib/apiFormat';

export async function GET(request: NextRequest) {
  try {
    const { isValidToken } = await isAuthenticatedSVOnly(request);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: isValidToken.userId,
        status: 'ACTIVE'
      },
      include: {
        affiliate: true
      }
    });

    return successResponseJson({
      data: user
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
