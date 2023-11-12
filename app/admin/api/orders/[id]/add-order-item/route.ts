import { NextRequest } from "next/server";

import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";
import { orderItemsSchema } from "../../schema";
import { isAuthenticatedSVOnly } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { addLogEntry } from "@/lib/database";
import { absoluteUrl, getOrderStatusObject } from "@/lib/utils";
import { senEmail } from "@/lib/mail";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.$transaction(async (prismaTSC) => {
      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const jsonData = await request.json();
      const data = orderItemsSchema.parse(jsonData);

      const order = await prismaTSC.order.findUniqueOrThrow({
        where: { id: Number(params.id) },
        include: {
          coupon: true,
          orderItems: true
        }
      });

      const orderStatusObject = getOrderStatusObject(order.status);
      if (!orderStatusObject?.allowedUpdateOrderItems) {
        throw { message: 'Order status not allowed' };
      }

      const products = await prismaTSC.product.findMany({
        where: {
          id: {
            in: data.productIds
          },
          stock: {
            gte: 1
          }
        }
      });

      if (products.length !== data.productIds.length) {
        throw { message: 'Some products not valid' };
      }

      const promiseAllUpdateProducts = data.productIds.map(item =>
        prismaTSC.product.update({
          where: { id: item },
          data: {
            stock: {
              decrement: 1
            }
          }
        })
      );
      await Promise.all(promiseAllUpdateProducts);

      const newOrderItemsData = products.map(item => ({
        orderId: Number(params.id),
        productId: item.id,
        quantity: 1,
        productName: item.name,
        productPrice: item.price,
        productDiscountPrice: item.discountPrice,
        productImageUrl: item.imageUrl
      }));

      const promiseAllOrderItems = newOrderItemsData.map(item =>
        prismaTSC.orderItem.upsert({
          where: { orderId_productId: { orderId: item.orderId, productId: item.productId } },
          update: {
            quantity: {
              increment: 1
            }
          },
          create: item
        }));
      const newOrderItems = await Promise.all(promiseAllOrderItems);

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

      const promiseAll = newOrderItems.map(item => {
        const updateItem = order.orderItems.filter(oItem => oItem.id === item.id)[0];

        return addLogEntry({
          entityId: item.id,
          userId: isValidToken.userId,
          newData: item,
          oldData: updateItem,
          action: updateItem ? 'UPDATE' : 'ADD',
          entity: 'ORDER_ITEM'
        }, prismaTSC as PrismaClient);
      });

      await Promise.all(promiseAll);

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
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
