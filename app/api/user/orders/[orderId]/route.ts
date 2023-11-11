import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await prisma.order.findUniqueOrThrow({
      where: {
        orderId: params.orderId
      },
      include: {
        orderItems: true,
      }
    });

    let coupon = null;
    if (order?.couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: order?.couponCode }
      });
    }

    return successResponseJson({
      data: {
        ...order,
        coupon
      }
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
