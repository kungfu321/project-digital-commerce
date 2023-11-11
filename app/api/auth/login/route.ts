import { z } from 'zod';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import { signJwtToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from '@/lib/apiFormat';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();
    const data = loginSchema.parse(jsonData);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: data.email,
        status: 'ACTIVE'
      },
    });

    
    
    const isPasswordValid = bcrypt.compareSync(data.password, user.password as string);
    
    if (!isPasswordValid) {
      throw new Error;
    }
    
    const token = await signJwtToken({ userId: user.id, role: user.role }) as string;

    const response = successResponseJson({
      data: user
    });

    response.cookies.set({
      name: 'token',
      value: token,
    });

    return response;
  } catch (error) {
    return errorResponseJson(error);
  }
}
