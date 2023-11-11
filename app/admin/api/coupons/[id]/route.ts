import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const coupon = await prisma.coupon.findUniqueOrThrow({
      where: { id: Number(params.id) },
    });

    return successResponseJson({
      data: coupon,
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
