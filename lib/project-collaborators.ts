import { clerkClient } from "@clerk/nextjs/server"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ProjectCollaboratorRecord {
  id: string
  collaboratorEmail: string
  createdAt: Date
}

export interface ProjectCollaboratorSummary {
  id: string
  email: string
  displayName: string | null
  avatarImageUrl: string | null
  createdAt: string
}

export function normalizeCollaboratorEmail(email: unknown) {
  if (typeof email !== "string") {
    return null
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
    return null
  }

  return normalizedEmail
}

function getClerkUserDisplayName(user: {
  fullName: string | null
  firstName: string | null
  lastName: string | null
}) {
  const fullName = user.fullName?.trim()

  if (fullName) {
    return fullName
  }

  const composedName = [user.firstName, user.lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ")
    .trim()

  return composedName || null
}

async function getClerkProfilesByEmail(emails: string[]) {
  if (emails.length === 0) {
    return new Map<string, { displayName: string | null; avatarImageUrl: string | null }>()
  }

  try {
    const clerk = await clerkClient()
    const response = await clerk.users.getUserList({
      emailAddress: emails,
      limit: emails.length,
    })

    const profilesByEmail = new Map<
      string,
      {
        displayName: string | null
        avatarImageUrl: string | null
      }
    >()
    const requestedEmails = new Set(emails)

    for (const user of response.data) {
      const displayName = getClerkUserDisplayName(user)
      const avatarImageUrl = user.imageUrl || null

      for (const emailAddress of user.emailAddresses) {
        const normalizedEmail = emailAddress.emailAddress.trim().toLowerCase()

        if (!requestedEmails.has(normalizedEmail)) {
          continue
        }

        profilesByEmail.set(normalizedEmail, {
          displayName,
          avatarImageUrl,
        })
      }
    }

    return profilesByEmail
  } catch {
    return new Map<string, { displayName: string | null; avatarImageUrl: string | null }>()
  }
}

export async function serializeProjectCollaborators(
  collaborators: ProjectCollaboratorRecord[]
) {
  const uniqueEmails = [...new Set(collaborators.map((collaborator) => collaborator.collaboratorEmail))]
  const profilesByEmail = await getClerkProfilesByEmail(uniqueEmails)

  return collaborators.map((collaborator) => {
    const profile = profilesByEmail.get(collaborator.collaboratorEmail)

    return {
      id: collaborator.id,
      email: collaborator.collaboratorEmail,
      displayName: profile?.displayName ?? null,
      avatarImageUrl: profile?.avatarImageUrl ?? null,
      createdAt: collaborator.createdAt.toISOString(),
    } satisfies ProjectCollaboratorSummary
  })
}
