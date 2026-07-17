import { prisma } from "@/lib/prisma";
import {
  getOwnedProject,
  getProjectById,
  jsonError,
  normalizeRenamedProjectName,
  parseJsonBody,
  requireAuthenticatedUser,
  serializeProject,
} from "@/lib/project-api";

interface UpdateProjectRequestBody {
  name?: unknown;
}

interface ProjectRouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

export async function PATCH(
  request: Request,
  context: ProjectRouteContext,
) {
  const authResult = await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const { projectId } = await context.params;
  const existingProject = await getProjectById(projectId);

  if (!existingProject) {
    return jsonError("Project not found", 404);
  }

  if (existingProject.ownerId !== authResult.userId) {
    return jsonError("Forbidden", 403);
  }

  const body = await parseJsonBody(request);

  if (body === null) {
    return jsonError("Invalid JSON body", 400);
  }

  const { name } = body as UpdateProjectRequestBody;
  const normalizedName = normalizeRenamedProjectName(name);

  if (!normalizedName) {
    return jsonError("Project name is required", 400);
  }

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name: normalizedName,
    },
  });

  return Response.json({
    project: serializeProject(project),
  });
}

export async function DELETE(
  _request: Request,
  context: ProjectRouteContext,
) {
  const authResult = await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const { projectId } = await context.params;
  const ownedProject = await getOwnedProject(projectId, authResult.userId);

  if (!ownedProject) {
    const existingProject = await getProjectById(projectId);

    if (!existingProject) {
      return jsonError("Project not found", 404);
    }

    return jsonError("Forbidden", 403);
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return Response.json({ success: true });
}
