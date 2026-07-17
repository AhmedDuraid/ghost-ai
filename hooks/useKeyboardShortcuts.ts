"use client"

import { useEffect } from "react"
import type { ReactFlowInstance } from "@xyflow/react"

import type { CanvasEdge, CanvasNode } from "@/types/canvas"

interface UseKeyboardShortcutsOptions {
  reactFlow: ReactFlowInstance<CanvasNode, CanvasEdge>
  onUndo: () => void
  onRedo: () => void
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  const tagName = target.tagName.toLowerCase()

  return tagName === "input" || tagName === "textarea" || tagName === "select"
}

export function useKeyboardShortcuts({
  reactFlow,
  onUndo,
  onRedo,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return
      }

      const modifierPressed = event.metaKey || event.ctrlKey

      if (!modifierPressed && (event.key === "+" || event.key === "=")) {
        event.preventDefault()
        void reactFlow.zoomIn({ duration: 180 })
        return
      }

      if (!modifierPressed && event.key === "-") {
        event.preventDefault()
        void reactFlow.zoomOut({ duration: 180 })
        return
      }

      if (modifierPressed && event.key.toLowerCase() === "z") {
        event.preventDefault()

        if (event.shiftKey) {
          onRedo()
          return
        }

        onUndo()
        return
      }

      if (modifierPressed && event.key.toLowerCase() === "y") {
        event.preventDefault()
        onRedo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onRedo, onUndo, reactFlow])
}
