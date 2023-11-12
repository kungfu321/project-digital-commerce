import prisma from "@/lib/prisma";
import * as z from 'zod';
import { NextRequest } from "next/server";

import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { isAuthenticatedSVOnly } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  gender: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const { isValidToken } = await isAuthenticatedSVOnly(request);

    await prisma.user.findUniqueOrThrow({
      where: { id: isValidToken.userId },
    });

    const jsonData = await request.json();
    const data = profileSchema.parse(jsonData);

    const user = await prisma.user.update({
      where: { id: isValidToken.userId },
      data
    });

    return successResponseJson({
      data: user,
      tags: ['users', `user-${user.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
