import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { FlowNodeData } from "@/_lib/tree/to-react-flow";
import Link from "next/link";

export function PatternNode({ data }: NodeProps) {
  const d = data as FlowNodeData;
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-accent-cyan/30 bg-bg-surface px-4 py-2 text-center shadow-sm">
      <Link
        href={`/patterns/${d.patternSlug}`}
        prefetch={false}
        className="text-sm font-semibold text-accent-cyan hover:underline"
      >
        {d.label}
      </Link>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-accent-cyan"
      />
    </div>
  );
}
