"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

function EmptyProjectState() {
  return (
    <div className="flex h-full min-h-48 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-elevated/60 px-6 text-center text-sm text-copy-muted">
      No projects to show.
    </div>
  )
}

export function ProjectSidebar({
  isOpen,
  onClose,
  className,
}: ProjectSidebarProps) {
  return (
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
          <EmptyProjectState />
        </TabsContent>
        <TabsContent value="shared" className="min-h-0">
          <EmptyProjectState />
        </TabsContent>
      </Tabs>

      <div className="shrink-0 border-t border-sidebar-border p-4">
        <Button type="button" className="w-full">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
