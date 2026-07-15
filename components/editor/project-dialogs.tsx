"use client"

import type { FormEvent } from "react"

import { AlertTriangle } from "lucide-react"

import { EditorDialog } from "@/components/editor/editor-dialog"
import type { ProjectSummary } from "@/components/editor/use-project-dialogs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProjectDialogState {
  mode: "create" | "rename" | "delete"
  project: ProjectSummary | null
}

interface ProjectDialogsProps {
  dialog: ProjectDialogState | null
  isLoading: boolean
  projectName: string
  slugPreview: string
  onProjectNameChange: (projectName: string) => void
  onClose: () => void
  onCreateProject: () => void
  onRenameProject: () => void
  onDeleteProject: () => void
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: string
  htmlFor: string
}) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium text-copy-secondary">
      {children}
    </label>
  )
}

export function ProjectDialogs({
  dialog,
  isLoading,
  projectName,
  slugPreview,
  onProjectNameChange,
  onClose,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectDialogsProps) {
  const isCreateOpen = dialog?.mode === "create"
  const isRenameOpen = dialog?.mode === "rename"
  const isDeleteOpen = dialog?.mode === "delete"
  const canSubmitName = projectName.trim().length > 0

  function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onCreateProject()
  }

  function handleRenameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onRenameProject()
  }

  return (
    <>
      <EditorDialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) {
            onClose()
          }
        }}
        title="Create project"
        description="Name the architecture workspace."
        footer={
          <>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-project-form"
              disabled={!canSubmitName || isLoading}
            >
              Create Project
            </Button>
          </>
        }
      >
        <form
          id="create-project-form"
          className="space-y-4"
          onSubmit={handleCreateSubmit}
        >
          <div className="space-y-2">
            <FieldLabel htmlFor="create-project-name">Project name</FieldLabel>
            <Input
              id="create-project-name"
              value={projectName}
              onChange={(event) => onProjectNameChange(event.target.value)}
              placeholder="System design workspace"
              autoFocus
            />
          </div>
          <div className="rounded-xl border border-surface-border bg-surface px-3 py-2">
            <p className="text-xs font-medium text-copy-muted">Slug preview</p>
            <p className="mt-1 font-mono text-sm text-brand">{slugPreview}</p>
          </div>
        </form>
      </EditorDialog>

      <EditorDialog
        open={isRenameOpen}
        onOpenChange={(open) => {
          if (!open) {
            onClose()
          }
        }}
        title="Rename project"
        description={
          dialog?.project
            ? `Current project: ${dialog.project.name}`
            : "Current project unavailable."
        }
        footer={
          <>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="rename-project-form"
              disabled={!canSubmitName || isLoading}
            >
              Rename Project
            </Button>
          </>
        }
      >
        <form
          id="rename-project-form"
          className="space-y-4"
          onSubmit={handleRenameSubmit}
        >
          <div className="space-y-2">
            <FieldLabel htmlFor="rename-project-name">Project name</FieldLabel>
            <Input
              id="rename-project-name"
              value={projectName}
              onChange={(event) => onProjectNameChange(event.target.value)}
              autoFocus
            />
          </div>
        </form>
      </EditorDialog>

      <EditorDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            onClose()
          }
        }}
        title="Delete project"
        description={
          dialog?.project
            ? `Delete ${dialog.project.name}? This cannot be undone.`
            : "Project unavailable."
        }
        footer={
          <>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteProject}
              disabled={isLoading}
            >
              Delete Project
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3 rounded-xl border border-surface-border bg-surface p-3 text-copy-secondary">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-state-error" />
          <p>Confirm deletion to remove this project from the sidebar.</p>
        </div>
      </EditorDialog>
    </>
  )
}
