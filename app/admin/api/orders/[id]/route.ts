import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: Number(params.id) },
      include: {
        user: true,
        orderItems: true,
        paymentMethod: true,
        affiliate: true,
        coupon: true,
        paymentTransaction: {
          include: {
            method: true
          }
        }
      }
    });

    return successResponseJson({
      data: order
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
