"use client"

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useErrorListener,
} from "@liveblocks/react"
import { LiveMap, LiveObject } from "@liveblocks/client"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  SmoothStepEdge,
  useReactFlow,
  type EdgeProps,
  type EdgeTypes,
  type NodeAddChange,
  type NodeTypes,
} from "@xyflow/react"
import {
  type DragEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import {
  CanvasNodeRenderer,
  CanvasShapeVisual,
} from "@/components/editor/canvas-node"
import {
  CanvasShapeToolbar,
  type CanvasShapeDragPayload,
  getCanvasShapePayload,
} from "@/components/editor/canvas-shape-toolbar"
import {
  CANVAS_EDGE_TYPE,
  CANVAS_NODE_TYPE,
  DEFAULT_NODE_COLOR,
  type CanvasEdge,
  type CanvasNode,
} from "@/types/canvas"

import "@xyflow/react/dist/style.css"

function CanvasEdgeRenderer(props: EdgeProps<CanvasEdge>) {
  return <SmoothStepEdge {...props} />
}

const NODE_TYPES: NodeTypes = {
  [CANVAS_NODE_TYPE]: CanvasNodeRenderer,
}

const EDGE_TYPES: EdgeTypes = {
  [CANVAS_EDGE_TYPE]: CanvasEdgeRenderer,
}

interface CollaborativeCanvasProps {
  projectId: string
}

interface ShapeDragPreviewState extends CanvasShapeDragPayload {
  x: number
  y: number
}

function CanvasLoadingState() {
  return (
    <div className="flex h-full items-center justify-center bg-base px-6 text-center">
      <div>
        <p className="text-sm font-medium text-copy-primary">Loading canvas…</p>
        <p className="mt-2 text-sm text-copy-muted">
          Joining the shared workspace.
        </p>
      </div>
    </div>
  )
}

function CanvasConnectionError({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center bg-base px-6 text-center">
      <div className="max-w-sm rounded-2xl border border-surface-border bg-surface px-6 py-5 shadow-xl">
        <p className="text-sm font-semibold text-copy-primary">
          Live canvas unavailable
        </p>
        <p className="mt-2 text-sm leading-6 text-copy-muted">{message}</p>
      </div>
    </div>
  )
}

function getConnectionErrorMessage(code: number) {
  switch (code) {
    case -1:
      return "Authentication with the collaboration service failed for this workspace."
    case 4001:
      return "You do not have access to join this collaborative room."
    case 4005:
      return "The collaborative room is full right now. Please try again shortly."
    case 4006:
      return "The workspace room changed while connecting. Refresh and try again."
    default:
      return "The shared canvas could not connect right now. Please try again."
  }
}

function LiveblocksConnectionGuard({ children }: { children: ReactNode }) {
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useErrorListener((error) => {
    if (error.context.type === "ROOM_CONNECTION_ERROR") {
      setConnectionError(getConnectionErrorMessage(error.context.code))
    }
  })

  if (connectionError) {
    return <CanvasConnectionError message={connectionError} />
  }

  return <>{children}</>
}

function CanvasShapeDragPreview({ preview }: { preview: ShapeDragPreviewState }) {
  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-30 opacity-80"
      style={{
        width: preview.width,
        height: preview.height,
        transform: `translate(${preview.x - preview.width / 2}px, ${preview.y - preview.height / 2}px)`,
      }}
    >
      <div className="relative h-full w-full">
        <CanvasShapeVisual
          color={DEFAULT_NODE_COLOR}
          shape={preview.shape}
          selected={true}
        />
      </div>
    </div>
  )
}

function CollaborativeCanvasFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: {
        initial: [],
      },
      edges: {
        initial: [],
      },
    })
  const reactFlow = useReactFlow<CanvasNode, CanvasEdge>()
  const nodeCounterRef = useRef(0)
  const [dragPreview, setDragPreview] = useState<ShapeDragPreviewState | null>(null)

  useEffect(() => {
    const handleWindowDragOver = (event: globalThis.DragEvent) => {
      setDragPreview((current) =>
        current
          ? {
              ...current,
              x: event.clientX,
              y: event.clientY,
            }
          : null
      )
    }

    const clearPreview = () => {
      setDragPreview(null)
    }

    window.addEventListener("dragover", handleWindowDragOver)
    window.addEventListener("drop", clearPreview)
    window.addEventListener("dragend", clearPreview)

    return () => {
      window.removeEventListener("dragover", handleWindowDragOver)
      window.removeEventListener("drop", clearPreview)
      window.removeEventListener("dragend", clearPreview)
    }
  }, [])

  const handleShapeDragStart = useCallback(
    (payload: CanvasShapeDragPayload, position: { x: number; y: number }) => {
      setDragPreview({
        ...payload,
        x: position.x,
        y: position.y,
      })
    },
    []
  )

  const handleShapeDragEnd = useCallback(() => {
    setDragPreview(null)
  }, [])

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }, [])

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const payload = getCanvasShapePayload(event.dataTransfer)

      if (!payload) {
        return
      }

      nodeCounterRef.current += 1

      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: CanvasNode = {
        id: `${payload.shape}-${Date.now()}-${nodeCounterRef.current}`,
        type: CANVAS_NODE_TYPE,
        position: {
          x: position.x - payload.width / 2,
          y: position.y - payload.height / 2,
        },
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR,
          shape: payload.shape,
        },
        style: {
          width: payload.width,
          height: payload.height,
        },
      }

      onNodesChange([
        {
          type: "add",
          item: newNode,
          index: nodes.length,
        } satisfies NodeAddChange<CanvasNode>,
      ])

      setDragPreview(null)
    },
    [nodes.length, onNodesChange, reactFlow]
  )

  return (
    <div className="relative h-full w-full" onDragOver={handleDragOver} onDrop={handleDrop}>
      <ReactFlow<CanvasNode, CanvasEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        connectionMode={ConnectionMode.Loose}
        fitView
        minZoom={0.3}
        maxZoom={1.8}
        defaultEdgeOptions={{
          type: CANVAS_EDGE_TYPE,
          animated: false,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: {
            stroke: "var(--text-primary)",
            strokeWidth: 1.5,
          },
        }}
        className="bg-base"
      >
        <MiniMap<CanvasNode>
          pannable
          zoomable
          bgColor="var(--bg-surface)"
          maskColor="var(--bg-base)"
          nodeColor={(node) => node.data.color.fill}
          nodeStrokeColor="var(--border-default)"
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="var(--border-default)"
        />
      </ReactFlow>
      <CanvasShapeToolbar
        onShapeDragStart={handleShapeDragStart}
        onShapeDragEnd={handleShapeDragEnd}
      />
      {dragPreview ? <CanvasShapeDragPreview preview={dragPreview} /> : null}
    </div>
  )
}

function CollaborativeCanvasRoom({ projectId }: CollaborativeCanvasProps) {
  return (
    <RoomProvider
      id={projectId}
      initialPresence={{
        cursor: null,
        isThinking: false,
      }}
      initialStorage={{
        flow: new LiveObject({
          nodes: new LiveMap(),
          edges: new LiveMap(),
        }),
      }}
    >
      <LiveblocksConnectionGuard>
        <ClientSideSuspense fallback={<CanvasLoadingState />}>
          {() => (
            <ReactFlowProvider>
              <CollaborativeCanvasFlow />
            </ReactFlowProvider>
          )}
        </ClientSideSuspense>
      </LiveblocksConnectionGuard>
    </RoomProvider>
  )
}

export function CollaborativeCanvas({ projectId }: CollaborativeCanvasProps) {
  const authEndpoint = useCallback(async () => {
    const response = await fetch("/api/liveblocks-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
      }),
    })

    return response.json()
  }, [projectId])

  return (
    <div className="absolute inset-0">
      <LiveblocksProvider authEndpoint={authEndpoint}>
        <CollaborativeCanvasRoom projectId={projectId} />
      </LiveblocksProvider>
    </div>
  )
}
