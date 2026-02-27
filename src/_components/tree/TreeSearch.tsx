"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DECISION_NODES } from "@/_lib/data/decision-tree";

interface TreeSearchProps {
  onSearchResults: (matchingNodeIds: Set<string>) => void;
}

export function TreeSearch({ onSearchResults }: TreeSearchProps) {
  const [query, setQuery] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        onSearchResults(new Set());
        setMatchCount(0);
        return;
      }

      const lower = searchQuery.toLowerCase().trim();
      const matches = new Set<string>();

      for (const node of DECISION_NODES) {
        if (
          node.label.toLowerCase().includes(lower) ||
          node.description?.toLowerCase().includes(lower)
        ) {
          matches.add(node.id);
        }
      }

      onSearchResults(matches);
      setMatchCount(matches.size);
    },
    [onSearchResults]
  );

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(query), 200);
    return () => clearTimeout(debounceRef.current);
  }, [query, performSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setQuery("");
      onSearchResults(new Set());
      setMatchCount(0);
      inputRef.current?.blur();
    }
  };

  return (
    <div
      role="search"
      className="absolute top-3 left-3 z-10 flex items-center gap-2"
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search nodes..."
          aria-label="Search decision tree nodes"
          className="w-56 rounded-lg border border-border-primary bg-bg-surface px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted shadow-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              onSearchResults(new Set());
              setMatchCount(0);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            aria-label="Clear search"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        )}
      </div>
      {query.trim() && (
        <span
          className="rounded-md bg-bg-elevated px-2 py-1 text-xs text-text-muted"
          aria-live="polite"
        >
          {matchCount} {matchCount === 1 ? "match" : "matches"}
        </span>
      )}
    </div>
  );
}
