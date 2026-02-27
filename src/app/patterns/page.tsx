import type { Metadata } from "next";
import { getAllPatterns } from "@/_lib/data/patterns";
import { getAllCategories } from "@/_lib/domain/PatternCategory";
import { PatternCard } from "@/_components/patterns/PatternCard";
import { Icon } from "@/_components/ui/Icon";
import { Container } from "@/_components/ui/Container";

const ICON_COLORS: Record<string, string> = {
  creational: "text-creational",
  structural: "text-structural",
  behavioral: "text-behavioral",
};


export const metadata: Metadata = {
  title: "Design Pattern Catalog",
  description:
    "Browse all 17 design patterns across Creational, Structural, and Behavioral categories.",
};

export default function PatternsPage() {
  const patterns = getAllPatterns();
  const categories = getAllCategories();

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
        Design Pattern Catalog
      </h1>

      {categories.map((cat) => {
        const catPatterns = patterns.filter((p) => p.category === cat.id);
        const iconColor = ICON_COLORS[cat.id as string] ?? "text-text-muted";
        return (
          <section key={cat.id} className="mt-12">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-text-primary">
              <Icon name={cat.icon} className={`h-5 w-5 ${iconColor}`} />
              {cat.name}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {cat.description}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catPatterns.map((p) => (
                <PatternCard key={p.slug} pattern={p} />
              ))}
            </div>
          </section>
        );
      })}
    </Container>
  );
}
