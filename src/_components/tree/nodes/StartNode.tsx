import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { FlowNodeData } from "@/_lib/tree/to-react-flow";

export function StartNode({ data }: NodeProps) {
  const d = data as FlowNodeData;
  return (
    <div className="flex h-full items-center justify-center rounded-xl bg-accent-rose px-4 py-3 text-center font-bold text-white shadow-md">
      <span>{d.label}</span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-accent-rose"
      />
    </div>
  );
}
