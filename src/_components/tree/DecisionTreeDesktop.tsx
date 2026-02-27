"use client";

import { useState, useCallback } from "react";
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
import { TreeSearch } from "./TreeSearch";
import { InspectorPanel } from "./InspectorPanel";

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
  const [searchMatches, setSearchMatches] = useState<Set<string>>(new Set());
  const [inspectedNodeId, setInspectedNodeId] = useState<string | null>(null);

  const hasSearchQuery = searchMatches.size > 0;
  const hasPathSelection = nodes.some((n) => isOnPath(n.id));

  const handleSearchResults = useCallback((matches: Set<string>) => {
    setSearchMatches(matches);
  }, []);

  const styledNodes = nodes.map((node) => {
    let opacity = 1;

    if (hasSearchQuery) {
      // Search takes priority: matching nodes are full opacity, others dimmed
      opacity = searchMatches.has(node.id) ? 1 : 0.2;
    } else if (hasPathSelection) {
      opacity = isOnPath(node.id) ? 1 : 0.4;
    }

    // Search highlight ring
    const searchHighlight =
      hasSearchQuery && searchMatches.has(node.id)
        ? { boxShadow: "0 0 0 3px var(--accent-blue)", borderRadius: "8px" }
        : {};

    return {
      ...node,
      style: {
        ...node.style,
        opacity,
        transition: "opacity 0.3s ease, box-shadow 0.3s ease",
        ...searchHighlight,
      },
    };
  });

  const styledEdges = edges.map((edge) => ({
    ...edge,
    style: {
      ...edge.style,
      opacity: hasSearchQuery
        ? 0.2
        : isEdgeOnPath(edge.id) || !hasPathSelection
          ? 1
          : 0.2,
      transition: "opacity 0.3s ease",
    },
  }));

  return (
    <div className="flex h-[700px] w-full overflow-hidden rounded-xl border border-border-primary bg-bg-surface shadow-lg">
      <div className="relative flex-1">
        <TreeSearch onSearchResults={handleSearchResults} />
        <ReactFlow
          nodes={styledNodes}
          edges={styledEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={(_event, node) => {
            selectNode(node.id);
            setInspectedNodeId(node.id);
          }}
          nodesDraggable={false}
          nodesConnectable={false}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="var(--text-muted)"
            className="opacity-20"
          />
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
      <InspectorPanel
        nodeId={inspectedNodeId}
        onClose={() => setInspectedNodeId(null)}
      />
    </div>
  );
}
