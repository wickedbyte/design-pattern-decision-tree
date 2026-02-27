import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { FlowNodeData } from "@/_lib/tree/to-react-flow";

const CATEGORY_COLORS: Record<string, string> = {
  creational: "bg-creational shadow-creational/20 border-creational/30",
  structural: "bg-structural shadow-structural/20 border-structural/30",
  behavioral: "bg-behavioral shadow-behavioral/20 border-behavioral/30",
};

export function CategoryNode({ data }: NodeProps) {
  const d = data as FlowNodeData;
  const colors = CATEGORY_COLORS[d.categoryId ?? ""] ?? "bg-bg-surface";
  return (
    <div
      className={`flex h-full flex-col items-center justify-center rounded-xl border px-4 py-2 text-center text-white shadow-lg ${colors}`}
    >
      <span className="text-sm font-bold">{d.label}</span>
      {d.description && (
        <span className="mt-0.5 text-xs opacity-80">{d.description}</span>
      )}
      <Handle type="target" position={Position.Top} className="!bg-white/50" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-white/50"
      />
    </div>
  );
}
