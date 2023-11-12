import { z } from 'zod';

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export const commentSchema = z.object({
  text: z.string().min(10),
  userId: z.number().int(),
  productId: z.number().int(),
});

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();
    const data = commentSchema.parse(jsonData);

    if (!data.productId) {
      throw { message: "Missing required field" };
    }

    const comment = await prisma.comment.create({ data });

    return successResponseJson({
      data: comment,
      tags: ['comments']
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
