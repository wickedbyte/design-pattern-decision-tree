"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DecisionPath } from "@/_lib/domain/DecisionPath";
import { serializePath, deserializePath } from "@/_lib/utils/decision-path-url";
import { DECISION_EDGES } from "@/_lib/data/decision-tree";

// Cache the snapshot so useSyncExternalStore gets a stable reference
// when the hash hasn't changed (required to avoid infinite re-render).
let cachedHash = "";
let cachedPath = DecisionPath.empty();

function getPathFromHash(): DecisionPath {
  const hash = window.location.hash;
  if (hash !== cachedHash) {
    cachedHash = hash;
    cachedPath = deserializePath(hash);
  }
  return cachedPath;
}

const SERVER_SNAPSHOT = DecisionPath.empty();
function getServerSnapshot(): DecisionPath {
  return SERVER_SNAPSHOT;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function writePath(path: DecisionPath): void {
  const hash = serializePath(path);
  if (hash) {
    history.replaceState(null, "", hash);
  } else {
    // Remove hash without causing a scroll jump
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  }
  // Invalidate cache before dispatching so the next getSnapshot reads fresh
  cachedHash = "";
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function useDecisionPathUrl() {
  const path = useSyncExternalStore(
    subscribe,
    getPathFromHash,
    getServerSnapshot
  );

  const selectNode = useCallback((nodeId: string, answer?: "Yes" | "No") => {
    const current = getPathFromHash();
    writePath(current.addStep({ nodeId, answer }));
  }, []);

  const goBack = useCallback(() => {
    const current = getPathFromHash();
    if (current.length <= 1) {
      writePath(DecisionPath.empty());
    } else {
      const prevSteps = current.steps.slice(0, -1);
      writePath(DecisionPath.fromSteps(prevSteps));
    }
  }, []);

  const reset = useCallback(() => {
    writePath(DecisionPath.empty());
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
