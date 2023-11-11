import prisma from "@/lib/prisma";

import { bannerSchema } from "../../schema";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.banner.findUniqueOrThrow({
      where: { id: Number(params.id) },
    });

    const jsonData = await request.json();
    const data = bannerSchema.parse(jsonData);
    const banner = await prisma.banner.update({
      where: { id: Number(params.id) },
      data
    });

    return successResponseJson({
      data: banner,
      tags: ['banners', `banner-${banner.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
