import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace-shell"
import { AUTH_ROUTES } from "@/lib/auth-routes"
import { getCurrentProjectIdentity } from "@/lib/project-access"
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
  const identity = await getCurrentProjectIdentity()

  if (!identity.userId) {
    redirect(AUTH_ROUTES.signIn)
  }

  const [projectLists, project] = await Promise.all([
    getEditorProjectLists(identity),
    getAccessibleEditorProject(projectId, identity),
  ])

  if (!project) {
    return <AccessDenied />
  }

  return (
    <WorkspaceShell
      {...projectLists}
      activeProjectId={project.id}
      projectName={project.name}
    />
  )
}
