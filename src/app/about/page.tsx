import type { Metadata } from "next";
import { Container } from "@/_components/ui/Container";

export const metadata: Metadata = {
  title: "About",
  description:
    "About the Design Pattern Decision Tree — methodology, attribution, and credits.",
};

export default function AboutPage() {
  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
        About
      </h1>

      <div className="mt-8 space-y-8">
        <section className="rounded-lg border-l-4 border-l-accent-blue border-y border-r border-y-border-primary border-r-border-primary bg-bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            Methodology
          </h2>
          <p className="mt-3 text-text-secondary leading-relaxed">
            Design patterns don&apos;t fail because they&apos;re wrong &mdash;
            they fail because developers reach for them at the wrong moment.
            Instead of memorizing all 23 Gang of Four patterns, this tool uses a{" "}
            <strong className="text-text-primary">
              pain-point-first decision tree
            </strong>
            : describe the friction you&apos;re trying to remove, then follow
            targeted questions to find the right pattern.
          </p>
        </section>

        <section className="rounded-lg border-l-4 border-l-accent-purple border-y border-r border-y-border-primary border-r-border-primary bg-bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            Attribution
          </h2>
          <p className="mt-3 text-text-secondary leading-relaxed">
            This project is inspired by{" "}
            <a
              href="https://medium.com/womenintechnology/stop-memorizing-design-patterns-use-this-decision-tree-instead-e84f22fca9fa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              &ldquo;Stop Memorizing Design Patterns: Use This Decision Tree
              Instead&rdquo;
            </a>{" "}
            by <strong className="text-text-primary">Alina Kovtun</strong>,
            published on Medium&apos;s Women in Technology publication. The
            article proposes a decision tree covering 17 of the original Gang of
            Four design patterns across three categories: Creational,
            Structural, and Behavioral.
          </p>
        </section>

        <section className="rounded-lg border-l-4 border-l-accent-green border-y border-r border-y-border-primary border-r-border-primary bg-bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            What This Site Adds
          </h2>
          <ul className="mt-3 space-y-2 text-text-secondary">
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" />
              <span>
                Interactive decision tree with desktop flowchart and mobile
                wizard views
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" />
              <span>
                Complete pattern documentation with intent, problem, solution,
                and real-world analogies
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" />
              <span>
                Code examples in four languages: TypeScript, Python, PHP, and
                Rust
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" />
              <span>
                Language-specific notes where patterns are anti-patterns or
                require idiomatic alternatives
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" />
              <span>
                Architecture designed to easily add new patterns beyond the
                original 17
              </span>
            </li>
          </ul>
        </section>
      </div>
    </Container>
  );
}
