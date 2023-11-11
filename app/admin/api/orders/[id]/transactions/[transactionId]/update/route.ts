import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { updateTransactionSchema } from "../../schema";
import { isAuthenticatedSVOnly } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { addLogEntry } from "@/lib/database";
import { getOrderStatusObject } from "@/lib/utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string, transactionId: string } }
) {
  try {
    const transaction = await prisma.$transaction(async (prismaTSC) => {
      const jsonData = await request.json();
      const data = updateTransactionSchema.parse(jsonData);

      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const { order, ...oldTransaction } = await prismaTSC.paymentTransaction.findUniqueOrThrow({
        where: { id: Number(params.transactionId), orderId: Number(params.id) },
        include: {
          order: true
        }
      });

      const orderStatusObject = getOrderStatusObject(order.status);
      if (!orderStatusObject?.allowedUpdateTransaction) {
        throw { message: 'Order status not allowed' };
      }

      const transaction = await prismaTSC.paymentTransaction.update({
        where: { id: Number(params.transactionId), orderId: Number(params.id) },
        data
      });

      await addLogEntry({
        entityId: transaction.id,
        userId: isValidToken.userId,
        newData: transaction,
        oldData: oldTransaction,
        action: 'UPDATE',
        entity: 'TRANSACTION'
      }, prismaTSC as PrismaClient);

      return transaction;
    });

    return successResponseJson({
      data: transaction,
      tags: ['transactions', `transaction-${transaction.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
