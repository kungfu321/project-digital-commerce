import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { paymentMethodSchema } from "../../schema";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { addLogEntry } from "@/lib/database";
import { isAuthenticatedSVOnly } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentMethod = await prisma.$transaction(async (prismaTSC) => {
      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const oldPaymentMethod = await prisma.paymentMethod.findUniqueOrThrow({
        where: { id: Number(params.id) },
      });

      const jsonData = await request.json();
      const data = paymentMethodSchema.parse(jsonData);
      const paymentMethod = await prismaTSC.paymentMethod.update({
        where: { id: Number(params.id) },
        data
      });

      await addLogEntry({
        entityId: paymentMethod.id,
        userId: isValidToken.userId,
        newData: paymentMethod,
        oldData: oldPaymentMethod,
        action: 'UPDATE',
        entity: 'PAYMENT_METHOD'
      }, prismaTSC as PrismaClient);

      return paymentMethod;
    });

    return successResponseJson({
      data: paymentMethod,
      tags: ['paymentMethods', `paymentMethods-${paymentMethod.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
