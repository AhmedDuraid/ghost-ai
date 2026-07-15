"use client"

import { useMemo, useState } from "react"

export interface ProjectSummary {
  id: string
  name: string
  slug: string
  owned: boolean
}

type ProjectDialogMode = "create" | "rename" | "delete"

interface ProjectDialogState {
  mode: ProjectDialogMode
  project: ProjectSummary | null
}

const MOCK_PROJECTS: ProjectSummary[] = [
  {
    id: "project-realtime-docs",
    name: "Realtime Docs Platform",
    slug: "realtime-docs-platform",
    owned: true,
  },
  {
    id: "project-payment-mesh",
    name: "Payment Mesh",
    slug: "payment-mesh",
    owned: true,
  },
  {
    id: "project-observability-hub",
    name: "Observability Hub",
    slug: "observability-hub",
    owned: false,
  },
]

function createProjectSlug(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "untitled-project"
}

function createProjectId(name: string) {
  return `project-${createProjectSlug(name)}-${Date.now().toString(36)}`
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<ProjectSummary[]>(MOCK_PROJECTS)
  const [dialog, setDialog] = useState<ProjectDialogState | null>(null)
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const slugPreview = useMemo(() => createProjectSlug(projectName), [projectName])

  const ownedProjects = useMemo(
    () => projects.filter((project) => project.owned),
    [projects]
  )

  const sharedProjects = useMemo(
    () => projects.filter((project) => !project.owned),
    [projects]
  )

  function openCreateDialog() {
    setProjectName("")
    setDialog({ mode: "create", project: null })
  }

  function openRenameDialog(project: ProjectSummary) {
    setProjectName(project.name)
    setDialog({ mode: "rename", project })
  }

  function openDeleteDialog(project: ProjectSummary) {
    setDialog({ mode: "delete", project })
  }

  function closeDialog() {
    if (isLoading) {
      return
    }

    setDialog(null)
    setProjectName("")
  }

  function submitCreateProject() {
    const trimmedName = projectName.trim()

    if (!trimmedName) {
      return
    }

    setIsLoading(true)
    setProjects((currentProjects) => [
      {
        id: createProjectId(trimmedName),
        name: trimmedName,
        slug: createProjectSlug(trimmedName),
        owned: true,
      },
      ...currentProjects,
    ])
    setIsLoading(false)
    setDialog(null)
    setProjectName("")
  }

  function submitRenameProject() {
    const project = dialog?.project
    const trimmedName = projectName.trim()

    if (!project || !trimmedName) {
      return
    }

    setIsLoading(true)
    setProjects((currentProjects) =>
      currentProjects.map((currentProject) =>
        currentProject.id === project.id
          ? {
              ...currentProject,
              name: trimmedName,
              slug: createProjectSlug(trimmedName),
            }
          : currentProject
      )
    )
    setIsLoading(false)
    setDialog(null)
    setProjectName("")
  }

  function submitDeleteProject() {
    const project = dialog?.project

    if (!project) {
      return
    }

    setIsLoading(true)
    setProjects((currentProjects) =>
      currentProjects.filter((currentProject) => currentProject.id !== project.id)
    )
    setIsLoading(false)
    setDialog(null)
  }

  return {
    dialog,
    isLoading,
    ownedProjects,
    projectName,
    projects,
    setProjectName,
    sharedProjects,
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
