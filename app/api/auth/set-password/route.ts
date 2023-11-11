import { z } from 'zod';
import bcrypt from 'bcrypt';

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from '@/lib/apiFormat';
import { senEmail } from '@/lib/mail';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  code: z.string().length(6),
}).refine(
  (values) => {
    return values.password === values.confirmPassword;
  },
  {
    message: "Passwords must match!",
    path: ["confirmPassword"],
  }
);

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();
    const data = registerSchema.parse(jsonData);

    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        verifyCode: data.code,
      },
    });

    if (!existingUser) {
      return Response.json({ message: 'Email is not valid' }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(data.password, 10);

    await prisma.$transaction(async (prismaTSC) => {
      await prismaTSC.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          verifyCode: null,
        },
      });

      await senEmail({
        email: data.email,
        subject: "Changed password with OKEYXIN",
        html: `<p>Your password was changed successfully</p>`
      });
    });

    return successResponseJson({
      data: null
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
