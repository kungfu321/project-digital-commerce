import { Product } from "@prisma/client";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: { id: Number(params.id) },
      include: {
        category: true,
        seo: true
      }
    });

    let productsVariants: Product[] = [];
    if (product?.variants) {
      productsVariants = await prisma.product.findMany({
        where: {
          id: {
            in: product?.variants,
          },
        },
      });
    }

    return successResponseJson({
      data: {
        ...product,
        productsVariants
      }
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
