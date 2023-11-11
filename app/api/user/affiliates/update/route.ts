import prisma from "@/lib/prisma";
import * as z from 'zod';
import { NextRequest } from "next/server";

import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { isAuthenticatedSVOnly } from "@/lib/auth";

export const affiliateSchema = z.object({
  earnings: z.number().min(0).max(5),
});

export async function PUT(request: NextRequest) {
  try {
    const { isValidToken } = await isAuthenticatedSVOnly(request);

    await prisma.user.findUniqueOrThrow({
      where: { id: isValidToken.userId },
    });

    const jsonData = await request.json();
    const data = affiliateSchema.parse(jsonData);
    const friendEarnings = 5 - data.earnings;

    const user = await prisma.affiliate.update({
      where: { userId: isValidToken.userId },
      data: {
        ...data,
        friendEarnings
      }
    });

    return successResponseJson({
      data: user,
      tags: ['affiliates', `affiliates-${user.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
