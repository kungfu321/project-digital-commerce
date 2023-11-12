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
      const { seo: seoData, ...productData } = productSchema.parse(jsonData);

      const seo = await prismaTSC.seo.create({ data: seoData });

      const product = await prismaTSC.product.create({
        data: {
          ...productData,
          seoId: seo.id
        }
      });

      await addLogEntry({
        entityId: product.id,
        userId: isValidToken.userId,
        newData: seo,
        action: 'CREATE',
        entity: 'SEO'
      }, prismaTSC as PrismaClient);

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
