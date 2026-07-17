"use client"

import { ArrowRight, Sparkles } from "lucide-react"

import { CanvasShapeVisual } from "@/components/editor/canvas-node"
import {
  type CanvasTemplate,
  getTemplateBounds,
} from "@/components/editor/starter-templates"
import { EditorDialog } from "@/components/editor/editor-dialog"
import { Button } from "@/components/ui/button"

interface StarterTemplatesModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  templates: CanvasTemplate[]
  onImport: (template: CanvasTemplate) => void
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const width = 260
  const height = 150
  const padding = 18
  const bounds = getTemplateBounds(template.nodes)
  const scale = Math.min(
    (width - padding * 2) / bounds.width,
    (height - padding * 2) / bounds.height,
  )
  const offsetX = (width - bounds.width * scale) / 2
  const offsetY = (height - bounds.height * scale) / 2

  const getNodeFrame = (nodeId: string) => {
    const node = template.nodes.find((entry) => entry.id === nodeId)

    if (!node) {
      return null
    }

    const nodeWidth =
      typeof node.style?.width === "number" ? node.style.width : 180
    const nodeHeight =
      typeof node.style?.height === "number" ? node.style.height : 84

    return {
      x: offsetX + (node.position.x - bounds.minX) * scale,
      y: offsetY + (node.position.y - bounds.minY) * scale,
      width: nodeWidth * scale,
      height: nodeHeight * scale,
      node,
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-surface-border bg-base/80 p-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[150px] w-full"
        role="img"
        aria-label={`${template.name} preview`}
      >
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="18"
          fill="var(--bg-base)"
        />

        {template.edges.map((edge) => {
          const source = getNodeFrame(edge.source)
          const target = getNodeFrame(edge.target)

          if (!source || !target) {
            return null
          }

          const sourceX = source.x + source.width / 2
          const sourceY = source.y + source.height / 2
          const targetX = target.x + target.width / 2
          const targetY = target.y + target.height / 2

          return (
            <line
              key={edge.id}
              x1={sourceX}
              y1={sourceY}
              x2={targetX}
              y2={targetY}
              stroke="var(--text-secondary)"
              strokeOpacity="0.55"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )
        })}

        {template.nodes.map((node) => {
          const frame = getNodeFrame(node.id)

          if (!frame) {
            return null
          }

          return (
            <foreignObject
              key={node.id}
              x={frame.x}
              y={frame.y}
              width={frame.width}
              height={frame.height}
            >
              <div className="relative h-full w-full scale-[0.98]">
                <CanvasShapeVisual
                  color={node.data.color}
                  shape={node.data.shape}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center px-2 text-center text-[8px] font-medium"
                  style={{ color: node.data.color.text }}
                >
                  <span className="line-clamp-2">{node.data.label}</span>
                </div>
              </div>
            </foreignObject>
          )
        })}
      </svg>
    </div>
  )
}

export function StarterTemplatesModal({
  isOpen,
  onOpenChange,
  templates,
  onImport,
}: StarterTemplatesModalProps) {
  return (
    <EditorDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Starter Templates"
      description="Replace the current canvas with a ready-made architecture pattern."
      className="sm:max-w-4xl"
    >
      <div className="max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex h-full flex-col rounded-2xl border border-surface-border bg-surface p-4"
            >
              <TemplatePreview template={template} />

              <div className="mt-4 flex items-start gap-3">
                <div className="mt-0.5 rounded-xl border border-surface-border bg-base/70 p-2 text-brand">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-copy-primary">
                    {template.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-copy-muted">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-elevated text-copy-primary"
                  onClick={() => {
                    onImport(template)
                    onOpenChange(false)
                  }}
                >
                  Import
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditorDialog>
  )
}
