import { currentUser } from "@clerk/nextjs/server"

import { getCursorColorForUserId, getLiveblocksClient } from "@/lib/liveblocks"
import { prisma } from "@/lib/prisma"
import {
  isValidProjectId,
  jsonError,
  parseJsonBody,
  requireAuthenticatedUser,
} from "@/lib/project-api"
import { buildProjectAccessWhere, getCurrentProjectIdentity } from "@/lib/project-access"

interface LiveblocksAuthRequestBody {
  projectId?: unknown
}

interface AccessibleProjectRecord {
  id: string
}

async function getAccessibleProject(projectId: string) {
  const identity = await getCurrentProjectIdentity()
  const accessWhere = buildProjectAccessWhere(identity)

  if (!accessWhere) {
    return {
      identity,
      project: null,
    }
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ...accessWhere,
    },
    select: {
      id: true,
    },
  })

  return {
    identity,
    project: project satisfies AccessibleProjectRecord | null,
  }
}

function getLiveblocksUserName(user: Awaited<ReturnType<typeof currentUser>>) {
  const fullName = user?.fullName?.trim()

  if (fullName) {
    return fullName
  }

  const composedName = [user?.firstName, user?.lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ")
    .trim()

  if (composedName) {
    return composedName
  }

  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    null

  return primaryEmail ?? "Ghost AI User"
}

function getLiveblocksUserAvatar(user: Awaited<ReturnType<typeof currentUser>>) {
  return user?.imageUrl ?? ""
}

export async function POST(request: Request) {
  const authResult = await requireAuthenticatedUser()

  if (authResult.response) {
    return authResult.response
  }

  const body = await parseJsonBody(request)

  if (body === null) {
    return jsonError("Invalid JSON body", 400)
  }

  const projectId = (body as LiveblocksAuthRequestBody).projectId

  if (!isValidProjectId(projectId)) {
    return jsonError("A valid project ID is required", 400)
  }

  const [{ project }, user] = await Promise.all([
    getAccessibleProject(projectId),
    currentUser(),
  ])

  if (!project) {
    return jsonError("Forbidden", 403)
  }

  const name = getLiveblocksUserName(user)
  const avatar = getLiveblocksUserAvatar(user)
  const color = getCursorColorForUserId(authResult.userId)
  const liveblocks = getLiveblocksClient()

  await liveblocks.getOrCreateRoom(project.id, {
    defaultAccesses: ["room:write"],
  })

  const { status, body: liveblocksBody } = await liveblocks.identifyUser(
    authResult.userId,
    {
      userInfo: {
        name,
        avatar,
        color,
      },
    }
  )

  return new Response(liveblocksBody, {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
