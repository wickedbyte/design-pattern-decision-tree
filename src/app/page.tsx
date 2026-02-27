import Link from "next/link";
import { getAllPatterns, getPatternsByCategory } from "@/_lib/data/patterns";
import { getAllCategories } from "@/_lib/domain/PatternCategory";
import { Container } from "@/_components/ui/Container";
import { Icon } from "@/_components/ui/Icon";
import { DecisionTreeContainer } from "@/_components/tree/DecisionTreeContainer";

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
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary to-bg-primary" />
        <Container className="relative text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Find the Right{" "}
            <span className="text-accent-blue">Design Pattern</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-3xl text-text-secondary">
            Start with the <i>problem</i>, not the patterns
          </p>
        </Container>
      </section>

      {/* Decision Tree */}
      <section id="decision-tree" className="bg-bg-inset py-16">
        <Container>
          <h2 className="mb-2 text-center text-2xl font-bold text-text-primary sm:text-3xl">
            Interactive Decision Tree
          </h2>
          <p className="mb-8 text-center text-sm text-text-muted">
            Click a node to trace a path. Pattern nodes link to full documentation.
          </p>
          <DecisionTreeContainer />
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
                  <Icon
                    name={cat.icon}
                    className={`h-7 w-7 ${iconColor}`}
                  />
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
        </Container>
      </section>
    </>
  );
}
