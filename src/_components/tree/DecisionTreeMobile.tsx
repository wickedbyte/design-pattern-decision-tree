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
  creational: "border-creational bg-creational/10",
  structural: "border-structural bg-structural/10",
  behavioral: "border-behavioral bg-behavioral/10",
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
          <span aria-hidden="true">•</span>
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
          <div className="rounded-xl border border-white/10 bg-bg-surface p-6">
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
                <div className="mb-2 text-2xl">✅</div>
                <h2 className="text-xl font-bold text-accent-cyan">
                  {currentNode.label}
                </h2>
                <Link
                  href={`/patterns/${currentNode.patternSlug}`}
                  className="mt-4 inline-block rounded-lg bg-accent-blue px-6 py-2 text-sm font-medium text-white hover:bg-accent-blue/80 transition-colors"
                >
                  View Full Details
                </Link>
              </div>
            )}

            {currentNode.kind === "fallback" && (
              <div className="text-center">
                <div className="mb-2 text-2xl">🔄</div>
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
                  className={`w-full rounded-xl border p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                    node.kind === "category"
                      ? CATEGORY_COLORS[node.categoryId as string] ?? "border-white/10 bg-bg-elevated"
                      : "border-white/10 bg-bg-elevated hover:border-white/20"
                  }`}
                  aria-label={edgeLabel ? `${edgeLabel}: ${node.label}` : node.label}
                >
                  {edgeLabel && (
                    <span
                      className={`inline-block mb-1 rounded px-2 py-0.5 text-xs font-bold ${
                        edgeLabel === "Yes"
                          ? "bg-accent-green/20 text-accent-green"
                          : "bg-accent-rose/20 text-accent-rose"
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
              ← Back
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
