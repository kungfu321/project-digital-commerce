import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.category.findUniqueOrThrow({
      where: { id: Number(params.id) },
    });

    await prisma.category.delete({
      where: { id: Number(params.id) },
    });

    return successResponseJson({
      data: null,
      tags: ['categories', `category-${params.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
