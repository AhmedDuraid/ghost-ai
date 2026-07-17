"use client"

import type { DragEvent } from "react"
import {
  Circle,
  Cylinder,
  Diamond,
  Hexagon,
  Pill,
  RectangleHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CanvasNodeShape } from "@/types/canvas"
import { SHAPE_TEMPLATES } from "@/types/canvas"

const CANVAS_SHAPE_MIME_TYPE = "application/ghost-canvas-shape"

const SHAPE_ITEMS: Array<{
  shape: CanvasNodeShape
  icon: typeof RectangleHorizontal
  label: string
}> = [
  { shape: "rectangle", icon: RectangleHorizontal, label: "Rectangle" },
  { shape: "diamond", icon: Diamond, label: "Diamond" },
  { shape: "circle", icon: Circle, label: "Circle" },
  { shape: "pill", icon: Pill, label: "Pill" },
  { shape: "cylinder", icon: Cylinder, label: "Cylinder" },
  { shape: "hexagon", icon: Hexagon, label: "Hexagon" },
]

export interface CanvasShapeToolbarProps {
  onShapeDragStart?: (shape: CanvasNodeShape) => void
}

export interface CanvasShapeDragPayload {
  shape: CanvasNodeShape
  width: number
  height: number
}

export function getCanvasShapePayload(
  dataTransfer: DataTransfer
): CanvasShapeDragPayload | null {
  const payload = dataTransfer.getData(CANVAS_SHAPE_MIME_TYPE)

  if (!payload) {
    return null
  }

  try {
    const parsed = JSON.parse(payload) as {
      shape?: CanvasNodeShape
      width?: number
      height?: number
    }

    if (
      !parsed.shape ||
      typeof parsed.width !== "number" ||
      typeof parsed.height !== "number"
    ) {
      return null
    }

    return {
      shape: parsed.shape,
      width: parsed.width,
      height: parsed.height,
    }
  } catch {
    return null
  }
}

export function CanvasShapeToolbar({
  onShapeDragStart,
}: CanvasShapeToolbarProps) {
  const handleDragStart = (event: DragEvent<HTMLButtonElement>, shape: CanvasNodeShape) => {
    const template = SHAPE_TEMPLATES[shape]

    event.dataTransfer.effectAllowed = "copy"
    event.dataTransfer.setData(CANVAS_SHAPE_MIME_TYPE, JSON.stringify(template))
    onShapeDragStart?.(shape)
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-surface-border bg-sidebar px-3 py-2 shadow-2xl backdrop-blur-md">
        {SHAPE_ITEMS.map(({ shape, icon: Icon, label }) => (
          <Button
            key={shape}
            type="button"
            variant="ghost"
            size="icon"
            draggable
            aria-label={`Drag ${label} shape`}
            title={label}
            onDragStart={(event) => handleDragStart(event, shape)}
            className="rounded-full text-copy-secondary hover:bg-subtle hover:text-copy-primary"
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  )
}
