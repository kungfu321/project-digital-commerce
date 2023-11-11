import { z } from 'zod';

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from '@/lib/apiFormat';

const loginSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();
    const data = loginSchema.parse(jsonData);
    
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: data.email,
        verifyCode: data.code,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verifiedAt: new Date(),
        status: 'ACTIVE',
        verifyCode: null
      }
    });

    return successResponseJson({
      data: null
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
