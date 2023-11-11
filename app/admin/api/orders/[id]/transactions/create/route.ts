import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { transactionSchema } from "../schema";
import { isAuthenticatedSVOnly } from "@/lib/auth";
import { addLogEntry } from "@/lib/database";
import { getOrderStatusObject } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = await prisma.$transaction(async (prismaTSC) => {
      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const jsonData = await request.json();
      const data = transactionSchema.parse(jsonData);

      const { order, ...transaction } = await prismaTSC.paymentTransaction.create({
        data: {
          ...data,
          orderId: Number(params.id)
        },
        include: {
          order: true
        }
      });

      const orderStatusObject = getOrderStatusObject(order.status);
      if (!orderStatusObject?.allowedUpdateTransaction) {
        throw { message: 'Order status not allowed' };
      }

      await addLogEntry({
        entityId: transaction.id,
        userId: isValidToken.userId,
        newData: transaction,
        action: 'CREATE',
        entity: 'TRANSACTION'
      }, prismaTSC as PrismaClient);

      return transaction;
    });

    return successResponseJson({
      data: transaction,
      tags: ['transactions']
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
