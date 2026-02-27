import dagre from "dagre";
import type { DecisionNode } from "@/_lib/domain/DecisionNode";
import type { DecisionEdge } from "@/_lib/domain/DecisionEdge";

interface LayoutResult {
  nodes: Map<string, { x: number; y: number; width: number; height: number }>;
  edges: DecisionEdge[];
}

const NODE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  start: { width: 280, height: 60 },
  category: { width: 240, height: 80 },
  question: { width: 260, height: 70 },
  pattern: { width: 200, height: 60 },
  fallback: { width: 220, height: 60 },
};

export function computeTreeLayout(
  nodes: readonly DecisionNode[],
  edges: readonly DecisionEdge[]
): LayoutResult {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "TB",
    ranksep: 80,
    nodesep: 40,
    edgesep: 20,
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const node of nodes) {
    const dim = NODE_DIMENSIONS[node.kind] ?? { width: 200, height: 60 };
    g.setNode(node.id, { width: dim.width, height: dim.height });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const result = new Map<
    string,
    { x: number; y: number; width: number; height: number }
  >();
  for (const node of nodes) {
    const n = g.node(node.id);
    result.set(node.id, {
      x: n.x - n.width / 2,
      y: n.y - n.height / 2,
      width: n.width,
      height: n.height,
    });
  }

  return { nodes: result, edges: [...edges] };
}
