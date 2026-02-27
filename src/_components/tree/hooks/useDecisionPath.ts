"use client";

import { useCallback, useState } from "react";
import { DecisionPath } from "@/_lib/domain/DecisionPath";
import { DECISION_EDGES } from "@/_lib/data/decision-tree";

export function useDecisionPath() {
  const [path, setPath] = useState(DecisionPath.empty());

  const selectNode = useCallback(
    (nodeId: string, answer?: "Yes" | "No") => {
      setPath((prev) => prev.addStep({ nodeId, answer }));
    },
    []
  );

  const goBack = useCallback(() => {
    setPath((prev) => {
      if (prev.length <= 1) return DecisionPath.empty();
      const prevSteps = prev.steps.slice(0, -1);
      let newPath = DecisionPath.empty();
      for (const step of prevSteps) {
        newPath = newPath.addStep(step);
      }
      return newPath;
    });
  }, []);

  const reset = useCallback(() => {
    setPath(DecisionPath.empty());
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
    isOnPath,
    isEdgeOnPath,
  };
}
