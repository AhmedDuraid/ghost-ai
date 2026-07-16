import { prisma } from "@/lib/prisma";
import {
  jsonError,
  normalizeCreatedProjectId,
  normalizeCreatedProjectName,
  parseJsonBody,
  requireAuthenticatedUser,
  serializeProject,
} from "@/lib/project-api";

interface CreateProjectRequestBody {
  id?: unknown;
  name?: unknown;
}

interface ListProjectsResponse {
  projects: ReturnType<typeof serializeProject>[];
}

interface ProjectResponse {
  project: ReturnType<typeof serializeProject>;
}

export async function GET() {
  const authResult = await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: authResult.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json({
    projects: projects.map(serializeProject),
  });
}

export async function POST(request: Request) {
  const authResult = await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const body = await parseJsonBody(request);

  if (body === null) {
    return jsonError("Invalid JSON body", 400);
  }

  const { name } = body as CreateProjectRequestBody;
  const projectId = normalizeCreatedProjectId((body as CreateProjectRequestBody).id);

  if (!projectId) {
    return jsonError("Project ID is required", 400);
  }

  const project = await prisma.project.create({
    data: {
      id: projectId,
      ownerId: authResult.userId,
      name: normalizeCreatedProjectName(name),
    },
  });

  return Response.json(
    { project: serializeProject(project) },
    { status: 201 },
  );
}
