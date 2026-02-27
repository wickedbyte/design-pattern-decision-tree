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

      <div className="mt-8 max-w-3xl space-y-8">
        <section>
          <h2 className="text-xl font-bold text-text-primary">
            The Pain-Point-First Approach
          </h2>
          <p className="mt-3 text-text-secondary leading-relaxed">
            Design patterns don&apos;t fail because they&apos;re wrong &mdash; they fail
            because developers reach for them at the wrong moment. Instead of
            memorizing all 23 Gang of Four patterns, this tool uses a{" "}
            <strong className="text-text-primary">
              pain-point-first decision tree
            </strong>
            : describe the friction you&apos;re trying to remove, then follow
            targeted questions to find the right pattern.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-text-primary">Attribution</h2>
          <p className="mt-3 text-text-secondary leading-relaxed">
            This project is inspired by{" "}
            <a
              href="https://medium.com/womenintechnology/stop-memorizing-design-patterns-use-this-decision-tree-instead-e84f22fca9fa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue underline underline-offset-2 hover:text-accent-blue/80 transition-colors"
            >
              &ldquo;Stop Memorizing Design Patterns: Use This Decision Tree
              Instead&rdquo;
            </a>{" "}
            by <strong className="text-text-primary">Alina Kovtun</strong>,
            published on Medium&apos;s Women in Technology publication. The article
            proposes a decision tree covering 17 of the original Gang of Four
            design patterns across three categories: Creational, Structural, and
            Behavioral.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-text-primary">
            What This Site Adds
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-text-secondary">
            <li>
              Interactive decision tree with desktop flowchart and mobile wizard
              views
            </li>
            <li>
              Complete pattern documentation with intent, problem, solution, and
              real-world analogies
            </li>
            <li>
              Code examples in four languages: TypeScript, Python, PHP, and Rust
            </li>
            <li>
              Language-specific notes where patterns are anti-patterns or require
              idiomatic alternatives
            </li>
            <li>
              Architecture designed to easily add new patterns beyond the
              original 17
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-text-primary">Technology</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-text-secondary">
            <li>Built with Next.js (static export) and TypeScript</li>
            <li>Interactive tree powered by React Flow and dagre layout</li>
            <li>Syntax highlighting with Shiki</li>
            <li>Styled with Tailwind CSS v4</li>
            <li>Animations with Motion (with reduced-motion support)</li>
          </ul>
        </section>
      </div>
    </Container>
  );
}
