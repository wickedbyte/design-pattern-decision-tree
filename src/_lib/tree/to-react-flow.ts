import type { Node, Edge } from "@xyflow/react";
import type { DecisionNode, NodeKind } from "@/_lib/domain/DecisionNode";
import type { DecisionEdge } from "@/_lib/domain/DecisionEdge";
import type { PatternSlug } from "@/_lib/domain/PatternSlug";
import type { PatternCategoryId } from "@/_lib/domain/PatternCategory";
import { computeTreeLayout } from "./layout";

export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  kind: NodeKind;
  description?: string;
  patternSlug?: PatternSlug;
  categoryId?: PatternCategoryId;
}

export function toReactFlowElements(
  nodes: readonly DecisionNode[],
  edges: readonly DecisionEdge[]
): { nodes: Node<FlowNodeData>[]; edges: Edge[] } {
  const layout = computeTreeLayout(nodes, edges);

  const flowNodes: Node<FlowNodeData>[] = nodes.map((node) => {
    const pos = layout.nodes.get(node.id);
    if (!pos) throw new Error(`Missing layout for node ${node.id}`);
    return {
      id: node.id,
      type: node.kind,
      position: { x: pos.x, y: pos.y },
      data: {
        label: node.label,
        kind: node.kind,
        description: node.description,
        patternSlug: node.patternSlug,
        categoryId: node.categoryId,
      },
      draggable: false,
      connectable: false,
      style: { width: pos.width, height: pos.height },
    };
  });

  const flowEdges: Edge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: "animated",
    animated: false,
  }));

  return { nodes: flowNodes, edges: flowEdges };
}
