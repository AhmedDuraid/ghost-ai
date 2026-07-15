"use client"

import type { ReactNode } from "react"
import { useState } from "react"

import { EditorHome } from "@/components/editor/editor-home"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { useProjectDialogs } from "@/components/editor/use-project-dialogs"
import { cn } from "@/lib/utils"

interface EditorLayoutProps {
  children?: ReactNode
  className?: string
}

export function EditorLayout({ children, className }: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const projectDialogs = useProjectDialogs()

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
        ownedProjects={projectDialogs.ownedProjects}
        sharedProjects={projectDialogs.sharedProjects}
        onCreateProject={projectDialogs.openCreateDialog}
        onRenameProject={projectDialogs.openRenameDialog}
        onDeleteProject={projectDialogs.openDeleteDialog}
      />
      <main aria-label="Editor canvas" className="relative min-h-0 flex-1 bg-base">
        {children ?? <EditorHome onCreateProject={projectDialogs.openCreateDialog} />}
      </main>
      <ProjectDialogs
        dialog={projectDialogs.dialog}
        isLoading={projectDialogs.isLoading}
        projectName={projectDialogs.projectName}
        slugPreview={projectDialogs.slugPreview}
        onProjectNameChange={projectDialogs.setProjectName}
        onClose={projectDialogs.closeDialog}
        onCreateProject={projectDialogs.submitCreateProject}
        onRenameProject={projectDialogs.submitRenameProject}
        onDeleteProject={projectDialogs.submitDeleteProject}
      />
    </div>
  )
}
