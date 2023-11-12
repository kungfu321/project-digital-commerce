import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";
import { orderSchema } from "../../schema";
import { isAuthenticatedSVOnly } from "@/lib/auth";
import { addLogEntry } from "@/lib/database";
import { senEmail } from "@/lib/mail";
import { absoluteUrl, validateOrderStatus } from "@/lib/utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.$transaction(async (prismaTSC) => {
      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const { orderItems, ...oldOrder } = await prismaTSC.order.findUniqueOrThrow({
        where: { id: Number(params.id) },
        include: {
          orderItems: true
        }
      });

      const jsonData = await request.json();
      const data = orderSchema.parse(jsonData);

      const isValidStatus = validateOrderStatus(oldOrder.status, data.status);
      if (!isValidStatus) {
        throw { message: 'Status transition not allowed' }
      }

      const order = await prismaTSC.order.update({
        where: { id: Number(params.id) },
        data
      });

      if (data.status === 'COMPLETED' && oldOrder.status !== data.status) {
        const totalCompletedOrder = await prismaTSC.order.count({
          where: { status: 'COMPLETED', userId: order.userId }
        });

        if (totalCompletedOrder === 1) {
          await prismaTSC.order.updateMany({
            where: {
              userId: order.userId,
              id: {
                not: order.id
              },
            },
            data: {
              affiliateEarnings: 1,
              affiliateFriendEarnings: 0
            }
          });
        }
      }

      if (['CANCELLED', 'REFUNDED'].includes(data.status) && oldOrder.status !== data.status) {
        const promiseAllUpdateProducts = orderItems.map(item =>
          prismaTSC.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          })
        );
        await Promise.all(promiseAllUpdateProducts);
      }

      const haveChanged = await addLogEntry({
        entityId: oldOrder.id,
        userId: isValidToken.userId,
        oldData: oldOrder,
        newData: order,
        action: 'UPDATE',
        entity: 'ORDER'
      }, prismaTSC as PrismaClient);

      if (haveChanged) {
        const customer = await prismaTSC.user.findUnique({ where: { id: oldOrder.userId } });
        await senEmail({
          email: customer?.email || '',
          subject: "Your Order was changed on OKEYXIN",
          html: `<div>Your Order ${oldOrder.orderId} was changed, please check the detail <a href="${absoluteUrl(`/user/orders/${oldOrder.orderId}`)}">here</a></div>`
        });
      }

      return order;
    });

    return successResponseJson({
      data: order,
      tags: ['order', `order-${order.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
