import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { FlowNodeData } from "@/_lib/tree/to-react-flow";

export function FallbackNode({ data }: NodeProps) {
  const d = data as FlowNodeData;
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl bg-structural-dark px-4 py-2 text-center text-white shadow-lg shadow-structural/20">
      <span className="text-sm font-bold">{d.label}</span>
      {d.description && (
        <span className="mt-0.5 text-xs opacity-80">{d.description}</span>
      )}
      <Handle type="target" position={Position.Top} className="!bg-white/50" />
    </div>
  );
}
