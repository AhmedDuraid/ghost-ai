import { auth, currentUser } from "@clerk/nextjs/server"

export interface ProjectAccessIdentity {
  userId: string | null
  primaryEmailAddress: string | null
}

interface ProjectAccessWhere {
  OR: Array<
    | {
        ownerId: string
      }
    | {
        collaborators: {
          some: {
            collaboratorEmail: string
          }
        }
      }
  >
}

export async function getCurrentProjectIdentity(): Promise<ProjectAccessIdentity> {
  const { userId } = await auth()

  if (!userId) {
    return {
      userId: null,
      primaryEmailAddress: null,
    }
  }

  const user = await currentUser()

  return {
    userId,
    primaryEmailAddress:
      user?.primaryEmailAddress?.emailAddress ??
      user?.emailAddresses[0]?.emailAddress ??
      null,
  }
}

export function buildProjectAccessWhere(
  identity: ProjectAccessIdentity
): ProjectAccessWhere | null {
  if (!identity.userId) {
    return null
  }

  return {
    OR: [
      {
        ownerId: identity.userId,
      },
      ...(identity.primaryEmailAddress
        ? [
            {
              collaborators: {
                some: {
                  collaboratorEmail: identity.primaryEmailAddress,
                },
              },
            },
          ]
        : []),
    ],
  }
}
