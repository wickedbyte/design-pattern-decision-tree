"use client";

import { useState, useId } from "react";

interface TabsProps {
  tabs: readonly { readonly label: string; readonly id: string }[];
  children: (activeId: string) => React.ReactNode;
  defaultTab?: string;
  className?: string;
}

export function Tabs({
  tabs,
  children,
  defaultTab,
  className = "",
}: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id ?? "");
  const groupId = useId();

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Content tabs"
        className="flex gap-1 border-b border-border-primary"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`${groupId}-tab-${tab.id}`}
            role="tab"
            aria-selected={activeId === tab.id}
            aria-controls={`${groupId}-panel-${tab.id}`}
            tabIndex={activeId === tab.id ? 0 : -1}
            onClick={() => setActiveId(tab.id)}
            onKeyDown={(e) => {
              const currentIndex = tabs.findIndex((t) => t.id === activeId);
              if (e.key === "ArrowRight") {
                e.preventDefault();
                const next = tabs[(currentIndex + 1) % tabs.length];
                setActiveId(next.id);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                const prev =
                  tabs[(currentIndex - 1 + tabs.length) % tabs.length];
                setActiveId(prev.id);
              }
            }}
            className={`relative rounded-t-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue ${
              activeId === tab.id
                ? "bg-bg-surface text-text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent-blue"
                : "text-text-muted hover:text-text-secondary hover:bg-bg-inset"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id={`${groupId}-panel-${activeId}`}
        role="tabpanel"
        aria-labelledby={`${groupId}-tab-${activeId}`}
        tabIndex={0}
      >
        {children(activeId)}
      </div>
    </div>
  );
}
