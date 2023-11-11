import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const paymentMethod = await prisma.paymentMethod.findUniqueOrThrow({
      where: { id: Number(params.id) },
    });

    return successResponseJson({
      data: paymentMethod
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
