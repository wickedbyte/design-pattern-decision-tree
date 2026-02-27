"use client";

import type { DecisionPath } from "@/_lib/domain/DecisionPath";
import { DECISION_NODES } from "@/_lib/data/decision-tree";

interface WizardBreadcrumbProps {
  path: DecisionPath;
  onNavigate: (nodeId: string) => void;
  onReset: () => void;
}

export function WizardBreadcrumb({
  path,
  onNavigate,
  onReset,
}: WizardBreadcrumbProps) {
  if (path.isEmpty) return null;

  return (
    <nav aria-label="Decision path" className="mb-4">
      <ol className="flex items-center gap-1 overflow-x-auto text-sm scrollbar-thin">
        <li className="shrink-0">
          <button
            onClick={onReset}
            className="rounded px-2 py-1 text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-colors"
          >
            Start
          </button>
        </li>
        {path.steps.map((step, index) => {
          const node = DECISION_NODES.find((n) => n.id === step.nodeId);
          const isLast = index === path.steps.length - 1;
          const label = node?.label ?? step.nodeId;
          // Shorten labels for breadcrumb display
          const shortLabel =
            label.length > 30 ? label.slice(0, 28) + "\u2026" : label;

          return (
            <li key={step.nodeId} className="flex shrink-0 items-center gap-1">
              <span className="text-text-muted" aria-hidden="true">
                /
              </span>
              {isLast ? (
                <span
                  className="rounded px-2 py-1 font-medium text-accent-blue bg-accent-blue/10"
                  aria-current="step"
                >
                  {shortLabel}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate(step.nodeId)}
                  className="rounded px-2 py-1 text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-colors"
                >
                  {shortLabel}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
