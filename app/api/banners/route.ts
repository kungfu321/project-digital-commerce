import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        status: 'PUBLISHED'
      },
      orderBy: {
        position: 'asc'
      }
    });

    return successResponseJson({
      data: banners,
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
