"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EditorHomeProps {
  onCreateProject: () => void
}

export function EditorHome({ onCreateProject }: EditorHomeProps) {
  return (
    <div className="flex h-full min-h-full items-center justify-center px-6 py-12 text-center">
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold tracking-normal text-copy-primary md:text-3xl">
          Create a project or open an existing one
        </h1>
        <p className="mt-3 text-sm leading-6 text-copy-muted md:text-base">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
        <div className="mt-6 flex justify-center">
          <Button type="button" size="lg" onClick={onCreateProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
    </div>
  )
}
