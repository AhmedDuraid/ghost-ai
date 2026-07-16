import { prisma } from "@/lib/prisma"
import {
  getProjectById,
  getOwnedProject,
  jsonError,
  parseJsonBody,
  requireAuthenticatedUser,
} from "@/lib/project-api"
import {
  normalizeCollaboratorEmail,
  serializeProjectCollaborators,
} from "@/lib/project-collaborators"
import { buildProjectAccessWhere, getCurrentProjectIdentity } from "@/lib/project-access"

interface ProjectCollaboratorsRouteContext {
  params: Promise<{
    projectId: string
  }>
}

interface InviteCollaboratorRequestBody {
  email?: unknown
}

async function getAccessibleProjectCollaborators(
  projectId: string,
  identity: Awaited<ReturnType<typeof getCurrentProjectIdentity>>
) {
  const accessWhere = buildProjectAccessWhere(identity)

  if (!accessWhere) {
    return null
  }

  return prisma.project.findFirst({
    where: {
      id: projectId,
      ...accessWhere,
    },
    select: {
      id: true,
      ownerId: true,
      collaborators: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          collaboratorEmail: true,
          createdAt: true,
        },
      },
    },
  })
}

export async function GET(
  _request: Request,
  context: ProjectCollaboratorsRouteContext
) {
  const identity = await getCurrentProjectIdentity()

  if (!identity.userId) {
    return jsonError("Unauthorized", 401)
  }

  const { projectId } = await context.params
  const project = await getAccessibleProjectCollaborators(projectId, identity)

  if (!project) {
    const existingProject = await getProjectById(projectId)

    if (!existingProject) {
      return jsonError("Project not found", 404)
    }

    return jsonError("Forbidden", 403)
  }

  const collaborators = await serializeProjectCollaborators(project.collaborators)

  return Response.json({
    collaborators,
    viewerCanManageAccess: project.ownerId === identity.userId,
  })
}

export async function POST(
  request: Request,
  context: ProjectCollaboratorsRouteContext
) {
  const authResult = await requireAuthenticatedUser()

  if (authResult.response) {
    return authResult.response
  }

  const { projectId } = await context.params
  const ownedProject = await getOwnedProject(projectId, authResult.userId)

  if (!ownedProject) {
    const existingProject = await getProjectById(projectId)

    if (!existingProject) {
      return jsonError("Project not found", 404)
    }

    return jsonError("Forbidden", 403)
  }

  const body = await parseJsonBody(request)

  if (body === null) {
    return jsonError("Invalid JSON body", 400)
  }

  const collaboratorEmail = normalizeCollaboratorEmail(
    (body as InviteCollaboratorRequestBody).email
  )

  if (!collaboratorEmail) {
    return jsonError("A valid collaborator email is required", 400)
  }

  const identity = await getCurrentProjectIdentity()
  const ownerEmail = identity.primaryEmailAddress?.trim().toLowerCase() ?? null

  if (ownerEmail && collaboratorEmail === ownerEmail) {
    return jsonError("Project owners already have access", 400)
  }

  const existingCollaborator = await prisma.projectCollaborator.findFirst({
    where: {
      projectId,
      collaboratorEmail,
    },
    select: {
      id: true,
      collaboratorEmail: true,
      createdAt: true,
    },
  })

  if (existingCollaborator) {
    const [serializedCollaborator] = await serializeProjectCollaborators([
      existingCollaborator,
    ])

    return Response.json({
      collaborator: serializedCollaborator,
    })
  }

  const collaborator = await prisma.projectCollaborator.create({
    data: {
      projectId,
      collaboratorEmail,
    },
    select: {
      id: true,
      collaboratorEmail: true,
      createdAt: true,
    },
  })

  const [serializedCollaborator] = await serializeProjectCollaborators([collaborator])

  return Response.json(
    {
      collaborator: serializedCollaborator,
    },
    { status: 201 }
  )
}
