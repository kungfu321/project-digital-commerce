import { JsonObject } from "@prisma/client/runtime/library";

import prisma from "./prisma";
import { isObjectEmpty } from "./utils";
import { PrismaClient } from "@prisma/client";

export async function generateUniqueUserVerifyCode(prismaTSC?: PrismaClient): Promise<string> {
  let verifyCode = "";
  let isCodeUnique = false;

  while (!isCodeUnique) {
    verifyCode = generateRandomCode();

    const existingAffiliate = await (prismaTSC ?? prisma).user.findUnique({
      where: { verifyCode },
    });

    isCodeUnique = !existingAffiliate;
  }

  return verifyCode;
}

export async function generateUniqueAffiliateCode(): Promise<string> {
  let code = "";
  let isCodeUnique = false;

  while (!isCodeUnique) {
    code = generateRandomCode();

    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { code },
    });

    isCodeUnique = !existingAffiliate;
  }

  return code;
}

export async function generateUniqueOrderId(): Promise<string> {
  let orderId = "";
  let isOrderIdUnique = false;

  while (!isOrderIdUnique) {
    orderId = generateRandomCode();

    const existingOrder = await prisma.order.findUnique({
      where: { orderId },
    });

    isOrderIdUnique = !existingOrder;
  }

  return orderId;
}

function generateRandomCode(): string {
  const length = 6;
  const characters = '0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export function getChangedFields<T>(
  originalObject: Partial<T> | undefined,
  updatedObject: Partial<T> | undefined,
  excludedFields: (keyof T)[] = []
): { changedFields: Partial<T>; oldFields: Partial<T> } {
  const changedFields: Partial<T> = {};
  const oldFields: Partial<T> = {};

  if (!originalObject && !updatedObject) {
    return { changedFields, oldFields };
  }

  if (!updatedObject) {
    return { changedFields, oldFields: originalObject! };
  }

  if (!originalObject) {
    return { changedFields: updatedObject, oldFields };
  }

  const excludedSet = new Set(excludedFields);

  (Object.keys(updatedObject ?? {}) as (keyof T)[]).forEach((key) => {
    if (!excludedSet.has(key) && originalObject && originalObject[key] !== updatedObject![key]) {
      if (originalObject[key] instanceof Date && updatedObject![key] instanceof Date &&
        (originalObject[key] as Date).getTime() !== (updatedObject![key] as Date).getTime()) {
        changedFields[key] = updatedObject![key];
        oldFields[key] = originalObject[key];
      } else {
        changedFields[key] = updatedObject![key];
        oldFields[key] = originalObject[key];
      }
    }
  });

  return { changedFields, oldFields };
}

export async function addLogEntry<T>(data: {
  userId: number,
  entityId: number,
  oldData?: T,
  newData?: T,
  action: string,
  entity: string,
}, prismaTSC?: PrismaClient): Promise<JsonObject | null> {
  const { changedFields, oldFields } = getChangedFields(data.oldData, data.newData, ['updatedAt' as keyof T]);
  if (!isObjectEmpty(changedFields) || !isObjectEmpty(oldFields)) {
    await (prismaTSC ?? prisma).log.create({
      data: {
        ...data,
        oldData: oldFields as JsonObject,
        newData: changedFields as JsonObject,
      }
    });

    return changedFields as JsonObject;
  }

  return null;
}
