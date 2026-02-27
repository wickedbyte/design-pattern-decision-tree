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
    <div className="h-[700px] w-full rounded-xl border border-border-primary bg-bg-surface shadow-lg">
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
                return "var(--accent-rose)";
              case "category":
                return "var(--accent-blue)";
              case "question":
                return "var(--accent-purple)";
              case "pattern":
                return "var(--accent-cyan)";
              case "fallback":
                return "var(--structural-dark)";
              default:
                return "var(--text-muted)";
            }
          }}
          className="!bg-bg-elevated !border-border-primary"
        />
        <Controls className="!bg-bg-surface !border-border-primary !shadow-sm [&_button]:!bg-bg-surface [&_button]:!border-border-primary [&_button]:!text-text-secondary" />
      </ReactFlow>
    </div>
  );
}
