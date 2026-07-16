import { prisma } from "@/lib/prisma"
import { getProjectById, getOwnedProject, jsonError, requireAuthenticatedUser } from "@/lib/project-api"

interface DeleteProjectCollaboratorRouteContext {
  params: Promise<{
    projectId: string
    collaboratorId: string
  }>
}

export async function DELETE(
  _request: Request,
  context: DeleteProjectCollaboratorRouteContext
) {
  const authResult = await requireAuthenticatedUser()

  if (authResult.response) {
    return authResult.response
  }

  const { collaboratorId, projectId } = await context.params
  const ownedProject = await getOwnedProject(projectId, authResult.userId)

  if (!ownedProject) {
    const existingProject = await getProjectById(projectId)

    if (!existingProject) {
      return jsonError("Project not found", 404)
    }

    return jsonError("Forbidden", 403)
  }

  const collaborator = await prisma.projectCollaborator.findFirst({
    where: {
      id: collaboratorId,
      projectId,
    },
    select: {
      id: true,
    },
  })

  if (!collaborator) {
    return jsonError("Collaborator not found", 404)
  }

  await prisma.projectCollaborator.delete({
    where: {
      id: collaborator.id,
    },
  })

  return Response.json({ success: true })
}
