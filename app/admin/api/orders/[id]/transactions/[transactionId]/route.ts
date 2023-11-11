import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string, transactionId: string } }
) {
  try {
    const transaction = await prisma.paymentTransaction.findUniqueOrThrow({
      where: {
        id: Number(params.transactionId),
        orderId: Number(params.id),
      },
    });

    return successResponseJson({
      data: transaction
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
