import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from '@/lib/apiFormat';
import { productSchema } from '../schema';
import { addLogEntry } from "@/lib/database";
import { isAuthenticatedSVOnly } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const product = await prisma.$transaction(async (prismaTSC) => {
      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const jsonData = await request.json();
      const productData = productSchema.parse(jsonData);

      const product = await prisma.product.create({
        data: productData
      });

      await addLogEntry({
        entityId: product.id,
        userId: isValidToken.userId,
        newData: product,
        action: 'CREATE',
        entity: 'PRODUCT'
      }, prismaTSC as PrismaClient);

      return product;
    });

    return successResponseJson({
      data: product,
      tags: ['products']
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
