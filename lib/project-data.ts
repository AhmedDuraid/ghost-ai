import { redirect } from "next/navigation"

import { AUTH_ROUTES } from "@/lib/auth-routes"
import { buildProjectAccessWhere, getCurrentProjectIdentity } from "@/lib/project-access"
import { prisma } from "@/lib/prisma"

export interface EditorProjectSummary {
  id: string
  name: string
  slug: string
  owned: boolean
}

export interface EditorProjectLists {
  ownedProjects: EditorProjectSummary[]
  sharedProjects: EditorProjectSummary[]
}

function slugifyProjectName(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "untitled-project"
}

function toEditorProjectSummary(
  project: {
    id: string
    name: string
    ownerId: string
  },
  userId: string
) {
  return {
    id: project.id,
    name: project.name,
    slug: slugifyProjectName(project.name),
    owned: project.ownerId === userId,
  } satisfies EditorProjectSummary
}

export async function getEditorProjectLists(
  identity?: Awaited<ReturnType<typeof getCurrentProjectIdentity>>
): Promise<EditorProjectLists> {
  const resolvedIdentity = identity ?? (await getCurrentProjectIdentity())

  if (!resolvedIdentity.userId) {
    redirect(AUTH_ROUTES.signIn)
  }

  const userId = resolvedIdentity.userId
  const accessWhere = buildProjectAccessWhere(resolvedIdentity)
  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
      },
    }),
    resolvedIdentity.primaryEmailAddress && accessWhere
      ? prisma.project.findMany({
          where: {
            ...accessWhere,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        })
      : Promise.resolve([]),
  ])

  return {
    ownedProjects: ownedProjects.map((project) =>
      toEditorProjectSummary(project, userId)
    ),
    sharedProjects: sharedProjects
      .filter((project) => project.ownerId !== userId)
      .map((project) => toEditorProjectSummary(project, userId)),
  }
}

export async function getAccessibleEditorProject(
  projectId: string,
  identity?: Awaited<ReturnType<typeof getCurrentProjectIdentity>>
) {
  const resolvedIdentity = identity ?? (await getCurrentProjectIdentity())
  const accessWhere = buildProjectAccessWhere(resolvedIdentity)

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
      name: true,
      ownerId: true,
    },
  })
}
