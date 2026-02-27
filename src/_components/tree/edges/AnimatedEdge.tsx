import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  style,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  const isYes = label === "Yes";
  const isNo = label === "No";
  const color = isYes ? "#10b981" : isNo ? "#e94560" : "#64748b";

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ ...style, stroke: color, strokeWidth: 2 }} />
      {label && (
        <foreignObject
          x={labelX - 16}
          y={labelY - 10}
          width={32}
          height={20}
          className="pointer-events-none"
        >
          <div className="flex h-full items-center justify-center">
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold"
              style={{ color, backgroundColor: "var(--bg-primary)" }}
            >
              {label as string}
            </span>
          </div>
        </foreignObject>
      )}
    </>
  );
}
