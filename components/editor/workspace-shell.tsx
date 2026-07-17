"use client"

import { useEffect, useRef, useState } from "react"
import {
  Bot,
  LayoutTemplate,
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
} from "lucide-react"

import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import { CollaborativeCanvas } from "@/components/editor/collaborative-canvas"
import { Button } from "@/components/ui/button"
import { useProjectActions } from "@/hooks/use-project-actions"
import { useShareDialog } from "@/hooks/use-share-dialog"
import type { EditorProjectSummary } from "@/lib/project-data"
import { cn } from "@/lib/utils"

interface WorkspaceShellProps {
  canManageAccess: boolean
  ownedProjects: EditorProjectSummary[]
  sharedProjects: EditorProjectSummary[]
  activeProjectId: string
  projectId: string
  projectName: string
}

export function WorkspaceShell({
  canManageAccess,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  projectId,
  projectName,
}: WorkspaceShellProps) {
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(true)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true)
  const [isStarterTemplatesOpen, setIsStarterTemplatesOpen] = useState(false)
  const aiSidebarAutoCloseTimeoutRef = useRef<number | null>(null)
  const projectActions = useProjectActions({ activeProjectId })
  const shareDialog = useShareDialog({
    canManageAccess,
    projectId,
  })
  const SidebarIcon = isProjectSidebarOpen ? PanelLeftClose : PanelLeftOpen

  const clearAiSidebarAutoCloseTimeout = () => {
    if (aiSidebarAutoCloseTimeoutRef.current !== null) {
      window.clearTimeout(aiSidebarAutoCloseTimeoutRef.current)
      aiSidebarAutoCloseTimeoutRef.current = null
    }
  }

  useEffect(() => {
    aiSidebarAutoCloseTimeoutRef.current = window.setTimeout(() => {
      setIsAiSidebarOpen(false)
      aiSidebarAutoCloseTimeoutRef.current = null
    }, 2000)

    return () => {
      clearAiSidebarAutoCloseTimeout()
    }
  }, [])

  return (
    <div className="relative flex h-screen min-h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-surface-border bg-surface px-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              isProjectSidebarOpen ? "Close project sidebar" : "Open project sidebar"
            }
            aria-pressed={isProjectSidebarOpen}
            onClick={() => setIsProjectSidebarOpen((current) => !current)}
            className="text-copy-secondary hover:bg-subtle hover:text-copy-primary"
          >
            <SidebarIcon className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-copy-primary">
              {projectName}
            </p>
            <p className="text-xs text-copy-muted">Workspace shell</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="bg-elevated text-copy-primary"
            onClick={() => setIsStarterTemplatesOpen(true)}
          >
            <LayoutTemplate className="h-4 w-4" />
            Templates
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-elevated text-copy-primary"
            onClick={() => shareDialog.handleOpenChange(true)}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            type="button"
            variant="outline"
            aria-pressed={isAiSidebarOpen}
            onClick={() => {
              clearAiSidebarAutoCloseTimeout()
              setIsAiSidebarOpen((current) => !current)
            }}
            className="bg-elevated text-copy-primary"
          >
            <Bot className="h-4 w-4" />
            AI Sidebar
          </Button>
        </div>
      </header>

      <ProjectSidebar
        isOpen={isProjectSidebarOpen}
        onClose={() => setIsProjectSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={activeProjectId}
        onCreateProject={projectActions.openCreateDialog}
        onRenameProject={projectActions.openRenameDialog}
        onDeleteProject={projectActions.openDeleteDialog}
      />

      <main className="relative min-h-0 flex-1 bg-base">
        <CollaborativeCanvas
          projectId={projectId}
          isStarterTemplatesOpen={isStarterTemplatesOpen}
          onStarterTemplatesOpenChange={setIsStarterTemplatesOpen}
        />

        <aside
          className={cn(
            "pointer-events-none absolute inset-y-3 right-3 z-20 flex w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-surface-border bg-sidebar text-sidebar-foreground shadow-2xl backdrop-blur-md transition-all duration-200 ease-out",
            isAiSidebarOpen
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "translate-x-[calc(100%+1.5rem)] opacity-0"
          )}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
            <h2 className="text-sm font-medium text-copy-primary">AI Assistant</h2>
            <Bot className="h-4 w-4 text-copy-muted" />
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-8 text-center">
            <div className="max-w-xs">
              <p className="text-sm font-medium text-copy-primary">
                AI sidebar placeholder
              </p>
              <p className="mt-2 text-sm leading-6 text-copy-muted">
                Future chat, generation controls, and workspace guidance will appear
                here.
              </p>
            </div>
          </div>
        </aside>
      </main>

      <ProjectDialogs
        dialog={projectActions.dialog}
        errorMessage={projectActions.errorMessage}
        isLoading={projectActions.isLoading}
        projectName={projectActions.projectName}
        slugPreview={projectActions.slugPreview}
        onProjectNameChange={projectActions.setProjectName}
        onClose={projectActions.closeDialog}
        onCreateProject={projectActions.submitCreateProject}
        onRenameProject={projectActions.submitRenameProject}
        onDeleteProject={projectActions.submitDeleteProject}
      />
      <ShareDialog
        canManageAccess={shareDialog.canManageAccess}
        collaborators={shareDialog.collaborators}
        copied={shareDialog.copied}
        errorMessage={shareDialog.errorMessage}
        inviteEmail={shareDialog.inviteEmail}
        isInviting={shareDialog.isInviting}
        isLoading={shareDialog.isLoading}
        isOpen={shareDialog.isOpen}
        projectName={projectName}
        removingCollaboratorId={shareDialog.removingCollaboratorId}
        onCopyLink={shareDialog.copyProjectLink}
        onInviteCollaborator={shareDialog.inviteCollaborator}
        onInviteEmailChange={shareDialog.setInviteEmail}
        onOpenChange={shareDialog.handleOpenChange}
        onRemoveCollaborator={shareDialog.removeCollaborator}
      />
    </div>
  )
}
