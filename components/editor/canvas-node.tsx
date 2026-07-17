"use client";

import {
  Handle,
  NodeResizer,
  Position,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  DEFAULT_NODE_COLOR,
  NODE_COLORS,
  MIN_CANVAS_NODE_HEIGHT,
  MIN_CANVAS_NODE_WIDTH,
  type CanvasNode,
  type CanvasNodeColor,
} from "@/types/canvas";

const HANDLE_CLASS_NAME =
  "!h-3 !w-3 !border-2 !border-border-default !bg-copy-primary opacity-0 transition-opacity duration-150 group-hover:opacity-100";
const RESIZER_HANDLE_CLASS_NAME =
  "!h-3 !w-3 !rounded-full !border !border-surface-border !bg-elevated !shadow-sm";
const RESIZER_LINE_CLASS_NAME = "!border-border-subtle";

interface CanvasShapeVisualProps {
  color: CanvasNode["data"]["color"];
  shape: CanvasNode["data"]["shape"];
  selected?: boolean;
}

export function CanvasShapeVisual({
  color,
  shape,
  selected = false,
}: CanvasShapeVisualProps) {
  const stroke = selected ? "var(--text-primary)" : "var(--border-default)";
  const shapeShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.35)";
  const sharedShapeProps = {
    fill: color.fill,
    stroke,
    strokeWidth: 1.5,
    vectorEffect: "non-scaling-stroke" as const,
  };

  switch (shape) {
    case "rectangle":
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl border"
          style={{
            backgroundColor: color.fill,
            borderColor: stroke,
            boxShadow: shapeShadow,
          }}
        />
      );
    case "circle":
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full border"
          style={{
            backgroundColor: color.fill,
            borderColor: stroke,
            boxShadow: shapeShadow,
          }}
        />
      );
    case "pill":
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full border"
          style={{
            backgroundColor: color.fill,
            borderColor: stroke,
            boxShadow: shapeShadow,
          }}
        />
      );
    case "diamond":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          style={{ filter: `drop-shadow(${shapeShadow})` }}
        >
          <polygon points="50,2 98,50 50,98 2,50" {...sharedShapeProps} />
        </svg>
      );
    case "cylinder":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          style={{ filter: `drop-shadow(${shapeShadow})` }}
        >
          <path
            d="M18 20 C18 12, 82 12, 82 20 L82 76 C82 84, 18 84, 18 76 Z"
            {...sharedShapeProps}
          />
          <ellipse cx="50" cy="20" rx="32" ry="10" {...sharedShapeProps} />
          <path
            d="M18 76 C18 84, 82 84, 82 76"
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );
    case "hexagon":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          style={{ filter: `drop-shadow(${shapeShadow})` }}
        >
          <polygon
            points="24,6 76,6 98,50 76,94 24,94 2,50"
            {...sharedShapeProps}
          />
        </svg>
      );
    default:
      return null;
  }
}

export function CanvasNodeRenderer({
  id,
  data,
  selected,
}: NodeProps<CanvasNode>) {
  const { updateNodeData } = useReactFlow<CanvasNode>();
  const label = typeof data.label === "string" ? data.label : "";
  const color =
    data.color &&
    typeof data.color.fill === "string" &&
    typeof data.color.text === "string"
      ? data.color
      : DEFAULT_NODE_COLOR;
  const shape = data.shape ?? "rectangle";
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(label);
  const [hoveredColorFill, setHoveredColorFill] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }, [isEditing]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [draftLabel, isEditing]);

  const openEditing = () => {
    setDraftLabel(label);
    setIsEditing(true);
  };

  const closeEditing = () => {
    setIsEditing(false);
  };

  const handleLabelChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextLabel = event.target.value;

    setDraftLabel(nextLabel);
    updateNodeData(id, { label: nextLabel });
  };

  const handleLabelKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeEditing();
    }
  };

  const handleColorSelect = (color: CanvasNodeColor) => {
    updateNodeData(id, { color });
  };

  const handlePositions = [
    { side: "top", position: Position.Top },
    { side: "right", position: Position.Right },
    { side: "bottom", position: Position.Bottom },
    { side: "left", position: Position.Left },
  ] as const;

  return (
    <div
      className="group relative flex h-full w-full items-center justify-center px-4 py-3 text-center"
      style={{ color: color.text }}
    >
      {selected ? (
        <div
          className="nodrag nopan nowheel absolute bottom-full left-1/2 z-30 mb-3 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-surface-border bg-surface px-3 py-2 shadow-2xl"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
        >
          {NODE_COLORS.map((option) => {
            const isActive =
              color.fill === option.fill && color.text === option.text;
            const isHovered = hoveredColorFill === option.fill;

            return (
              <button
                key={`${option.fill}-${option.text}`}
                type="button"
                aria-label={`Set node color ${option.fill}`}
                aria-pressed={isActive}
                onClick={(event) => {
                  event.stopPropagation();
                  handleColorSelect(option);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                onMouseEnter={() => setHoveredColorFill(option.fill)}
                onMouseLeave={() =>
                  setHoveredColorFill((current) =>
                    current === option.fill ? null : current,
                  )
                }
                className="h-5 w-5 rounded-full border-2 transition duration-150 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copy-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                style={{
                  backgroundColor: option.fill,
                  borderColor: isActive ? option.text : "var(--border-default)",
                  boxShadow:
                    isActive || isHovered
                      ? `0 0 0 1px ${option.text}, 0 0 12px -4px ${option.text}`
                      : "none",
                }}
              >
                <span className="sr-only">
                  {isActive ? "Active node color" : "Set node color"}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <NodeResizer
        isVisible={selected}
        minWidth={MIN_CANVAS_NODE_WIDTH}
        minHeight={MIN_CANVAS_NODE_HEIGHT}
        keepAspectRatio={shape === "circle"}
        color="var(--border-subtle)"
        handleClassName={RESIZER_HANDLE_CLASS_NAME}
        lineClassName={RESIZER_LINE_CLASS_NAME}
      />

      <CanvasShapeVisual color={color} shape={shape} selected={selected} />

      {handlePositions.map(({ side, position }) => (
        <Handle
          key={`${side}-target`}
          id={`${side}-target`}
          type="target"
          position={position}
          className={HANDLE_CLASS_NAME}
        />
      ))}
      {handlePositions.map(({ side, position }) => (
        <Handle
          key={`${side}-source`}
          id={`${side}-source`}
          type="source"
          position={position}
          className={HANDLE_CLASS_NAME}
        />
      ))}

      <div className="absolute inset-0 z-10 flex items-center justify-center px-5 py-4">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={draftLabel}
            rows={1}
            placeholder="Untitled node"
            spellCheck={false}
            onChange={handleLabelChange}
            onBlur={closeEditing}
            onKeyDown={handleLabelKeyDown}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
            className="nodrag nopan nowheel max-h-full w-full resize-none overflow-hidden border-0 bg-transparent px-0 py-0 text-center text-sm font-medium leading-5 text-inherit outline-none placeholder:text-copy-muted"
          />
        ) : (
          <button
            type="button"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === "F2") {
                event.preventDefault();
                event.stopPropagation();
                openEditing();
              }
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
              openEditing();
            }}
            className="flex w-full items-center justify-center bg-transparent px-0 py-0 text-center text-sm font-medium leading-5 outline-none"
          >
            <span
              className={
                label.trim().length > 0 ? "break-words" : "text-copy-muted"
              }
            >
              {label.trim() || "Untitled node"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
