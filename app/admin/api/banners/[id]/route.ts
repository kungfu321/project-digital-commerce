import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const banner = await prisma.banner.findUniqueOrThrow({
      where: { id: Number(params.id) },
    });

    return successResponseJson({
      data: banner,
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
