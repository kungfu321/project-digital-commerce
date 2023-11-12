import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

import prisma from "@/lib/prisma";
import { productSchema } from "../../schema";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { addLogEntry } from "@/lib/database";
import { isAuthenticatedSVOnly } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.$transaction(async (prismaTSC) => {
      const { isValidToken } = await isAuthenticatedSVOnly(request);
      const oldProduct = await prismaTSC.product.findUniqueOrThrow({
        where: { id: Number(params.id) },
      });

      const jsonData = await request.json();
      const { seo: seoData, ...data } = productSchema.parse(jsonData);
      const { seo: oldSeo, ...product } = await prismaTSC.product.update({
        where: { id: Number(params.id) },
        data,
        include: {
          seo: true
        }
      });

      const newSeo = await prismaTSC.seo.update({
        where: { id: product.seoId || 0 },
        data: seoData
      });

      await addLogEntry({
        entityId: product.id,
        userId: isValidToken.userId,
        newData: newSeo,
        oldData: oldSeo,
        action: 'UPDATE',
        entity: 'SEO'
      }, prismaTSC as PrismaClient);

      await addLogEntry({
        entityId: product.id,
        userId: isValidToken.userId,
        newData: product,
        oldData: oldProduct,
        action: 'UPDATE',
        entity: 'PRODUCT'
      }, prismaTSC as PrismaClient);

      return product;
    });

    return successResponseJson({
      data: product,
      tags: ['products', `product-${product.id}`]
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
