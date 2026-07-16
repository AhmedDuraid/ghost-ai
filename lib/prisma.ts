import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

import { PrismaClient } from "@/app/generated/prisma/client";

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
    }).$extends(withAccelerate());
  }

  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: resolvedDatabaseUrl,
    }),
  });
}

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
