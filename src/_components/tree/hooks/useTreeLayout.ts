"use client";

import { useMemo } from "react";
import { DECISION_NODES, DECISION_EDGES } from "@/_lib/data/decision-tree";
import { toReactFlowElements } from "@/_lib/tree/to-react-flow";

export function useTreeLayout() {
  return useMemo(() => toReactFlowElements(DECISION_NODES, DECISION_EDGES), []);
}
