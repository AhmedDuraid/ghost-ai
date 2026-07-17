import {
  CANVAS_EDGE_TYPE,
  CANVAS_NODE_TYPE,
  DEFAULT_NODE_COLOR,
  NODE_COLORS,
  type CanvasEdge,
  type CanvasNode,
  type CanvasNodeColor,
  type CanvasNodeShape,
} from "@/types/canvas"

export interface CanvasTemplate {
  id: string
  name: string
  description: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

interface TemplateNodeInput {
  id: string
  label: string
  shape?: CanvasNodeShape
  color?: CanvasNodeColor
  x: number
  y: number
  width?: number
  height?: number
}

interface TemplateEdgeInput {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  label?: string
}

function createTemplateNode({
  id,
  label,
  shape = "rectangle",
  color = DEFAULT_NODE_COLOR,
  x,
  y,
  width = 180,
  height = 84,
}: TemplateNodeInput): CanvasNode {
  return {
    id,
    type: CANVAS_NODE_TYPE,
    position: { x, y },
    data: {
      label,
      color,
      shape,
    },
    style: {
      width,
      height,
    },
  }
}

function createTemplateEdge({
  id,
  source,
  target,
  sourceHandle = "right-source",
  targetHandle = "left-target",
  label = "",
}: TemplateEdgeInput): CanvasEdge {
  return {
    id,
    type: CANVAS_EDGE_TYPE,
    source,
    target,
    sourceHandle,
    targetHandle,
    data: {
      label,
    },
  }
}

export function getTemplateBounds(nodes: CanvasNode[]) {
  const fallbackBounds = {
    minX: 0,
    minY: 0,
    width: 1,
    height: 1,
  }

  if (nodes.length === 0) {
    return fallbackBounds
  }

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const node of nodes) {
    const width =
      typeof node.style?.width === "number" ? node.style.width : 180
    const height =
      typeof node.style?.height === "number" ? node.style.height : 84

    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + width)
    maxY = Math.max(maxY, node.position.y + height)
  }

  return {
    minX,
    minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  }
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices",
    name: "Microservices Platform",
    description:
      "API gateway, core services, async messaging, and data stores for a service-oriented backend.",
    nodes: [
      createTemplateNode({
        id: "client",
        label: "Web Client",
        shape: "pill",
        color: NODE_COLORS[1],
        x: 20,
        y: 128,
        width: 150,
        height: 70,
      }),
      createTemplateNode({
        id: "gateway",
        label: "API Gateway",
        shape: "rectangle",
        color: NODE_COLORS[7],
        x: 230,
        y: 120,
      }),
      createTemplateNode({
        id: "auth",
        label: "Auth Service",
        shape: "rectangle",
        color: NODE_COLORS[2],
        x: 500,
        y: 20,
      }),
      createTemplateNode({
        id: "orders",
        label: "Orders Service",
        shape: "rectangle",
        color: NODE_COLORS[6],
        x: 500,
        y: 120,
      }),
      createTemplateNode({
        id: "inventory",
        label: "Inventory Service",
        shape: "rectangle",
        color: NODE_COLORS[3],
        x: 500,
        y: 220,
      }),
      createTemplateNode({
        id: "bus",
        label: "Event Bus",
        shape: "hexagon",
        color: NODE_COLORS[5],
        x: 790,
        y: 128,
        width: 180,
        height: 88,
      }),
      createTemplateNode({
        id: "db-auth",
        label: "Users DB",
        shape: "cylinder",
        color: NODE_COLORS[0],
        x: 770,
        y: 10,
        width: 150,
        height: 92,
      }),
      createTemplateNode({
        id: "db-orders",
        label: "Orders DB",
        shape: "cylinder",
        color: NODE_COLORS[0],
        x: 1010,
        y: 90,
        width: 150,
        height: 92,
      }),
      createTemplateNode({
        id: "db-inventory",
        label: "Inventory DB",
        shape: "cylinder",
        color: NODE_COLORS[0],
        x: 1010,
        y: 220,
        width: 150,
        height: 92,
      }),
    ],
    edges: [
      createTemplateEdge({
        id: "client-gateway",
        source: "client",
        target: "gateway",
        label: "HTTPS",
      }),
      createTemplateEdge({
        id: "gateway-auth",
        source: "gateway",
        target: "auth",
      }),
      createTemplateEdge({
        id: "gateway-orders",
        source: "gateway",
        target: "orders",
      }),
      createTemplateEdge({
        id: "gateway-inventory",
        source: "gateway",
        target: "inventory",
      }),
      createTemplateEdge({
        id: "auth-db",
        source: "auth",
        target: "db-auth",
      }),
      createTemplateEdge({
        id: "orders-bus",
        source: "orders",
        target: "bus",
        label: "Publish",
      }),
      createTemplateEdge({
        id: "inventory-bus",
        source: "inventory",
        target: "bus",
        label: "Publish",
      }),
      createTemplateEdge({
        id: "bus-orders-db",
        source: "bus",
        target: "db-orders",
      }),
      createTemplateEdge({
        id: "bus-inventory-db",
        source: "bus",
        target: "db-inventory",
      }),
    ],
  },
  {
    id: "cicd-pipeline",
    name: "CI/CD Pipeline",
    description:
      "A delivery flow from code commit through automated validation, artifact creation, and deployment.",
    nodes: [
      createTemplateNode({
        id: "repo",
        label: "Git Repository",
        shape: "rectangle",
        color: NODE_COLORS[1],
        x: 30,
        y: 110,
      }),
      createTemplateNode({
        id: "ci",
        label: "CI Runner",
        shape: "pill",
        color: NODE_COLORS[7],
        x: 260,
        y: 110,
        width: 160,
        height: 74,
      }),
      createTemplateNode({
        id: "tests",
        label: "Automated Tests",
        shape: "diamond",
        color: NODE_COLORS[3],
        x: 470,
        y: 96,
        width: 170,
        height: 110,
      }),
      createTemplateNode({
        id: "artifact",
        label: "Artifact Registry",
        shape: "cylinder",
        color: NODE_COLORS[0],
        x: 720,
        y: 30,
        width: 180,
        height: 100,
      }),
      createTemplateNode({
        id: "staging",
        label: "Staging",
        shape: "rectangle",
        color: NODE_COLORS[6],
        x: 720,
        y: 170,
      }),
      createTemplateNode({
        id: "approval",
        label: "Release Approval",
        shape: "diamond",
        color: NODE_COLORS[4],
        x: 960,
        y: 156,
        width: 180,
        height: 110,
      }),
      createTemplateNode({
        id: "prod",
        label: "Production",
        shape: "hexagon",
        color: NODE_COLORS[2],
        x: 1220,
        y: 164,
        width: 180,
        height: 96,
      }),
    ],
    edges: [
      createTemplateEdge({
        id: "repo-ci",
        source: "repo",
        target: "ci",
        label: "Push",
      }),
      createTemplateEdge({
        id: "ci-tests",
        source: "ci",
        target: "tests",
      }),
      createTemplateEdge({
        id: "tests-artifact",
        source: "tests",
        target: "artifact",
        label: "Build",
      }),
      createTemplateEdge({
        id: "artifact-staging",
        source: "artifact",
        target: "staging",
        targetHandle: "top-target",
      }),
      createTemplateEdge({
        id: "staging-approval",
        source: "staging",
        target: "approval",
      }),
      createTemplateEdge({
        id: "approval-prod",
        source: "approval",
        target: "prod",
      }),
    ],
  },
  {
    id: "event-driven",
    name: "Event-Driven System",
    description:
      "An ingestion and processing pipeline with event streaming, workers, and read models.",
    nodes: [
      createTemplateNode({
        id: "producer",
        label: "Producer API",
        shape: "pill",
        color: NODE_COLORS[1],
        x: 20,
        y: 140,
        width: 150,
        height: 70,
      }),
      createTemplateNode({
        id: "stream",
        label: "Event Stream",
        shape: "hexagon",
        color: NODE_COLORS[7],
        x: 260,
        y: 124,
        width: 190,
        height: 92,
      }),
      createTemplateNode({
        id: "worker-a",
        label: "Projection Worker",
        shape: "rectangle",
        color: NODE_COLORS[6],
        x: 560,
        y: 34,
      }),
      createTemplateNode({
        id: "worker-b",
        label: "Notification Worker",
        shape: "rectangle",
        color: NODE_COLORS[5],
        x: 560,
        y: 154,
      }),
      createTemplateNode({
        id: "worker-c",
        label: "Analytics Worker",
        shape: "rectangle",
        color: NODE_COLORS[3],
        x: 560,
        y: 274,
      }),
      createTemplateNode({
        id: "read-model",
        label: "Read Model DB",
        shape: "cylinder",
        color: NODE_COLORS[0],
        x: 860,
        y: 20,
        width: 180,
        height: 96,
      }),
      createTemplateNode({
        id: "email",
        label: "Email Provider",
        shape: "hexagon",
        color: NODE_COLORS[4],
        x: 860,
        y: 146,
        width: 180,
        height: 96,
      }),
      createTemplateNode({
        id: "warehouse",
        label: "Analytics Warehouse",
        shape: "cylinder",
        color: NODE_COLORS[2],
        x: 860,
        y: 268,
        width: 190,
        height: 96,
      }),
      createTemplateNode({
        id: "dashboard",
        label: "Operational Dashboard",
        shape: "rectangle",
        color: NODE_COLORS[1],
        x: 1110,
        y: 20,
        width: 190,
        height: 84,
      }),
    ],
    edges: [
      createTemplateEdge({
        id: "producer-stream",
        source: "producer",
        target: "stream",
        label: "Publish events",
      }),
      createTemplateEdge({
        id: "stream-worker-a",
        source: "stream",
        target: "worker-a",
      }),
      createTemplateEdge({
        id: "stream-worker-b",
        source: "stream",
        target: "worker-b",
      }),
      createTemplateEdge({
        id: "stream-worker-c",
        source: "stream",
        target: "worker-c",
      }),
      createTemplateEdge({
        id: "worker-a-read",
        source: "worker-a",
        target: "read-model",
      }),
      createTemplateEdge({
        id: "read-dashboard",
        source: "read-model",
        target: "dashboard",
      }),
      createTemplateEdge({
        id: "worker-b-email",
        source: "worker-b",
        target: "email",
      }),
      createTemplateEdge({
        id: "worker-c-warehouse",
        source: "worker-c",
        target: "warehouse",
      }),
    ],
  },
]
