import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { FlowNodeData } from "@/_lib/tree/to-react-flow";

export function QuestionNode({ data }: NodeProps) {
  const d = data as FlowNodeData;
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-border-primary bg-bg-surface px-3 py-2 text-center text-sm text-text-primary shadow-sm">
      <span>{d.label}</span>
      <Handle type="target" position={Position.Top} className="!bg-accent-purple" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        className="!bg-accent-green !left-[30%]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        className="!bg-accent-rose !left-[70%]"
      />
    </div>
  );
}
