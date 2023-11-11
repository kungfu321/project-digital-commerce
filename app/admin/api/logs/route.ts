import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const skip = Number(searchParams.get('skip') || 0);
    let take = Number(searchParams.get('take') || 10);
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const entityId = searchParams.get('entityId');
    const userId = searchParams.get('userId');

    if (take > 50) {
      take = 50;
    }

    let query: Prisma.LogFindManyArgs = {
      skip,
      take,
      select: {
        id: true,
        action: true,
        entity: true,
        createdAt: true,
        oldData: true,
        newData: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    };

    if (action) {
      query = {
        ...query,
        where: { action }
      };
    }

    if (entity) {
      query = {
        ...query,
        where: { entity }
      };
    }

    if (entityId) {
      query = {
        ...query,
        where: { entityId: Number(entityId) }
      };
    }

    if (userId) {
      query = {
        ...query,
        where: { userId: Number(userId) }
      };
    }

    const logs = await prisma.log.findMany(query);

    return successResponseJson({
      data: logs,
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
