"use client"

import { useState } from "react"
import { Bot, PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react"

import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { Button } from "@/components/ui/button"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { EditorProjectSummary } from "@/lib/project-data"
import { cn } from "@/lib/utils"

interface WorkspaceShellProps {
  ownedProjects: EditorProjectSummary[]
  sharedProjects: EditorProjectSummary[]
  activeProjectId: string
  projectName: string
}

export function WorkspaceShell({
  ownedProjects,
  sharedProjects,
  activeProjectId,
  projectName,
}: WorkspaceShellProps) {
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(true)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true)
  const projectActions = useProjectActions({ activeProjectId })
  const SidebarIcon = isProjectSidebarOpen ? PanelLeftClose : PanelLeftOpen

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
          <Button type="button" variant="outline" className="bg-elevated text-copy-primary">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            type="button"
            variant="outline"
            aria-pressed={isAiSidebarOpen}
            onClick={() => setIsAiSidebarOpen((current) => !current)}
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
        <section className="flex h-full min-h-full items-center justify-center bg-base px-6 py-12 text-center">
          <div className="max-w-xl">
            <h1 className="text-2xl font-semibold tracking-normal text-copy-primary md:text-3xl">
              Canvas workspace placeholder
            </h1>
            <p className="mt-3 text-sm leading-6 text-copy-muted md:text-base">
              The collaborative canvas will mount here in a future feature. This shell
              already has project access checks, room context, and space reserved for
              AI tools.
            </p>
          </div>
        </section>

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
    </div>
  )
}

