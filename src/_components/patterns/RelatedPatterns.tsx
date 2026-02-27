import type { PatternSlug } from "@/_lib/domain/PatternSlug";
import { getPatternBySlug } from "@/_lib/data/patterns";
import { PatternCard } from "./PatternCard";

interface RelatedPatternsProps {
  slugs: readonly PatternSlug[];
}

export function RelatedPatterns({ slugs }: RelatedPatternsProps) {
  const patterns = slugs
    .map((slug) => getPatternBySlug(slug))
    .filter((p) => p !== undefined);

  if (patterns.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-text-primary">Related Patterns</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((p) => (
          <PatternCard key={p.slug} pattern={p} />
        ))}
      </div>
    </section>
  );
}
