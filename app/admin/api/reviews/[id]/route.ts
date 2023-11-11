import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const review = await prisma.review.findUniqueOrThrow({
      where: { id: Number(params.id) },
      include: {
        product: true
      }
    });

    return successResponseJson({
      data: review
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
