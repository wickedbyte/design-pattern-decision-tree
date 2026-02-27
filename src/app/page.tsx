import Link from "next/link";
import { getAllPatterns, getPatternsByCategory } from "@/_lib/data/patterns";
import { getAllCategories } from "@/_lib/domain/PatternCategory";
import { Container } from "@/_components/ui/Container";
import { Icon } from "@/_components/ui/Icon";
import { DecisionWizardWrapper } from "@/_components/tree/DecisionWizardWrapper";

const CATEGORY_STYLES: Record<string, string> = {
  creational:
    "border-t-4 border-t-creational border-x border-b border-x-border-primary border-b-border-primary hover:shadow-md",
  structural:
    "border-t-4 border-t-structural border-x border-b border-x-border-primary border-b-border-primary hover:shadow-md",
  behavioral:
    "border-t-4 border-t-behavioral border-x border-b border-x-border-primary border-b-border-primary hover:shadow-md",
};

const CATEGORY_ICON_COLORS: Record<string, string> = {
  creational: "text-creational",
  structural: "text-structural",
  behavioral: "text-behavioral",
};

export default function Home() {
  const patterns = getAllPatterns();
  const categories = getAllCategories();

  return (
    <>
      {/* Hero + Wizard */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary to-bg-primary" />
        <Container className="relative">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Find the Right{" "}
              <span className="text-accent-blue">Design Pattern</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
              Answer questions about your problem to discover the right pattern
            </p>
          </div>

          {/* Wizard */}
          <div id="decision-tree" className="mt-10">
            <DecisionWizardWrapper />
          </div>
        </Container>
      </section>

      {/* Categories Overview */}
      <section className="py-16">
        <Container>
          <h2 className="mb-8 text-center text-2xl font-bold text-text-primary sm:text-3xl">
            {patterns.length} Patterns Across {categories.length} Categories
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {categories.map((cat) => {
              const count = getPatternsByCategory(cat.id).length;
              const styles = CATEGORY_STYLES[cat.id as string] ?? "";
              const iconColor = CATEGORY_ICON_COLORS[cat.id as string] ?? "";
              return (
                <Link
                  key={cat.id}
                  href="/patterns"
                  className={`group rounded-xl bg-bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 ${styles}`}
                >
                  <Icon name={cat.icon} className={`h-7 w-7 ${iconColor}`} />
                  <h3 className="mt-3 text-lg font-bold text-text-primary">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {cat.description}
                  </p>
                  <p className="mt-3 text-sm font-medium text-text-muted">
                    {count} patterns
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Link to full tree */}
          <div className="mt-10 text-center">
            <Link
              href="/tree"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-blue transition-colors"
            >
              <Icon name="sitemap" className="h-4 w-4" />
              View the full decision tree graph
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
