import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";
import { addLogEntry } from "@/lib/database";
import { isAuthenticatedSVOnly } from "@/lib/auth";
import { senEmail } from "@/lib/mail";
import { absoluteUrl, getOrderStatusObject } from "@/lib/utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, orderItemId: string } }
) {
  try {
    await prisma.$transaction(async (prismaTSC) => {
      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const searchParams = request.nextUrl.searchParams;
      const orderItemId = searchParams.get('orderItemId');

      const { order, ...orderItem } = await prismaTSC.orderItem.findUniqueOrThrow({
        where: { orderId: Number(params.id), id: Number(orderItemId) },
        include: {
          order: {
            include: {
              coupon: true
            }
          }
        }
      });

      const orderStatusObject = getOrderStatusObject(order.status);
      if (!orderStatusObject?.allowedUpdateOrderItems) {
        throw { message: 'Order status not allowed' };
      }

      await prismaTSC.orderItem.delete({
        where: { orderId: Number(params.id), id: Number(orderItemId) },
      });

      const orderItems = await prismaTSC.orderItem.findMany({
        where: { orderId: Number(params.id) },
      });
      const subTotal = orderItems.reduce((p, c) => p + c.productDiscountPrice * c.quantity, 0);
      let total = subTotal;
      if (order.coupon) {
        const coupon = order.coupon;

        if (coupon.type === 'fixed') {
          total = total - coupon.discount;
        } else {
          total = total - (total * coupon.discount / 100);
        }
      }
      await prismaTSC.order.update({
        where: { id: Number(params.id) },
        data: {
          total,
          subTotal
        }
      });

      await prismaTSC.product.update({
        where: { id: orderItem.productId },
        data: {
          stock: {
            increment: orderItem.quantity
          }
        }
      });

      await addLogEntry({
        entityId: orderItem.id,
        userId: isValidToken.userId,
        oldData: orderItem,
        action: 'DELETE',
        entity: 'ORDER_ITEM'
      }, prismaTSC as PrismaClient);

      const customer = await prismaTSC.user.findUnique({ where: { id: order.userId } });
      await senEmail({
        email: customer?.email || '',
        subject: "Your Order was changed on OKEYXIN",
        html: `<div>Your Order ${order.orderId} was changed, please check the detail <a href="${absoluteUrl(`/user/orders/${order.orderId}`)}">here</a></div>`
      });
    });

    return successResponseJson({
      data: null,
      tags: [`order-${params.id}`],
      paths: [`/admin/orders/${params.id}/update`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
