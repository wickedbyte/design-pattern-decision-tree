"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllPatterns } from "@/_lib/data/patterns";
import { getAllCategories } from "@/_lib/domain/PatternCategory";

interface CompareSelectorProps {
  slugA: string;
  slugB: string;
}

export function CompareSelector({ slugA, slugB }: CompareSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patterns = getAllPatterns();
  const categories = getAllCategories();

  const updateParam = useCallback(
    (key: "a" | "b", value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`/patterns/compare?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSwap = useCallback(() => {
    const params = new URLSearchParams();
    if (slugB) params.set("a", slugB);
    if (slugA) params.set("b", slugA);
    router.replace(`/patterns/compare?${params.toString()}`);
  }, [router, slugA, slugB]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <PatternSelect
        label="Pattern A"
        value={slugA}
        onChange={(v) => updateParam("a", v)}
        patterns={patterns}
        categories={categories}
        excludeSlug={slugB}
      />
      <button
        onClick={handleSwap}
        disabled={!slugA && !slugB}
        className="shrink-0 rounded-lg border border-border-primary bg-bg-elevated px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Swap patterns"
      >
        Swap
      </button>
      <PatternSelect
        label="Pattern B"
        value={slugB}
        onChange={(v) => updateParam("b", v)}
        patterns={patterns}
        categories={categories}
        excludeSlug={slugA}
      />
    </div>
  );
}

function PatternSelect({
  label,
  value,
  onChange,
  patterns,
  categories,
  excludeSlug,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  patterns: ReturnType<typeof getAllPatterns>;
  categories: ReturnType<typeof getAllCategories>;
  excludeSlug: string;
}) {
  return (
    <div className="flex-1">
      <label className="mb-1 block text-sm font-medium text-text-muted">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border-primary bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
      >
        <option value="">Select a pattern...</option>
        {categories.map((cat) => {
          const catPatterns = patterns.filter(
            (p) => p.category === cat.id && (p.slug as string) !== excludeSlug
          );
          if (catPatterns.length === 0) return null;
          return (
            <optgroup key={cat.id as string} label={cat.name}>
              {catPatterns.map((p) => (
                <option key={p.slug as string} value={p.slug as string}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </div>
  );
}
