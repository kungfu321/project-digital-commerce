import prisma from "@/lib/prisma";
import { bannerSchema } from "../schema";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();
    const data = bannerSchema.parse(jsonData);

    const banner = await prisma.banner.create({ data });

    return successResponseJson({
      data: banner,
      tags: ['banners']
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
