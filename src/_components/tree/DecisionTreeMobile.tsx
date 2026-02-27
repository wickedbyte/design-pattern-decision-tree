"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useDecisionPath } from "./hooks/useDecisionPath";
import { DECISION_NODES, DECISION_EDGES } from "@/_lib/data/decision-tree";
import type { DecisionNode } from "@/_lib/domain/DecisionNode";

function getChildren(nodeId: string): { node: DecisionNode; edgeLabel?: string }[] {
  return DECISION_EDGES.filter((e) => e.source === nodeId).map((e) => ({
    node: DECISION_NODES.find((n) => n.id === e.target)!,
    edgeLabel: e.label,
  }));
}

const CATEGORY_COLORS: Record<string, string> = {
  creational: "border-creational-border bg-creational-bg",
  structural: "border-structural-border bg-structural-bg",
  behavioral: "border-behavioral-border bg-behavioral-bg",
};

export function DecisionTreeMobile() {
  const { path, selectNode, goBack, reset } = useDecisionPath();

  const currentNodeId = path.currentNodeId ?? "start";
  const currentNode = useMemo(
    () => DECISION_NODES.find((n) => n.id === currentNodeId)!,
    [currentNodeId]
  );
  const children = useMemo(() => getChildren(currentNodeId), [currentNodeId]);

  return (
    <div className="w-full">
      {/* Progress */}
      {path.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm text-text-muted">
          <span>Step {path.length}</span>
          <span aria-hidden="true">·</span>
          <button
            onClick={reset}
            className="text-accent-blue hover:underline"
          >
            Start over
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentNodeId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Current question / result */}
          <div className="rounded-xl border border-border-primary bg-bg-surface p-6 shadow-sm">
            {currentNode.kind === "start" && (
              <h2 className="text-xl font-bold text-text-primary">
                {currentNode.label}
              </h2>
            )}

            {currentNode.kind === "category" && (
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  {currentNode.label}
                </h2>
                {currentNode.description && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {currentNode.description}
                  </p>
                )}
              </div>
            )}

            {currentNode.kind === "question" && (
              <h2 className="text-lg font-bold text-text-primary">
                {currentNode.label}
              </h2>
            )}

            {currentNode.kind === "pattern" && (
              <div className="text-center">
                <h2 className="text-xl font-bold text-accent-blue">
                  {currentNode.label}
                </h2>
                <Link
                  href={`/patterns/${currentNode.patternSlug}`}
                  className="mt-4 inline-block rounded-lg bg-accent-blue px-6 py-2 text-sm font-medium text-text-inverse transition-colors hover:opacity-90"
                >
                  View Full Details
                </Link>
              </div>
            )}

            {currentNode.kind === "fallback" && (
              <div className="text-center">
                <h2 className="text-lg font-bold text-text-primary">
                  {currentNode.label}
                </h2>
                {currentNode.description && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {currentNode.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Options */}
          {children.length > 0 && (
            <div className="mt-4 space-y-3">
              {children.map(({ node, edgeLabel }) => (
                <button
                  key={node.id}
                  onClick={() =>
                    selectNode(node.id, edgeLabel as "Yes" | "No" | undefined)
                  }
                  className={`w-full rounded-xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${
                    node.kind === "category"
                      ? CATEGORY_COLORS[node.categoryId as string] ?? "border-border-primary bg-bg-elevated"
                      : "border-border-primary bg-bg-elevated hover:border-border-accent"
                  }`}
                  aria-label={edgeLabel ? `${edgeLabel}: ${node.label}` : node.label}
                >
                  {edgeLabel && (
                    <span
                      className={`inline-block mb-1 rounded px-2 py-0.5 text-xs font-bold ${
                        edgeLabel === "Yes"
                          ? "bg-accent-green/15 text-accent-green"
                          : "bg-accent-rose/15 text-accent-rose"
                      }`}
                    >
                      {edgeLabel}
                    </span>
                  )}
                  <div className="font-medium text-text-primary">
                    {node.label}
                  </div>
                  {node.description && (
                    <div className="mt-0.5 text-sm text-text-secondary">
                      {node.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Back button */}
          {path.length > 0 && currentNode.kind !== "pattern" && (
            <button
              onClick={goBack}
              className="mt-4 text-sm text-text-muted hover:text-text-secondary transition-colors"
            >
              &larr; Back
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
