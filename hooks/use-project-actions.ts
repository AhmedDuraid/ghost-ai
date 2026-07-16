"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import type { EditorProjectSummary } from "@/lib/project-data"

interface ProjectResponseBody {
  project: {
    id: string
    name: string
  }
}

interface ErrorResponseBody {
  error?: string
}

type ProjectDialogMode = "create" | "rename" | "delete"

interface ProjectDialogState {
  mode: ProjectDialogMode
  project: EditorProjectSummary | null
}

interface UseProjectActionsOptions {
  activeProjectId?: string
}

function slugifyProjectName(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "untitled-project"
}

function createShortUniqueSuffix() {
  return Math.random().toString(36).slice(2, 8)
}

async function getErrorMessage(response: Response) {
  const fallbackMessage = "Project request failed."

  try {
    const body = (await response.json()) as ErrorResponseBody
    return body.error || fallbackMessage
  } catch {
    return fallbackMessage
  }
}

export function useProjectActions({
  activeProjectId,
}: UseProjectActionsOptions = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const [dialog, setDialog] = useState<ProjectDialogState | null>(null)
  const [projectName, setProjectName] = useState("")
  const [createSuffix, setCreateSuffix] = useState(() => createShortUniqueSuffix())
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const slugPreview = useMemo(() => {
    return `${slugifyProjectName(projectName)}-${createSuffix}`
  }, [createSuffix, projectName])

  function resetDialogState() {
    setDialog(null)
    setProjectName("")
    setErrorMessage(null)
  }

  function openCreateDialog() {
    setProjectName("")
    setCreateSuffix(createShortUniqueSuffix())
    setErrorMessage(null)
    setDialog({ mode: "create", project: null })
  }

  function openRenameDialog(project: EditorProjectSummary) {
    setProjectName(project.name)
    setErrorMessage(null)
    setDialog({ mode: "rename", project })
  }

  function openDeleteDialog(project: EditorProjectSummary) {
    setErrorMessage(null)
    setDialog({ mode: "delete", project })
  }

  function closeDialog() {
    if (isLoading) {
      return
    }

    resetDialogState()
  }

  async function submitCreateProject() {
    const trimmedName = projectName.trim()

    if (!trimmedName) {
      return
    }

    const projectId = `${slugifyProjectName(trimmedName)}-${createSuffix}`

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: projectId,
          name: trimmedName,
        }),
      })

      if (!response.ok) {
        setErrorMessage(await getErrorMessage(response))
        return
      }

      const body = (await response.json()) as ProjectResponseBody

      resetDialogState()
      router.push(`/editor/${body.project.id}`)
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  async function submitRenameProject() {
    const project = dialog?.project
    const trimmedName = projectName.trim()

    if (!project || !trimmedName) {
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      })

      if (!response.ok) {
        setErrorMessage(await getErrorMessage(response))
        return
      }

      resetDialogState()
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  async function submitDeleteProject() {
    const project = dialog?.project

    if (!project) {
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        setErrorMessage(await getErrorMessage(response))
        return
      }

      resetDialogState()

      if (project.id === activeProjectId || pathname === `/editor/${project.id}`) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    dialog,
    errorMessage,
    isLoading,
    projectName,
    setProjectName,
    slugPreview,
    closeDialog,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    submitCreateProject,
    submitDeleteProject,
    submitRenameProject,
  }
}
