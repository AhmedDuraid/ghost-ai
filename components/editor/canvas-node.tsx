"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"

import type { CanvasNode } from "@/types/canvas"

const HANDLE_CLASS_NAME =
  "!h-3 !w-3 !border-2 !border-copy-primary !bg-copy-primary opacity-0 transition-opacity duration-150 group-hover:opacity-100"

function ShapeBackground({ data }: Pick<CanvasNode, "data">) {
  const sharedShapeProps = {
    fill: data.color.fill,
    stroke: "var(--border-default)",
    strokeWidth: 1.5,
    vectorEffect: "non-scaling-stroke" as const,
  }

  switch (data.shape) {
    case "circle":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <circle cx="50" cy="50" r="48" {...sharedShapeProps} />
        </svg>
      )
    case "pill":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <rect x="1" y="8" width="98" height="84" rx="42" {...sharedShapeProps} />
        </svg>
      )
    case "diamond":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <polygon points="50,2 98,50 50,98 2,50" {...sharedShapeProps} />
        </svg>
      )
    case "cylinder":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M18 20 C18 12, 82 12, 82 20 L82 76 C82 84, 18 84, 18 76 Z"
            {...sharedShapeProps}
          />
          <ellipse cx="50" cy="20" rx="32" ry="10" {...sharedShapeProps} />
          <path
            d="M18 76 C18 84, 82 84, 82 76"
            fill="none"
            stroke="var(--border-default)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )
    case "hexagon":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <polygon points="24,6 76,6 98,50 76,94 24,94 2,50" {...sharedShapeProps} />
        </svg>
      )
    case "rectangle":
    default:
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <rect x="1" y="1" width="98" height="98" rx="18" {...sharedShapeProps} />
        </svg>
      )
  }
}

export function CanvasNodeRenderer({ data }: NodeProps<CanvasNode>) {
  return (
    <div
      className="group relative flex h-full w-full items-center justify-center px-4 py-3 text-center shadow-lg"
      style={{ color: data.color.text }}
    >
      <ShapeBackground data={data} />

      <Handle type="target" position={Position.Top} className={HANDLE_CLASS_NAME} />
      <Handle
        type="target"
        position={Position.Left}
        className={HANDLE_CLASS_NAME}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={HANDLE_CLASS_NAME}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={HANDLE_CLASS_NAME}
      />

      <span className="pointer-events-none relative z-10 text-sm font-medium">
        {data.label.trim() || " "}
      </span>
    </div>
  )
}
