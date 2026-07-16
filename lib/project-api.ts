import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

const DEFAULT_PROJECT_NAME = "Untitled Project";

export interface ProjectResponseShape {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  status: string;
  canvasJsonPath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JsonErrorResponse {
  error: string;
}

export function isValidProjectId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*-[a-z0-9]{6}$/.test(value)
  );
}

export function jsonError(message: string, status: number) {
  return Response.json(
    { error: message },
    { status },
  );
}

export async function requireAuthenticatedUser() {
  const { userId } = await auth();

  if (!userId) {
    return {
      response: jsonError("Unauthorized", 401),
      userId: null,
    };
  }

  return {
    response: null,
    userId,
  };
}

export function normalizeCreatedProjectName(name: unknown) {
  if (typeof name !== "string") {
    return DEFAULT_PROJECT_NAME;
  }

  const normalizedName = name.trim();

  if (!normalizedName) {
    return DEFAULT_PROJECT_NAME;
  }

  return normalizedName;
}

export function normalizeCreatedProjectId(id: unknown): string | null {
  if (!isValidProjectId(id)) {
    return null;
  }

  return id;
}

export function normalizeRenamedProjectName(name: unknown) {
  if (typeof name !== "string") {
    return null;
  }

  const normalizedName = name.trim();

  if (!normalizedName) {
    return null;
  }

  return normalizedName;
}

export async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function getOwnedProject(projectId: string, ownerId: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId,
    },
  });
}

export async function getProjectById(projectId: string) {
  return prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
}

export function serializeProject(project: Awaited<ReturnType<typeof prisma.project.findUniqueOrThrow>>) {
  return {
    id: project.id,
    ownerId: project.ownerId,
    name: project.name,
    description: project.description,
    status: project.status,
    canvasJsonPath: project.canvasJsonPath,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  } satisfies ProjectResponseShape;
}
