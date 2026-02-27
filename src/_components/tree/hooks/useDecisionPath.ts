"use client";

import { useCallback, useState } from "react";
import { DecisionPath } from "@/_lib/domain/DecisionPath";
import { DECISION_NODES, DECISION_EDGES } from "@/_lib/data/decision-tree";

export function useDecisionPath() {
  const [path, setPath] = useState(DecisionPath.empty());

  const selectNode = useCallback((nodeId: string, answer?: "Yes" | "No") => {
    setPath((prev) => {
      // Don't append if this node is already the current one
      if (prev.currentNodeId === nodeId) return prev;
      return prev.addStep({ nodeId, answer });
    });
  }, []);

  const goBack = useCallback(() => {
    setPath((prev) => {
      if (prev.length <= 1) return DecisionPath.empty();
      let newSteps = prev.steps.slice(0, -1);
      // If we'd land on a category node (auto-skipped in wizard), go back one more
      const lastStep = newSteps[newSteps.length - 1];
      if (lastStep) {
        const node = DECISION_NODES.find((n) => n.id === lastStep.nodeId);
        if (node?.kind === "category") {
          if (newSteps.length <= 1) return DecisionPath.empty();
          newSteps = newSteps.slice(0, -1);
        }
      }
      return DecisionPath.fromSteps(newSteps);
    });
  }, []);

  const reset = useCallback(() => {
    setPath(DecisionPath.empty());
  }, []);

  const navigateTo = useCallback((nodeId: string) => {
    setPath((prev) => prev.removeAfter(nodeId));
  }, []);

  const isOnPath = useCallback(
    (nodeId: string) => path.containsNode(nodeId),
    [path]
  );

  const isEdgeOnPath = useCallback(
    (edgeId: string) => {
      const edge = DECISION_EDGES.find((e) => e.id === edgeId);
      if (!edge) return false;
      return path.containsNode(edge.source) && path.containsNode(edge.target);
    },
    [path]
  );

  return {
    path,
    selectNode,
    goBack,
    reset,
    navigateTo,
    isOnPath,
    isEdgeOnPath,
  };
}
