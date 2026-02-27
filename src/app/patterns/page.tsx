import type { Metadata } from "next";
import { getAllPatterns } from "@/_lib/data/patterns";
import { getAllCategories } from "@/_lib/domain/PatternCategory";
import { PatternCard } from "@/_components/patterns/PatternCard";
import { Container } from "@/_components/ui/Container";

export const metadata: Metadata = {
  title: "Pattern Catalog",
  description:
    "Browse all 17 design patterns across Creational, Structural, and Behavioral categories.",
};

export default function PatternsPage() {
  const patterns = getAllPatterns();
  const categories = getAllCategories();

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
        Pattern Catalog
      </h1>
      <p className="mt-3 text-lg text-text-secondary">
        Browse all {patterns.length} design patterns across {categories.length}{" "}
        categories.
      </p>

      {categories.map((cat) => {
        const catPatterns = patterns.filter((p) => p.category === cat.id);
        return (
          <section key={cat.id} className="mt-10">
            <h2 className="text-2xl font-bold text-text-primary">
              {cat.emoji} {cat.name}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {cat.description}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
