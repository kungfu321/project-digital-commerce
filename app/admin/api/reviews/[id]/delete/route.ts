import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.review.findUniqueOrThrow({
      where: { id: Number(params.id) },
    });

    await prisma.review.delete({
      where: { id: Number(params.id) },
    });

    return successResponseJson({
      data: null,
      tags: ['reviews', `review-${params.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
