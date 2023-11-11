import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

import prisma from "@/lib/prisma";
import { paymentMethodSchema } from "../schema";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { addLogEntry } from "@/lib/database";
import { isAuthenticatedSVOnly } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const paymentMethod = await prisma.$transaction(async (prismaTSC) => {
      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const jsonData = await request.json();
      const data = paymentMethodSchema.parse(jsonData);

      const paymentMethod = await prismaTSC.paymentMethod.create({ data });

      await addLogEntry({
        entityId: paymentMethod.id,
        userId: isValidToken.userId,
        newData: paymentMethod,
        action: 'CREATE',
        entity: 'PAYMENT_METHOD'
      }, prismaTSC as PrismaClient);

      return paymentMethod;
    });

    return successResponseJson({
      data: paymentMethod,
      tags: ['paymentMethods']
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
