import type { Edge, Node } from "@xyflow/react"

export const CANVAS_NODE_TYPE = "canvasNode" as const
export const CANVAS_EDGE_TYPE = "canvasEdge" as const

export const NODE_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const

export type CanvasNodeShape = (typeof NODE_SHAPES)[number]

export interface CanvasNodeColor {
  fill: string
  text: string
}

export const NODE_COLORS: readonly CanvasNodeColor[] = [
  { fill: "#1F1F1F", text: "#EDEDED" },
  { fill: "#10233D", text: "#52A8FF" },
  { fill: "#2E1938", text: "#BF7AF0" },
  { fill: "#331B00", text: "#FF990A" },
  { fill: "#3C1618", text: "#FF6166" },
  { fill: "#3A1726", text: "#F75F8F" },
  { fill: "#0F2E18", text: "#62C073" },
  { fill: "#062822", text: "#0AC7B4" },
] as const

export const DEFAULT_NODE_COLOR = NODE_COLORS[0]

export interface CanvasNodeData extends Record<string, unknown> {
  label: string
  color: CanvasNodeColor
  shape: CanvasNodeShape
}

export type CanvasNode = Node<CanvasNodeData, typeof CANVAS_NODE_TYPE>
export type CanvasEdge = Edge<Record<string, never>, typeof CANVAS_EDGE_TYPE>

export interface CanvasShapeTemplate {
  shape: CanvasNodeShape
  width: number
  height: number
}

export const SHAPE_TEMPLATES: Record<CanvasNodeShape, CanvasShapeTemplate> = {
  rectangle: { shape: "rectangle", width: 220, height: 92 },
  diamond: { shape: "diamond", width: 200, height: 116 },
  circle: { shape: "circle", width: 108, height: 108 },
  pill: { shape: "pill", width: 200, height: 84 },
  cylinder: { shape: "cylinder", width: 200, height: 104 },
  hexagon: { shape: "hexagon", width: 208, height: 98 },
}
