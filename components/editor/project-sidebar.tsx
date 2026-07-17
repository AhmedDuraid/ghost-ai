"use client"

import Link from "next/link"
import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { EditorProjectSummary } from "@/lib/project-data"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  ownedProjects: EditorProjectSummary[]
  sharedProjects: EditorProjectSummary[]
  activeProjectId?: string
  onCreateProject: () => void
  onRenameProject: (project: EditorProjectSummary) => void
  onDeleteProject: (project: EditorProjectSummary) => void
  className?: string
}

function EmptyProjectState({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-48 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-elevated/60 px-6 text-center text-sm text-copy-muted">
      {label}
    </div>
  )
}

function ProjectList({
  projects,
  activeProjectId,
  onRenameProject,
  onDeleteProject,
}: {
  projects: EditorProjectSummary[]
  activeProjectId?: string
  onRenameProject: (project: EditorProjectSummary) => void
  onDeleteProject: (project: EditorProjectSummary) => void
}) {
  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group flex min-h-16 items-center gap-3 rounded-2xl border border-surface-border bg-elevated/70 px-3 py-2 transition-colors hover:border-surface-border-subtle hover:bg-subtle/80"
        >
          <Link
            href={`/editor/${project.id}`}
            onClick={(event) => {
              if (
                (event.target as HTMLElement).closest("button") ||
                project.id === activeProjectId
              ) {
                event.preventDefault()
              }
            }}
            className={cn(
              "min-w-0 flex-1 rounded-xl px-1 py-1 transition-colors",
              project.id === activeProjectId && "bg-accent-dim"
            )}
          >
            <p className="truncate text-sm font-medium text-copy-primary">
              {project.name}
            </p>
            <p className="mt-1 truncate font-mono text-xs text-copy-muted">
              {project.id}
            </p>
          </Link>

          {project.owned ? (
            <div className="flex shrink-0 items-center gap-1 opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-within:opacity-100">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Rename ${project.name}`}
                onClick={() => onRenameProject(project)}
                className="text-copy-muted hover:bg-accent-dim hover:text-brand"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${project.name}`}
                onClick={() => onDeleteProject(project)}
                className="text-copy-muted hover:bg-state-error/10 hover:text-state-error"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  className,
}: ProjectSidebarProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Close project sidebar"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-base/70 backdrop-blur-xs transition-opacity duration-200 md:bg-transparent md:backdrop-blur-none",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "fixed left-3 top-17 z-40 flex h-[calc(100vh-5rem)] w-[min(20rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-surface-border bg-sidebar text-sidebar-foreground shadow-2xl backdrop-blur-md transition-all duration-200 ease-out",
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-[calc(100%+1.5rem)] opacity-0",
          className
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close project sidebar"
            onClick={onClose}
            className="text-copy-muted hover:bg-subtle hover:text-copy-primary"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="min-h-0 flex-1 gap-3 p-4">
          <TabsList className="grid w-full grid-cols-2 bg-subtle">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
          <TabsContent value="my-projects" className="min-h-0">
            {ownedProjects.length > 0 ? (
              <ProjectList
                projects={ownedProjects}
                activeProjectId={activeProjectId}
                onRenameProject={onRenameProject}
                onDeleteProject={onDeleteProject}
              />
            ) : (
              <EmptyProjectState label="No owned projects to show." />
            )}
          </TabsContent>
          <TabsContent value="shared" className="min-h-0">
            {sharedProjects.length > 0 ? (
              <ProjectList
                projects={sharedProjects}
                activeProjectId={activeProjectId}
                onRenameProject={onRenameProject}
                onDeleteProject={onDeleteProject}
              />
            ) : (
              <EmptyProjectState label="No shared projects to show." />
            )}
          </TabsContent>
        </Tabs>

        <div className="shrink-0 border-t border-sidebar-border p-4">
          <Button type="button" className="w-full" onClick={onCreateProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
