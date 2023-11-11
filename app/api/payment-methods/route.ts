import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET() {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        code: true
      }
    });

    return successResponseJson({
      data: paymentMethods,
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
