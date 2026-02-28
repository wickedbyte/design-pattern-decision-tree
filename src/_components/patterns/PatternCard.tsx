import Link from "next/link";
import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { Badge } from "@/_components/ui/Badge";
import { Icon } from "@/_components/ui/Icon";
import { getCategoryInfo } from "@/_lib/domain/PatternCategory";

const CATEGORY_ACCENT: Record<string, string> = {
  creational: "border-l-4 border-l-creational hover:shadow-md",
  structural: "border-l-4 border-l-structural hover:shadow-md",
  behavioral: "border-l-4 border-l-behavioral hover:shadow-md",
};

interface PatternCardProps {
  pattern: PatternDefinition;
}

export function PatternCard({ pattern }: PatternCardProps) {
  const category = getCategoryInfo(pattern.category);
  const accent = CATEGORY_ACCENT[pattern.category as string] ?? "";

  return (
    <div
      className={`group relative rounded-xl border-y border-r border-border-primary bg-bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 ${accent}`}
    >
      <Link
        href={`/patterns/${pattern.slug}`}
        prefetch={false}
        className="block"
      >
        <div className="flex items-start justify-between gap-2">
          <Icon name={pattern.icon} className="h-5 w-5 text-text-muted" />
          <Badge category={pattern.category}>{category.name}</Badge>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
          {pattern.name}
        </h3>
        <p className="mt-1 text-sm text-text-secondary line-clamp-2">
          {pattern.summary}
        </p>
      </Link>
      <Link
        href={`/patterns/compare?a=${pattern.slug}`}
        prefetch={false}
        className="absolute top-3 right-3 rounded-md p-1.5 text-text-muted opacity-0 transition-all hover:bg-bg-elevated hover:text-accent-blue group-hover:opacity-100"
        aria-label={`Compare ${pattern.name}`}
        title="Compare"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M5 2v12M11 2v12M1 5h4M11 5h4M1 8h4M11 8h4M1 11h4M11 11h4" />
        </svg>
      </Link>
    </div>
  );
}
