import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

import prisma from "@/lib/prisma";
import { userSchema } from "../../schema";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { addLogEntry } from "@/lib/database";
import { isAuthenticatedSVOnly } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.$transaction(async (prismaTSC) => {
      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const oldUser = await prismaTSC.user.findUniqueOrThrow({
        where: { id: Number(params.id) },
      });

      const jsonData = await request.json();
      const data = userSchema.parse(jsonData);
      const user = await prismaTSC.user.update({
        where: { id: Number(params.id) },
        data
      });

      await addLogEntry({
        entityId: oldUser.id,
        userId: isValidToken.userId,
        oldData: oldUser,
        newData: user,
        action: 'UPDATE',
        entity: 'USER'
      }, prismaTSC as PrismaClient);

      return user;
    });

    return successResponseJson({
      data: user,
      tags: ['users', `user-${user.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
