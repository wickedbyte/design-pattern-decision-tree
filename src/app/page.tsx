import Link from "next/link";
import { getAllPatterns } from "@/_lib/data/patterns";
import { getAllCategories } from "@/_lib/domain/PatternCategory";
import { getPatternsByCategory } from "@/_lib/data/patterns";
import { Container } from "@/_components/ui/Container";
import { DecisionTreeContainer } from "@/_components/tree/DecisionTreeContainer";

const CATEGORY_COLORS: Record<string, string> = {
  creational: "from-creational/20 to-creational/5 border-creational/30",
  structural: "from-structural/20 to-structural/5 border-structural/30",
  behavioral: "from-behavioral/20 to-behavioral/5 border-behavioral/30",
};

export default function Home() {
  const patterns = getAllPatterns();
  const categories = getAllCategories();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-rose/10 via-accent-purple/5 to-accent-blue/10" />
        <Container className="relative text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Find the Right{" "}
            <span className="bg-gradient-to-r from-accent-rose via-accent-purple to-accent-blue bg-clip-text text-transparent">
              Design Pattern
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
            Stop memorizing all 23 Gang of Four patterns. Start with your pain
            point and let the decision tree guide you to the right solution.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="#decision-tree"
              className="rounded-lg bg-accent-rose px-6 py-3 font-medium text-white shadow-lg shadow-accent-rose/25 transition-all hover:shadow-accent-rose/40 hover:scale-105"
            >
              Start the Decision Tree
            </a>
            <Link
              href="/patterns"
              className="rounded-lg border border-white/20 bg-bg-surface/60 px-6 py-3 font-medium text-text-primary backdrop-blur transition-all hover:border-white/30"
            >
              Browse Patterns
            </Link>
          </div>
        </Container>
      </section>

      {/* Decision Tree */}
      <section id="decision-tree" className="py-16">
        <Container>
          <h2 className="mb-8 text-center text-2xl font-bold text-text-primary sm:text-3xl">
            Interactive Decision Tree
          </h2>
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
              const colors = CATEGORY_COLORS[cat.id as string] ?? "";
              return (
                <Link
                  key={cat.id}
                  href="/patterns"
                  className={`group rounded-xl border bg-gradient-to-br p-6 transition-all hover:scale-[1.02] ${colors}`}
                >
                  <span className="text-3xl">{cat.emoji}</span>
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

      {/* How It Works */}
      <section className="py-16">
        <Container>
          <h2 className="mb-10 text-center text-2xl font-bold text-text-primary sm:text-3xl">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Identify Your Pain",
                description:
                  "Start by naming the friction in your code — is it about creation, structure, or behavior?",
              },
              {
                step: "2",
                title: "Answer Questions",
                description:
                  "Follow targeted Yes/No questions that narrow down to the pattern that fits your specific situation.",
              },
              {
                step: "3",
                title: "Get the Pattern",
                description:
                  "Learn the pattern with clear explanations and code examples in TypeScript, Python, PHP, and Rust.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-white/10 bg-bg-surface/60 p-6 text-center"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent-blue/20 text-lg font-bold text-accent-blue">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Attribution */}
      <section className="border-t border-white/10 py-12">
        <Container className="text-center">
          <p className="text-sm text-text-muted">
            Inspired by{" "}
            <a
              href="https://medium.com/womenintechnology/stop-memorizing-design-patterns-use-this-decision-tree-instead-e84f22fca9fa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary underline underline-offset-2 hover:text-text-primary transition-colors"
            >
              &ldquo;Stop Memorizing Design Patterns: Use This Decision Tree
              Instead&rdquo;
            </a>{" "}
            by Alina Kovtun
          </p>
        </Container>
      </section>
    </>
  );
}
