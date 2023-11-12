import { z } from 'zod';

import prisma from "@/lib/prisma";
import { generateUniqueUserVerifyCode } from '@/lib/database';
import { errorResponseJson, successResponseJson } from '@/lib/apiFormat';
import { senEmail } from '@/lib/mail';

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();
    const data = resetPasswordSchema.parse(jsonData);

    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!existingUser) {
      return Response.json({ message: 'Email is not valid' }, { status: 400 });
    }
    const verifyCode = await generateUniqueUserVerifyCode();
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        verifyCode,
      },
    });

    await senEmail({
      email: data.email,
      subject: "Reset your password with OKEYXIN",
      html: `<p>Your confirmation code is: <strong>${verifyCode}</strong></p>`
    });

    return successResponseJson({
      data: null
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
