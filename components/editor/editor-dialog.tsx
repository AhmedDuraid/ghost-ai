"use client"

import type { ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export interface EditorDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  footer?: ReactNode
  children?: ReactNode
  className?: string
}

export function EditorDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  className,
}: EditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "rounded-3xl border border-surface-border bg-elevated p-5 text-copy-primary shadow-2xl ring-0 sm:max-w-md",
          className
        )}
      >
        <DialogHeader className="gap-2 pr-8">
          <DialogTitle className="text-base font-medium text-copy-primary">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-sm leading-6 text-copy-muted">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {children ? <div className="text-sm text-copy-secondary">{children}</div> : null}

        {footer ? (
          <DialogFooter className="-mx-5 -mb-5 rounded-b-3xl border-surface-border bg-surface p-5">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
