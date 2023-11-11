import { z } from 'zod';
import { NextRequest } from 'next/server';
import { Product } from '@prisma/client';

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { isAuthenticatedSVOnly } from '@/lib/auth';
import { generateUniqueOrderId } from '@/lib/database';
import { senEmail } from '@/lib/mail';
import { absoluteUrl } from '@/lib/utils';

export const orderSchema = z.object({
  couponCode: z.string().min(3).optional(),
  refCode: z.string().min(6).optional(),
  paymentMethodId: z.number().int(),
  cart: z.array(z.object({
    id: z.number().int(),
    quantity: z.number().int(),
    note: z.string().optional(),
  }))
});

type CartItem = {
  quantity: number;
  cartNote?: string;
} & Product;

export async function POST(request: NextRequest) {
  const jsonData = await request.json();
  const data = orderSchema.parse(jsonData);

  try {
    const respData = await prisma.$transaction(async (prismaTSC) => {
      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const currentUser = await prismaTSC.user.findUnique({
        where: { id: isValidToken.userId },
        include: {
          referredBy: true
        }
      });

      const products = await prismaTSC.product.findMany({
        where: {
          id: {
            in: data.cart.map(item => item.id)
          }
        },
      });

      let subTotal = 0;
      let total = 0;
      let maxPurchaseQuantityCount = 0;
      const cartItems: CartItem[] = [];

      products.forEach((item) => {
        maxPurchaseQuantityCount += item.maxPurchaseQuantity;

        const { quantity, note } = data.cart.find(c => c.id === item.id) || {};
        subTotal += item.discountPrice * (quantity || 0);

        cartItems.push({
          ...item,
          quantity: quantity || 0,
          cartNote: note || undefined
        });
      });

      const totalQuantity = data.cart.reduce((p, c) => p + c.quantity, 0);

      if (products.length !== data.cart.length && totalQuantity > maxPurchaseQuantityCount) {
        return errorResponseJson({ message: 'Some products data not valid' });
      }

      total = subTotal;

      if (data.couponCode) {
        const totalUsed = await prismaTSC.order.count({
          where: { couponCode: data.couponCode }
        });

        const currentDate = new Date();
        const coupon = await prismaTSC.coupon.findUnique({
          where: {
            code: data.couponCode,
            status: 'ACTIVE',
            validFrom: { lte: currentDate },
            validTo: { gte: currentDate },
          }
        });

        if (!coupon || totalUsed >= coupon.quantity) {
          return errorResponseJson({ message: 'Coupon code not valid' });
        }

        total = coupon.type === 'fixed' ? total - coupon.discount : total - (total * coupon.discount / 100);
      }

      const totalCompletedOrder = await prismaTSC.order.count({
        where: { status: 'COMPLETED', userId: isValidToken.userId }
      });

      let affiliateData = {};

      if (data.refCode) {
        const affiliate = await prismaTSC.affiliate.findUnique({
          where: { code: data.refCode },
          select: { id: true, code: true, earnings: true, friendEarnings: true }
        });

        if (!affiliate) {
          return errorResponseJson({ message: 'Ref code not valid' });
        }

        affiliateData = {
          affiliateId: affiliate.id,
          affiliateFriendEarnings: totalCompletedOrder <= 0 ? affiliate.friendEarnings : 0,
          affiliateEarnings: totalCompletedOrder <= 0 ? affiliate.earnings : 1
        };

        if (!currentUser?.referredBy) {
          await prismaTSC.user.update({
            where: { id: isValidToken.userId },
            data: { referredById: affiliate.id }
          });
        }
      }

      if (!data.refCode && currentUser?.referredBy) {
        const affiliate = currentUser.referredBy;

        affiliateData = {
          affiliateId: affiliate.id,
          affiliateFriendEarnings: totalCompletedOrder <= 0 ? affiliate.friendEarnings : 0,
          affiliateEarnings: totalCompletedOrder <= 0 ? affiliate.earnings : 1
        };
      }

      const paymentMethod = await prismaTSC.paymentMethod.findUnique({
        where: { id: data.paymentMethodId, isActive: true }
      });

      if (!paymentMethod) {
        return errorResponseJson({ message: 'Payment method not valid' });
      }

      const orderId = await generateUniqueOrderId();
      const newOrder = {
        userId: isValidToken.userId,
        couponCode: data.couponCode,
        paymentMethodId: paymentMethod.id,
        subTotal,
        total,
        orderId,
        ...affiliateData
      };

      const order = await prismaTSC.order.create({
        data: newOrder,
        select: { id: true, total: true, orderId: true }
      });

      const newOrderItems = cartItems.map(({ id, quantity, cartNote: note, name: productName, price: productPrice, discountPrice: productDiscountPrice, imageUrl: productImageUrl }) => ({
        productId: id,
        orderId: order.id,
        quantity,
        note,
        productName,
        productPrice,
        productDiscountPrice,
        productImageUrl
      }));

      await prismaTSC.orderItem.createMany({ data: newOrderItems, skipDuplicates: true });

      let qrCodeValue = '';

      if (paymentMethod.code === 'momo') {
        qrCodeValue = `2|99|0999999999|||0|0|${order.total}|OKX${order.orderId}|transfer_myqr`;
      }

      await senEmail({
        email: currentUser?.email || '',
        subject: "You have new Order on OKEYXIN",
        html: `<div>Order ID: ${orderId} <a href="${absoluteUrl(`/user/orders/${orderId}`)}">Order detail</a></div>`
      });

      return {
        qrCodeValue,
        total: order.total,
        orderId
      }
    });

    return successResponseJson({
      data: respData,
      tags: ['orders']
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
