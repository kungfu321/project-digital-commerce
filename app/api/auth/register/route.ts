import { z } from 'zod';
import bcrypt from 'bcrypt';

import prisma from "@/lib/prisma";
import { generateUniqueAffiliateCode, generateUniqueUserVerifyCode } from '@/lib/database';
import { errorResponseJson, successResponseJson } from '@/lib/apiFormat';
import { senEmail } from '@/lib/mail';

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  phoneNumber: z.string().optional(),
  referralCode: z.string().optional(),
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
      },
    });

    if (existingUser) {
      return Response.json({ message: 'Email is already registered' }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(data.password, 10);

    await prisma.$transaction(async (prismaTSC) => {
      const verifyCode = await generateUniqueUserVerifyCode();
      const newUser = await prismaTSC.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
          verifyCode,
        },
      });

      await prismaTSC.wallet.create({
        data: {
          userId: newUser.id
        }
      });

      if (data.referralCode) {
        const referringUser = await prismaTSC.affiliate.findFirst({
          where: {
            code: data.referralCode,
          },
        });

        if (referringUser) {
          await prismaTSC.user.update({
            where: { id: newUser.id },
            data: {
              referredById: referringUser.id,
            }
          });
        }
      }

      const affiliateCode = await generateUniqueAffiliateCode();
      await prismaTSC.affiliate.create({
        data: {
          userId: newUser.id,
          code: affiliateCode,
          friendEarnings: 5
        }
      });

      await senEmail({
        email: data.email,
        subject: "Confirm Your Email with OKEYXIN",
        html: `<p>Your confirmation code is: <strong>${verifyCode}</strong></p>`
      });
    });

    return successResponseJson({
      data: null
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
