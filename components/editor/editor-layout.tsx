"use client"

import type { ReactNode } from "react"
import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { cn } from "@/lib/utils"

interface EditorLayoutProps {
  children?: ReactNode
  className?: string
}

export function EditorLayout({ children, className }: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
      />
      <main aria-label="Editor canvas" className="relative min-h-0 flex-1 bg-base">
        {children}
      </main>
    </div>
  )
}
