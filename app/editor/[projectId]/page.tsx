import { notFound } from "next/navigation"

import { EditorLayout } from "@/components/editor/editor-layout"
import { getAccessibleEditorProject, getEditorProjectLists } from "@/lib/project-data"

interface EditorWorkspacePageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function EditorWorkspacePage({
  params,
}: EditorWorkspacePageProps) {
  const { projectId } = await params
  const [projectLists, project] = await Promise.all([
    getEditorProjectLists(),
    getAccessibleEditorProject(projectId),
  ])

  if (!project) {
    notFound()
  }

  return (
    <EditorLayout
      {...projectLists}
      activeProjectId={project.id}
      projectName={project.name}
    />
  )
}
