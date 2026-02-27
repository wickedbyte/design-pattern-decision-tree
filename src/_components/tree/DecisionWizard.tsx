"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useDecisionPath } from "./hooks/useDecisionPath";
import { DECISION_NODES, DECISION_EDGES } from "@/_lib/data/decision-tree";
import { getPatternBySlug } from "@/_lib/data/patterns";
import { getCategoryInfo } from "@/_lib/domain/PatternCategory";
import type { DecisionNode } from "@/_lib/domain/DecisionNode";
import type { PatternCategoryId } from "@/_lib/domain/PatternCategory";
import { Badge } from "@/_components/ui/Badge";
import { Icon } from "@/_components/ui/Icon";

function getChildren(
  nodeId: string
): { node: DecisionNode; edgeLabel?: string }[] {
  return DECISION_EDGES.filter((e) => e.source === nodeId).map((e) => ({
    node: DECISION_NODES.find((n) => n.id === e.target)!,
    edgeLabel: e.label,
  }));
}

/** Given a question node, find the category it belongs to by walking edges backward. */
function getCategoryForQuestion(nodeId: string): DecisionNode | null {
  // Walk up from the question through parent edges until we find a category
  let current = nodeId;
  for (let i = 0; i < 20; i++) {
    const parentEdge = DECISION_EDGES.find((e) => e.target === current);
    if (!parentEdge) return null;
    const parentNode = DECISION_NODES.find((n) => n.id === parentEdge.source);
    if (!parentNode) return null;
    if (parentNode.kind === "category") return parentNode;
    current = parentNode.id;
  }
  return null;
}

const CATEGORY_ACCENT: Record<string, string> = {
  creational: "border-creational/30 bg-creational/5 hover:border-creational/60",
  structural: "border-structural/30 bg-structural/5 hover:border-structural/60",
  behavioral: "border-behavioral/30 bg-behavioral/5 hover:border-behavioral/60",
};

const CATEGORY_ICON_COLOR: Record<string, string> = {
  creational: "text-creational",
  structural: "text-structural",
  behavioral: "text-behavioral",
};

const CATEGORY_BAR: Record<string, string> = {
  creational: "bg-creational",
  structural: "bg-structural",
  behavioral: "bg-behavioral",
};

