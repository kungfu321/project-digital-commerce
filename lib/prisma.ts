import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}

const prisma = globalThis.prisma;

export default prisma;
