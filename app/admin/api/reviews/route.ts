import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = searchParams.get('skip') || 0;
    const take = searchParams.get('take') || 10;

    const reviews = await prisma.review.findMany({
      skip: Number(skip),
      take: Number(take),
    });

    return successResponseJson({
      data: reviews
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
