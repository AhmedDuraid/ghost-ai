"use client";

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useCanRedo,
  useCanUndo,
  useErrorListener,
  useRedo,
  useUndo,
} from "@liveblocks/react";
import { LiveMap, LiveObject } from "@liveblocks/client";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Panel,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type EdgeTypes,
  type Edge,
  type NodeAddChange,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import { Minus, Plus, Redo2, ScanSearch, Trash2, Undo2 } from "lucide-react";
import {
  type DragEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import { CanvasEdgeRenderer } from "@/components/editor/canvas-edge";
import {
  CanvasNodeRenderer,
  CanvasShapeVisual,
} from "@/components/editor/canvas-node";
import {
  CanvasShapeToolbar,
  type CanvasShapeDragPayload,
  getCanvasShapePayload,
} from "@/components/editor/canvas-shape-toolbar";
import {
  CANVAS_TEMPLATES,
  type CanvasTemplate,
} from "@/components/editor/starter-templates";
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal";
import { Button } from "@/components/ui/button";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import {
  CANVAS_EDGE_TYPE,
  CANVAS_NODE_TYPE,
  DEFAULT_NODE_COLOR,
  type CanvasEdge,
  type CanvasNode,
} from "@/types/canvas";

import "@xyflow/react/dist/style.css";

const NODE_TYPES: NodeTypes = {
  [CANVAS_NODE_TYPE]: CanvasNodeRenderer,
};

interface CollaborativeCanvasProps {
  projectId: string;
  isStarterTemplatesOpen: boolean;
  onStarterTemplatesOpenChange: (open: boolean) => void;
}

interface ShapeDragPreviewState extends CanvasShapeDragPayload {
  x: number;
  y: number;
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
  );
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
  );
}

function getConnectionErrorMessage(code: number) {
  switch (code) {
    case -1:
      return "Authentication with the collaboration service failed for this workspace.";
    case 4001:
      return "You do not have access to join this collaborative room.";
    case 4005:
      return "The collaborative room is full right now. Please try again shortly.";
    case 4006:
      return "The workspace room changed while connecting. Refresh and try again.";
    default:
      return "The shared canvas could not connect right now. Please try again.";
  }
}

function LiveblocksConnectionGuard({ children }: { children: ReactNode }) {
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useErrorListener((error) => {
    if (error.context.type === "ROOM_CONNECTION_ERROR") {
      setConnectionError(getConnectionErrorMessage(error.context.code));
    }
  });

  if (connectionError) {
    return <CanvasConnectionError message={connectionError} />;
  }

  return <>{children}</>;
}

