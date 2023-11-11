import prisma from "@/lib/prisma";
import { categorySchema } from "../schema";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();
    const data = categorySchema.parse(jsonData);

    const category = await prisma.category.create({ data });

    return successResponseJson({
      data: category,
      tags: ['categories']
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