export function DecisionWizard() {
  const { path, selectNode, goBack, reset, navigateTo } = useDecisionPath();
  const prefersReducedMotion = useReducedMotion();

  const currentNodeId = path.currentNodeId ?? "start";
  const currentNode = useMemo(
    () => DECISION_NODES.find((n) => n.id === currentNodeId)!,
    [currentNodeId]
  );
  const children = useMemo(() => getChildren(currentNodeId), [currentNodeId]);

  // Find which category we're in (for question nodes)
  const activeCategory = useMemo(() => {
    if (currentNode.kind !== "question") return null;
    return getCategoryForQuestion(currentNode.id);
  }, [currentNode]);

  // Resolve pattern data for result display
  const pattern = useMemo(() => {
    if (currentNode.kind !== "pattern" || !currentNode.patternSlug) return null;
    return getPatternBySlug(currentNode.patternSlug) ?? null;
  }, [currentNode]);

  // Build step labels for the progress trail (skip category nodes)
  const stepLabels = useMemo(() => {
    return path.steps
      .map((s) => {
        const n = DECISION_NODES.find((node) => node.id === s.nodeId);
        if (!n) return null;
        if (
          n.kind === "start" ||
          n.kind === "pattern" ||
          n.kind === "fallback" ||
          n.kind === "category"
        )
          return null;
        return { id: n.id, label: n.label, answer: s.answer };
      })
      .filter(Boolean) as { id: string; label: string; answer?: string }[];
  }, [path.steps]);

  // When clicking a category from start, skip to its first question
  const handleCategoryClick = (categoryNode: DecisionNode) => {
    const firstChild = getChildren(categoryNode.id);
    if (firstChild.length === 1) {
      // Add both category and its first question in sequence
      selectNode(categoryNode.id);
      selectNode(firstChild[0].node.id);
    } else {
      selectNode(categoryNode.id);
    }
  };

  const animateProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 0.25, ease: "easeOut" as const },
      };

  // ---- RESULT SCREEN ----
  if (currentNode.kind === "pattern" && pattern) {
    const category = getCategoryInfo(pattern.category);
    return (
      <div className="mx-auto w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div key="result" {...animateProps}>
            <div className="overflow-hidden rounded-2xl border border-border-primary bg-bg-surface shadow-lg">
              <div className="h-1.5 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan" />

              <div className="p-8 text-center">
                <p className="text-sm font-medium uppercase tracking-wider text-text-muted">
                  We recommend
                </p>
                <h2 className="mt-3 text-3xl font-extrabold text-text-primary sm:text-4xl">
                  {pattern.name}
                </h2>
                <div className="mt-3 flex justify-center">
                  <Badge category={pattern.category}>{category.name}</Badge>
                </div>
                <p className="mx-auto mt-5 max-w-md text-text-secondary leading-relaxed">
                  {pattern.summary}
                </p>

                <div className="mx-auto mt-8 grid max-w-md gap-3 text-left sm:grid-cols-2">
                  <div className="rounded-lg border border-accent-green/20 bg-accent-green/5 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-green">
                      Key Advantage
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {pattern.consequences.advantages[0]}
                    </p>
                  </div>
                  <div className="rounded-lg border border-accent-rose/20 bg-accent-rose/5 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-rose">
                      Watch Out For
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {pattern.consequences.disadvantages[0]}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href={`/patterns/${pattern.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent-blue px-6 py-2.5 text-sm font-semibold text-text-inverse shadow-sm transition-all hover:shadow-md hover:brightness-110"
                  >
                    View Full Details
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </Link>
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </div>

            {stepLabels.length > 0 && (
              <div className="mt-6 rounded-xl border border-border-primary bg-bg-surface/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  Your path
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {stepLabels.map((step) => (
                    <span
                      key={step.id}
                      className="inline-flex items-center gap-1 rounded-full bg-bg-elevated px-2.5 py-1 text-xs text-text-secondary"
                    >
                      {step.label.length > 35
                        ? step.label.slice(0, 33) + "\u2026"
                        : step.label}
                      {step.answer && (
                        <span
                          className={`font-bold ${step.answer === "Yes" ? "text-accent-green" : "text-accent-rose"}`}
                        >
                          {step.answer}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ---- FALLBACK SCREEN ----
  if (currentNode.kind === "fallback") {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div key="fallback" {...animateProps}>
            <div className="overflow-hidden rounded-2xl border border-border-primary bg-bg-surface shadow-lg">
              <div className="h-1.5 bg-gradient-to-r from-accent-amber to-accent-rose" />
              <div className="p-8 text-center">
                <p className="text-sm font-medium uppercase tracking-wider text-text-muted">
                  Hmm, not an obvious fit
                </p>
                <h2 className="mt-3 text-2xl font-bold text-text-primary">
                  {currentNode.label}
                </h2>
                {currentNode.description && (
                  <p className="mx-auto mt-3 max-w-md text-text-secondary">
                    {currentNode.description}
                  </p>
                )}
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <button
                    onClick={goBack}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={reset}
                    className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ---- START SCREEN ----
  if (currentNode.kind === "start") {
    const categoryChildren = children.filter((c) => c.node.kind === "category");

    return (
      <div className="mx-auto w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div key="start" {...animateProps}>
            <div className="overflow-hidden rounded-2xl border border-border-primary bg-bg-surface shadow-lg">
              <div className="h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan" />
              <div className="p-6 sm:p-8">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">
                  Let&apos;s find the right pattern
                </p>
                <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                  {currentNode.label}
                </h2>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {categoryChildren.map(({ node }) => {
                const accent =
                  CATEGORY_ACCENT[node.categoryId as string] ??
                  "border-border-primary bg-bg-elevated";
                const iconColor =
                  CATEGORY_ICON_COLOR[node.categoryId as string] ?? "";
                const catInfo = node.categoryId
                  ? getCategoryInfo(node.categoryId)
                  : null;
                return (
                  <button
                    key={node.id}
                    onClick={() => handleCategoryClick(node)}
                    className={`group w-full rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${accent}`}
                  >
                    <div className="flex items-start gap-4">
                      {catInfo && (
                        <Icon
                          name={catInfo.icon}
                          className={`h-6 w-6 shrink-0 ${iconColor}`}
                        />
                      )}
                      <div>
                        <div className="font-semibold text-text-primary">
                          {node.label}
                        </div>
                        {node.description && (
                          <div className="mt-1 text-sm text-text-secondary">
                            {node.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ---- QUESTION SCREEN (always Yes/No) ----
  const catId = activeCategory?.categoryId as string | undefined;
  const catInfo = activeCategory?.categoryId
    ? getCategoryInfo(activeCategory.categoryId)
    : null;
  const accentBar = catId ? (CATEGORY_BAR[catId] ?? "") : "";
  const questionNumber =
    stepLabels.filter((s) => s.id !== currentNode.id).length + 1;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progress trail */}
      {stepLabels.length > 0 && (
        <nav aria-label="Decision path" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs">
            <li>
              <button
                onClick={reset}
                className="rounded-full bg-bg-elevated px-2.5 py-1 text-text-muted transition-colors hover:bg-bg-surface hover:text-text-secondary"
              >
                Start
              </button>
            </li>
            {stepLabels.map((step) => (
              <li key={step.id} className="flex items-center gap-1.5">
                <svg
                  className="h-3 w-3 text-text-muted/40"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 2l4 4-4 4" />
                </svg>
                <button
                  onClick={() => navigateTo(step.id)}
                  className="rounded-full bg-bg-elevated px-2.5 py-1 text-text-muted transition-colors hover:bg-bg-surface hover:text-text-secondary"
                >
                  {step.answer && (
                    <span
                      className={`mr-1 font-bold ${step.answer === "Yes" ? "text-accent-green" : "text-accent-rose"}`}
                    >
                      {step.answer}
                    </span>
                  )}
                  {step.label.length > 30
                    ? step.label.slice(0, 28) + "\u2026"
                    : step.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={currentNodeId} {...animateProps}>
          {/* Question card with category context */}
          <div className="overflow-hidden rounded-2xl border border-border-primary bg-bg-surface shadow-lg">
            <div
              className={`h-1 ${accentBar || "bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan"}`}
            />

            <div className="p-6 sm:p-8">
              {/* Category badge */}
              {catInfo && activeCategory?.categoryId && (
                <div className="mb-3 flex items-center gap-2">
                  <Badge
                    category={activeCategory.categoryId as PatternCategoryId}
                  >
                    {catInfo.name}
                  </Badge>
                  <span className="text-xs text-text-muted">
                    Question {questionNumber}
                  </span>
                </div>
              )}

              <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                {currentNode.label}
              </h2>

              {currentNode.description && (
                <p className="mt-2 text-sm text-text-secondary">
                  {currentNode.description}
                </p>
              )}
            </div>
          </div>

          {/* Yes/No answers */}
          {children.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {children.map(({ node, edgeLabel }) => {
                if (edgeLabel === "Yes" || edgeLabel === "No") {
                  const isYes = edgeLabel === "Yes";
                  return (
                    <button
                      key={node.id}
                      onClick={() => selectNode(node.id, edgeLabel)}
                      className={`rounded-xl border p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${
                        isYes
                          ? "border-accent-green/20 bg-accent-green/5 hover:border-accent-green/40"
                          : "border-accent-rose/20 bg-accent-rose/5 hover:border-accent-rose/40"
                      }`}
                    >
                      <span
                        className={`flex mx-auto h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white ${
                          isYes ? "bg-accent-green" : "bg-accent-rose"
                        }`}
                      >
                        {isYes ? "\u2713" : "\u2717"}
                      </span>
                      <span className="mt-2 block text-lg font-semibold text-text-primary">
                        {edgeLabel}
                      </span>
                      {node.kind === "pattern" && (
                        <span className="mt-0.5 block text-xs text-text-muted">
                          {node.label}
                        </span>
                      )}
                    </button>
                  );
                }

                // Fallback for non-yes/no edges (shouldn't happen in practice)
                return (
                  <button
                    key={node.id}
                    onClick={() => selectNode(node.id)}
                    className="rounded-xl border border-border-primary bg-bg-elevated p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                  >
                    <div className="font-medium text-text-primary">
                      {node.label}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Back button */}
          {path.length > 0 && (
            <div className="mt-5">
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8 2L4 6l4 4" />
                </svg>
                Back
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
