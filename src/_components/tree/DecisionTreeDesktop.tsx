"use client";

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useTreeLayout } from "./hooks/useTreeLayout";
import { useDecisionPath } from "./hooks/useDecisionPath";
import { StartNode } from "./nodes/StartNode";
import { CategoryNode } from "./nodes/CategoryNode";
import { QuestionNode } from "./nodes/QuestionNode";
import { PatternNode } from "./nodes/PatternNode";
import { FallbackNode } from "./nodes/FallbackNode";
import { AnimatedEdge } from "./edges/AnimatedEdge";

const nodeTypes: NodeTypes = {
  start: StartNode,
  category: CategoryNode,
  question: QuestionNode,
  pattern: PatternNode,
  fallback: FallbackNode,
};

const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};

export function DecisionTreeDesktop() {
  const { nodes, edges } = useTreeLayout();
  const { isOnPath, isEdgeOnPath, selectNode } = useDecisionPath();

  const styledNodes = nodes.map((node) => ({
    ...node,
    style: {
      ...node.style,
      opacity: isOnPath(node.id) || nodes.every((n) => !isOnPath(n.id)) ? 1 : 0.4,
      transition: "opacity 0.3s ease",
    },
  }));

  const styledEdges = edges.map((edge) => ({
    ...edge,
    style: {
      ...edge.style,
      opacity: isEdgeOnPath(edge.id) || edges.every((e) => !isEdgeOnPath(e.id)) ? 1 : 0.2,
      transition: "opacity 0.3s ease",
    },
  }));

  return (
    <div className="h-[700px] w-full rounded-xl border border-white/10 bg-bg-surface/30">
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_event, node) => selectNode(node.id)}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--text-muted)" className="opacity-20" />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "start":
                return "#e94560";
              case "category":
                return "#3b82f6";
              case "question":
                return "#8b5cf6";
              case "pattern":
                return "#7ec8e3";
              case "fallback":
                return "#6d28d9";
              default:
                return "#64748b";
            }
          }}
          className="!bg-bg-elevated !border-white/10"
        />
        <Controls className="!bg-bg-elevated !border-white/10 !shadow-lg [&_button]:!bg-bg-elevated [&_button]:!border-white/10 [&_button]:!text-text-secondary" />
      </ReactFlow>
    </div>
  );
}
