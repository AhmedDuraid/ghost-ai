"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import {
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import type { CanvasEdge } from "@/types/canvas";

interface CanvasEdgeRendererProps extends EdgeProps<CanvasEdge> {
  onLabelChange?: (edgeId: string, label: string) => void;
}

export function CanvasEdgeRenderer({
  id,
  data,
  selected,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  onLabelChange,
}: CanvasEdgeRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(data?.label ?? "");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const label = typeof data?.label === "string" ? data.label : "";
  const isActive = selected || isHovered || isEditing;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 18,
    offset: 24,
  });

  useEffect(() => {
    if (!isEditing) {
      setDraftLabel(label);
      return;
    }

    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, [isEditing, label]);

  const closeEditing = () => {
    setIsEditing(false);
  };

  const openEditing = () => {
    setDraftLabel(label);
    setIsEditing(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeEditing();
    }
  };

  const handleInputChange = (nextLabel: string) => {
    setDraftLabel(nextLabel);
    onLabelChange?.(id, nextLabel);
  };

  const shouldShowLabel = isEditing || label.trim().length > 0 || isActive;

  return (
    <>
      <g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={(event) => {
          event.stopPropagation();
          openEditing();
        }}
      >
        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={markerEnd}
          interactionWidth={28}
          style={{
            ...style,
            stroke: isActive ? "var(--text-primary)" : "var(--text-secondary)",
            strokeOpacity: isActive ? 0.96 : 0.58,
            strokeWidth: isActive ? 2 : 1.75,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </g>

      {shouldShowLabel ? (
        <EdgeLabelRenderer>
          <div
            className="pointer-events-none absolute left-0 top-0 z-20"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                value={draftLabel}
                size={Math.max(6, draftLabel.length + 1)}
                spellCheck={false}
                onChange={(event) => handleInputChange(event.target.value)}
                onBlur={closeEditing}
                onKeyDown={handleKeyDown}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
                onDoubleClick={(event) => event.stopPropagation()}
                className="nodrag nopan nowheel pointer-events-auto h-7 min-w-20 rounded-full border border-surface-border bg-surface px-3 text-center text-xs font-medium text-copy-primary outline-none ring-0 placeholder:text-copy-muted"
                placeholder="Edge label"
              />
            ) : (
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  openEditing();
                }}
                className="nodrag nopan nowheel pointer-events-auto rounded-full border border-surface-border bg-surface/95 px-3 py-1 text-[11px] font-medium text-copy-primary shadow-lg transition-colors hover:border-border-subtle"
              >
                <span className={label.trim().length > 0 ? "" : "text-copy-muted"}>
                  {label.trim().length > 0 ? label : "Add label"}
                </span>
              </button>
            )}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
