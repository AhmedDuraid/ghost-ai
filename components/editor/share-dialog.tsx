"use client"

import type { FormEvent } from "react"
import { Copy, MailPlus, Trash2, Users } from "lucide-react"

import { EditorDialog } from "@/components/editor/editor-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ShareDialogCollaborator {
  id: string
  email: string
  displayName: string | null
  avatarImageUrl: string | null
  createdAt: string
}

interface ShareDialogProps {
  canManageAccess: boolean
  collaborators: ShareDialogCollaborator[]
  copied: boolean
  errorMessage: string | null
  inviteEmail: string
  isInviting: boolean
  isLoading: boolean
  isOpen: boolean
  projectName: string
  removingCollaboratorId: string | null
  onCopyLink: () => void
  onInviteCollaborator: () => void
  onInviteEmailChange: (email: string) => void
  onOpenChange: (open: boolean) => void
  onRemoveCollaborator: (collaboratorId: string) => void
}

function getCollaboratorInitials(collaborator: ShareDialogCollaborator) {
  const source = collaborator.displayName ?? collaborator.email
  const words = source
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)

  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "")

  return initials.join("") || "?"
}

function CollaboratorAvatar({
  collaborator,
}: {
  collaborator: ShareDialogCollaborator
}) {
  if (collaborator.avatarImageUrl) {
    return (
      <div
        aria-hidden="true"
        className="h-10 w-10 rounded-xl border border-surface-border bg-subtle bg-cover bg-center"
        style={{
          backgroundImage: `url("${collaborator.avatarImageUrl}")`,
        }}
      />
    )
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-subtle text-xs font-semibold text-copy-secondary">
      {getCollaboratorInitials(collaborator)}
    </div>
  )
}

export function ShareDialog({
  canManageAccess,
  collaborators,
  copied,
  errorMessage,
  inviteEmail,
  isInviting,
  isLoading,
  isOpen,
  projectName,
  removingCollaboratorId,
  onCopyLink,
  onInviteCollaborator,
  onInviteEmailChange,
  onOpenChange,
  onRemoveCollaborator,
}: ShareDialogProps) {
  function handleInviteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onInviteCollaborator()
  }

  return (
    <EditorDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Share project"
      description={
        canManageAccess
          ? `Invite collaborators to ${projectName} and manage access.`
          : `You can view who has access to ${projectName}.`
      }
      className="sm:max-w-lg"
      footer={
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-surface-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-copy-primary">Project link</p>
              <p className="mt-1 text-xs leading-5 text-copy-muted">
                Copy a direct link to this workspace.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCopyLink}
              className={cn(
                "bg-elevated text-copy-primary",
                copied ? "border-brand text-brand" : null
              )}
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </div>
        </div>

        {canManageAccess ? (
          <form
            onSubmit={handleInviteSubmit}
            className="rounded-2xl border border-surface-border bg-surface p-4"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-surface-border bg-elevated p-2 text-brand">
                <MailPlus className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-copy-primary">Invite by email</p>
                <p className="mt-1 text-xs leading-5 text-copy-muted">
                  Add collaborators with view and edit access to the workspace.
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => onInviteEmailChange(event.target.value)}
                    placeholder="teammate@example.com"
                    className="border-surface-border bg-elevated text-copy-primary"
                  />
                  <Button
                    type="submit"
                    disabled={!inviteEmail.trim() || isInviting}
                    className="sm:self-start"
                  >
                    Invite
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : null}

        <div className="rounded-2xl border border-surface-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-surface-border bg-elevated p-2 text-copy-secondary">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-copy-primary">Collaborators</p>
              <p className="mt-1 text-xs leading-5 text-copy-muted">
                {canManageAccess
                  ? "Current collaborators with workspace access."
                  : "People who currently have collaborator access."}
              </p>
            </div>
          </div>

          <div className="mt-4">
            {isLoading ? (
              <p className="text-sm text-copy-muted">Loading collaborators...</p>
            ) : collaborators.length === 0 ? (
              <p className="rounded-xl border border-dashed border-surface-border bg-elevated px-4 py-6 text-center text-sm text-copy-muted">
                No collaborators have been added yet.
              </p>
            ) : (
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-3 rounded-xl border border-surface-border bg-elevated px-3 py-3"
                  >
                    <CollaboratorAvatar collaborator={collaborator} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-copy-primary">
                        {collaborator.displayName ?? collaborator.email}
                      </p>
                      <p className="truncate text-xs text-copy-muted">
                        {collaborator.displayName ? collaborator.email : "Email only"}
                      </p>
                    </div>
                    {canManageAccess ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${collaborator.email}`}
                        disabled={removingCollaboratorId === collaborator.id}
                        onClick={() => onRemoveCollaborator(collaborator.id)}
                        className="text-copy-muted hover:bg-subtle hover:text-state-error"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {errorMessage ? (
          <p className="text-sm text-state-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </EditorDialog>
  )
}
