"use client"

import { useEffect, useState } from "react"

interface ShareDialogCollaborator {
  id: string
  email: string
  displayName: string | null
  avatarImageUrl: string | null
  createdAt: string
}

interface ShareDialogCollaboratorsResponse {
  collaborators: ShareDialogCollaborator[]
  viewerCanManageAccess: boolean
}

interface ShareDialogCollaboratorResponse {
  collaborator: ShareDialogCollaborator
}

interface ShareDialogErrorResponse {
  error?: string
}

interface UseShareDialogOptions {
  canManageAccess: boolean
  projectId: string
}

async function getErrorMessage(response: Response) {
  const fallbackMessage = "Share request failed."

  try {
    const body = (await response.json()) as ShareDialogErrorResponse
    return body.error || fallbackMessage
  } catch {
    return fallbackMessage
  }
}

export function useShareDialog({
  canManageAccess,
  projectId,
}: UseShareDialogOptions) {
  const [isOpen, setIsOpen] = useState(false)
  const [collaborators, setCollaborators] = useState<ShareDialogCollaborator[]>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [removingCollaboratorId, setRemovingCollaboratorId] = useState<string | null>(
    null
  )
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [copied])

  async function loadCollaborators() {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`)

      if (!response.ok) {
        setErrorMessage(await getErrorMessage(response))
        return
      }

      const body = (await response.json()) as ShareDialogCollaboratorsResponse
      setCollaborators(body.collaborators)
    } finally {
      setIsLoading(false)
    }
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open)

    if (open) {
      void loadCollaborators()
      return
    }

    setErrorMessage(null)
    setInviteEmail("")
  }

  async function inviteCollaborator() {
    if (!canManageAccess) {
      return
    }

    const trimmedEmail = inviteEmail.trim()

    if (!trimmedEmail) {
      return
    }

    setIsInviting(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      })

      if (!response.ok) {
        setErrorMessage(await getErrorMessage(response))
        return
      }

      const body = (await response.json()) as ShareDialogCollaboratorResponse

      setCollaborators((current) => {
        const nextCollaborators = current.filter(
          (collaborator) => collaborator.id !== body.collaborator.id
        )
        nextCollaborators.push(body.collaborator)

        return nextCollaborators.sort((left, right) =>
          left.createdAt.localeCompare(right.createdAt)
        )
      })
      setInviteEmail("")
    } finally {
      setIsInviting(false)
    }
  }

  async function removeCollaborator(collaboratorId: string) {
    if (!canManageAccess) {
      return
    }

    setRemovingCollaboratorId(collaboratorId)
    setErrorMessage(null)

    try {
      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        setErrorMessage(await getErrorMessage(response))
        return
      }

      setCollaborators((current) =>
        current.filter((collaborator) => collaborator.id !== collaboratorId)
      )
    } finally {
      setRemovingCollaboratorId(null)
    }
  }

  async function copyProjectLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setErrorMessage(null)
    } catch {
      setErrorMessage("Unable to copy the project link.")
    }
  }

  return {
    canManageAccess,
    collaborators,
    copied,
    errorMessage,
    inviteEmail,
    isInviting,
    isLoading,
    isOpen,
    removingCollaboratorId,
    copyProjectLink,
    handleOpenChange,
    inviteCollaborator,
    loadCollaborators,
    removeCollaborator,
    setInviteEmail,
  }
}