function createCanvasNodeId() {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createCanvasEdgeId() {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `edge-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function CanvasShapeDragPreview({
  preview,
}: {
  preview: ShapeDragPreviewState;
}) {
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
  );
}

function CanvasControlBar({
  canUndo,
  canRedo,
  canDelete,
  onUndo,
  onRedo,
  onDelete,
  onZoomIn,
  onZoomOut,
  onFitView,
}: {
  canUndo: boolean;
  canRedo: boolean;
  canDelete: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}) {
  return (
    <Panel position="bottom-left">
      <div className="mb-24 ml-4 flex items-center gap-1 rounded-full border border-surface-border bg-sidebar px-2 py-2 shadow-2xl backdrop-blur-md">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Zoom out"
          onClick={onZoomOut}
          className="rounded-full text-copy-secondary hover:bg-subtle hover:text-copy-primary"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Fit view"
          onClick={onFitView}
          className="rounded-full text-copy-secondary hover:bg-subtle hover:text-copy-primary"
        >
          <ScanSearch className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Zoom in"
          onClick={onZoomIn}
          className="rounded-full text-copy-secondary hover:bg-subtle hover:text-copy-primary"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border-default" />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Undo"
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-full text-copy-secondary hover:bg-subtle hover:text-copy-primary disabled:text-copy-faint"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Redo"
          onClick={onRedo}
          disabled={!canRedo}
          className="rounded-full text-copy-secondary hover:bg-subtle hover:text-copy-primary disabled:text-copy-faint"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Delete selected nodes and edges"
          onClick={onDelete}
          disabled={!canDelete}
          className="rounded-full text-copy-secondary hover:bg-state-error/10 hover:text-state-error disabled:text-copy-faint"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Panel>
  );
}

function CollaborativeCanvasFlow({
  isStarterTemplatesOpen,
  onStarterTemplatesOpenChange,
}: Pick<
  CollaborativeCanvasProps,
  "isStarterTemplatesOpen" | "onStarterTemplatesOpenChange"
>) {
  const { nodes, edges, onNodesChange, onEdgesChange, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: {
        initial: [],
      },
      edges: {
        initial: [],
      },
    });
  const reactFlow = useReactFlow<CanvasNode, CanvasEdge>();
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const [dragPreview, setDragPreview] = useState<ShapeDragPreviewState | null>(
    null,
  );
  const hasSelection = nodes.some((node) => node.selected) || edges.some((edge) => edge.selected);

  const deleteSelectedElements = useCallback(() => {
    const selectedNodes = reactFlow
      .getNodes()
      .filter((node) => node.selected);
    const selectedEdges = reactFlow
      .getEdges()
      .filter((edge) => edge.selected);

    if (selectedNodes.length === 0 && selectedEdges.length === 0) {
      return;
    }

    void reactFlow.deleteElements({
      nodes: selectedNodes as Node[],
      edges: selectedEdges as Edge[],
    });
  }, [reactFlow]);

  const edgeTypes: EdgeTypes = {
    [CANVAS_EDGE_TYPE]: (props) => (
      <CanvasEdgeRenderer
        {...props}
        onLabelChange={(edgeId, label) => {
          reactFlow.updateEdgeData(edgeId, { label });
        }}
      />
    ),
  };

  useKeyboardShortcuts({
    reactFlow,
    onUndo: undo,
    onRedo: redo,
    onDeleteSelection: deleteSelectedElements,
  });

  useEffect(() => {
    const handleWindowDragOver = (event: globalThis.DragEvent) => {
      setDragPreview((current) =>
        current
          ? {
              ...current,
              x: event.clientX,
              y: event.clientY,
            }
          : null,
      );
    };

    const clearPreview = () => {
      setDragPreview(null);
    };

    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", clearPreview);
    window.addEventListener("dragend", clearPreview);

    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", clearPreview);
      window.removeEventListener("dragend", clearPreview);
    };
  }, []);

  const handleShapeDragStart = useCallback(
    (payload: CanvasShapeDragPayload, position: { x: number; y: number }) => {
      setDragPreview({
        ...payload,
        x: position.x,
        y: position.y,
      });
    },
    [],
  );

  const handleShapeDragEnd = useCallback(() => {
    setDragPreview(null);
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const payload = getCanvasShapePayload(event.dataTransfer);

      if (!payload) {
        return;
      }

      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: CanvasNode = {
        id: createCanvasNodeId(),
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
      };

      onNodesChange([
        {
          type: "add",
          item: newNode,
          index: nodes.length,
        } satisfies NodeAddChange<CanvasNode>,
      ]);

      setDragPreview(null);
    },
    [nodes.length, onNodesChange, reactFlow],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) {
        return;
      }

      reactFlow.addEdges({
        id: createCanvasEdgeId(),
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: CANVAS_EDGE_TYPE,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        data: {
          label: "",
        },
      });
    },
    [reactFlow],
  );

  const handleImportTemplate = useCallback(
    (template: CanvasTemplate) => {
      reactFlow.setNodes(template.nodes);
      reactFlow.setEdges(template.edges);

      requestAnimationFrame(() => {
        void reactFlow.fitView({
          duration: 220,
          padding: 0.2,
        });
      });
    },
    [reactFlow],
  );

  return (
    <div
      className="relative h-full w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow<CanvasNode, CanvasEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDelete={onDelete}
        nodeTypes={NODE_TYPES}
        edgeTypes={edgeTypes}
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
        <CanvasControlBar
          canUndo={canUndo}
          canRedo={canRedo}
          canDelete={hasSelection}
          onUndo={undo}
          onRedo={redo}
          onDelete={deleteSelectedElements}
          onZoomIn={() => {
            void reactFlow.zoomIn({ duration: 180 });
          }}
          onZoomOut={() => {
            void reactFlow.zoomOut({ duration: 180 });
          }}
          onFitView={() => {
            void reactFlow.fitView({
              duration: 220,
              padding: 0.2,
            });
          }}
        />
      </ReactFlow>
      <CanvasShapeToolbar
        onShapeDragStart={handleShapeDragStart}
        onShapeDragEnd={handleShapeDragEnd}
      />
      <StarterTemplatesModal
        isOpen={isStarterTemplatesOpen}
        onOpenChange={onStarterTemplatesOpenChange}
        templates={CANVAS_TEMPLATES}
        onImport={handleImportTemplate}
      />
      {dragPreview ? <CanvasShapeDragPreview preview={dragPreview} /> : null}
    </div>
  );
}

function CollaborativeCanvasRoom({
  projectId,
  isStarterTemplatesOpen,
  onStarterTemplatesOpenChange,
}: CollaborativeCanvasProps) {
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
              <CollaborativeCanvasFlow
                isStarterTemplatesOpen={isStarterTemplatesOpen}
                onStarterTemplatesOpenChange={onStarterTemplatesOpenChange}
              />
            </ReactFlowProvider>
          )}
        </ClientSideSuspense>
      </LiveblocksConnectionGuard>
    </RoomProvider>
  );
}

export function CollaborativeCanvas({
  projectId,
  isStarterTemplatesOpen,
  onStarterTemplatesOpenChange,
}: CollaborativeCanvasProps) {
  const authEndpoint = useCallback(async () => {
    const response = await fetch("/api/liveblocks-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
      }),
    });

    return response.json();
  }, [projectId]);

  return (
    <div className="absolute inset-0">
      <LiveblocksProvider authEndpoint={authEndpoint}>
        <CollaborativeCanvasRoom
          projectId={projectId}
          isStarterTemplatesOpen={isStarterTemplatesOpen}
          onStarterTemplatesOpenChange={onStarterTemplatesOpenChange}
        />
      </LiveblocksProvider>
    </div>
  );
}
