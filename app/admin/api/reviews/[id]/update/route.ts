import prisma from "@/lib/prisma";
import { reviewSchema } from "../../schema";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.review.findUniqueOrThrow({
      where: { id: Number(params.id) },
    });

    const jsonData = await request.json();
    const data = reviewSchema.parse(jsonData);
    const review = await prisma.review.update({
      where: { id: Number(params.id) },
      data
    });

    return successResponseJson({
      data: review,
      tags: ['reviews', `review-${review.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
