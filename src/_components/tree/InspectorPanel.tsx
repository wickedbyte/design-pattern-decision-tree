"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DECISION_NODES, DECISION_EDGES } from "@/_lib/data/decision-tree";
import type { DecisionNode } from "@/_lib/domain/DecisionNode";
import { Icon } from "@/_components/ui/Icon";

interface InspectorPanelProps {
  nodeId: string | null;
  onClose: () => void;
}

export function InspectorPanel({ nodeId, onClose }: InspectorPanelProps) {
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  const node = nodeId
    ? (DECISION_NODES.find((n) => n.id === nodeId) ?? null)
    : null;

  useEffect(() => {
    if (!node) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [node, onClose]);

  const animationProps = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { x: 380, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 380, opacity: 0 },
        transition: { type: "spring" as const, damping: 25, stiffness: 300 },
      };

  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          ref={panelRef}
          role="complementary"
          aria-label="Node details"
          tabIndex={-1}
          className="w-[380px] shrink-0 overflow-y-auto border-l border-border-primary bg-bg-surface p-5 outline-none"
          {...animationProps}
        >
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold text-text-primary">
              {node.label}
            </h2>
            <button
              onClick={onClose}
              className="shrink-0 rounded-md p-1 text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-colors"
              aria-label="Close inspector"
            >
              <Icon name="xmark" className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-1">
            <span className="inline-block rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs font-medium capitalize text-text-muted">
              {node.kind}
            </span>
          </div>

          {node.description && (
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              {node.description}
            </p>
          )}

          <div className="mt-5">
            <NodeDetails node={node} />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function NodeDetails({ node }: { node: DecisionNode }) {
  switch (node.kind) {
    case "question":
      return <QuestionDetails nodeId={node.id} />;
    case "pattern":
      return <PatternDetails node={node} />;
    case "category":
      return <CategoryDetails nodeId={node.id} />;
    default:
      return null;
  }
}

function QuestionDetails({ nodeId }: { nodeId: string }) {
  const outEdges = DECISION_EDGES.filter((e) => e.source === nodeId);
  if (outEdges.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Answers
      </h3>
      <ul className="mt-2 space-y-2">
        {outEdges.map((edge) => {
          const targetNode = DECISION_NODES.find((n) => n.id === edge.target);
          return (
            <li
              key={edge.id}
              className="flex items-start gap-2 rounded-md border border-border-primary bg-bg-elevated p-3"
            >
              {edge.label && (
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-bold ${
                    edge.label === "Yes"
                      ? "bg-accent-green/15 text-accent-green"
                      : "bg-accent-rose/15 text-accent-rose"
                  }`}
                >
                  {edge.label}
                </span>
              )}
              <span className="text-sm text-text-secondary">
                {targetNode?.label ?? edge.target}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PatternDetails({ node }: { node: DecisionNode }) {
  return (
    <div className="space-y-4">
      {node.patternSlug && (
        <Link
          href={`/patterns/${node.patternSlug}`}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-blue px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:opacity-90"
        >
          View Full Details
          <Icon name="arrow-right" className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function CategoryDetails({ nodeId }: { nodeId: string }) {
  const childEdges = DECISION_EDGES.filter((e) => e.source === nodeId);
  const childNodes = childEdges
    .map((e) => DECISION_NODES.find((n) => n.id === e.target))
    .filter((n): n is DecisionNode => n != null);

  if (childNodes.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Questions in this category
      </h3>
      <ul className="mt-2 space-y-1.5">
        {childNodes.map((child) => (
          <li
            key={child.id}
            className="flex items-center gap-2 text-sm text-text-secondary"
          >
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-purple" />
            {child.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
