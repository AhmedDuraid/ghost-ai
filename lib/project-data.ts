import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { AUTH_ROUTES } from "@/lib/auth-routes"
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

async function getCurrentUserEmailAddress() {
  const user = await currentUser()

  return (
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    null
  )
}

export async function getEditorProjectLists(): Promise<EditorProjectLists> {
  const { userId } = await auth()

  if (!userId) {
    redirect(AUTH_ROUTES.signIn)
  }

  const emailAddress = await getCurrentUserEmailAddress()
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
    emailAddress
      ? prisma.project.findMany({
          where: {
            collaborators: {
              some: {
                collaboratorEmail: emailAddress,
              },
            },
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

export async function getAccessibleEditorProject(projectId: string) {
  const { userId } = await auth()

  if (!userId) {
    redirect(AUTH_ROUTES.signIn)
  }

  const emailAddress = await getCurrentUserEmailAddress()

  return prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        {
          ownerId: userId,
        },
        ...(emailAddress
          ? [
              {
                collaborators: {
                  some: {
                    collaboratorEmail: emailAddress,
                  },
                },
              },
            ]
          : []),
      ],
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
    },
  })
}
