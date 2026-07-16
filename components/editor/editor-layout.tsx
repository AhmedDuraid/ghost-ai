"use client"

import type { ReactNode } from "react"
import { useState } from "react"

import { EditorHome } from "@/components/editor/editor-home"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { WorkspaceHome } from "@/components/editor/workspace-home"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { EditorProjectSummary } from "@/lib/project-data"
import { cn } from "@/lib/utils"

interface EditorLayoutProps {
  ownedProjects: EditorProjectSummary[]
  sharedProjects: EditorProjectSummary[]
  activeProjectId?: string
  projectName?: string
  children?: ReactNode
  className?: string
}

export function EditorLayout({
  ownedProjects,
  sharedProjects,
  activeProjectId,
  projectName,
  children,
  className,
}: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const projectActions = useProjectActions({ activeProjectId })

  return (
    <div
      className={cn(
        "relative flex h-screen min-h-screen flex-col overflow-hidden bg-base text-copy-primary",
        className
      )}
    >
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={activeProjectId}
        onCreateProject={projectActions.openCreateDialog}
        onRenameProject={projectActions.openRenameDialog}
        onDeleteProject={projectActions.openDeleteDialog}
      />
      <main aria-label="Editor canvas" className="relative min-h-0 flex-1 bg-base">
        {children ??
          (activeProjectId ? (
            <WorkspaceHome projectName={projectName ?? "Untitled Project"} />
          ) : (
            <EditorHome onCreateProject={projectActions.openCreateDialog} />
          ))}
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
