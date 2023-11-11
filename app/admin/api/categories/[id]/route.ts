import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUniqueOrThrow({
      where: { id: Number(params.id) },
    });

    return successResponseJson({
      data: category
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
