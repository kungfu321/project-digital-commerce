import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: Number(params.id) },
    });

    return successResponseJson({
      data: user
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
