import Link from "next/link";
import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { Badge } from "@/_components/ui/Badge";
import { getCategoryInfo } from "@/_lib/domain/PatternCategory";

interface PatternCardProps {
  pattern: PatternDefinition;
}

export function PatternCard({ pattern }: PatternCardProps) {
  const category = getCategoryInfo(pattern.category);

  return (
    <Link
      href={`/patterns/${pattern.slug}`}
      className="group block rounded-xl border border-white/10 bg-bg-surface/60 p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl" aria-hidden="true">
          {pattern.emoji}
        </span>
        <Badge category={pattern.category}>{category.name}</Badge>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
        {pattern.name}
      </h3>
      <p className="mt-1 text-sm text-text-secondary line-clamp-2">
        {pattern.summary}
      </p>
    </Link>
  );
}
