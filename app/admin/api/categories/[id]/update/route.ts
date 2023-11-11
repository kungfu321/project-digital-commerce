import prisma from "@/lib/prisma";
import { categorySchema } from "../../schema";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.category.findUniqueOrThrow({
      where: { id: Number(params.id) },
    });

    const jsonData = await request.json();
    const data = categorySchema.parse(jsonData);
    const category = await prisma.category.update({
      where: { id: Number(params.id) },
      data
    });

    return successResponseJson({
      data: category,
      tags: ['categories', `category-${category.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
