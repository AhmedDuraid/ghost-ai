import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

import {
  PrismaClient,
  type PrismaClient as PrismaClientType,
} from "@/app/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

function getDatabaseUrl() {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }

  return databaseUrl;
}

function createPrismaClient() {
  const resolvedDatabaseUrl = getDatabaseUrl();

  if (resolvedDatabaseUrl.startsWith("prisma+postgres://")) {
    return new PrismaClient({
      accelerateUrl: resolvedDatabaseUrl,
    }).$extends(withAccelerate()) as unknown as PrismaClientType;
  }

  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: resolvedDatabaseUrl,
    }),
  }) as PrismaClientType;
}

type PrismaClientSingleton = PrismaClientType;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
