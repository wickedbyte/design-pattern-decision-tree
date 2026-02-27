import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/_components/ui/Container";
import { DecisionTreeGraphWrapper } from "@/_components/tree/DecisionTreeGraphWrapper";

export const metadata: Metadata = {
  title: "Decision Tree Graph",
  description:
    "Explore the full design pattern decision tree as an interactive graph.",
};

export default function TreePage() {
  return (
    <Container className="py-8">
      <div className="mb-2">
        <Link
          href="/"
          className="text-sm text-text-muted hover:text-accent-blue transition-colors"
        >
          &larr; Back to wizard
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
        Decision Tree Graph
      </h1>
      <p className="mt-2 text-text-secondary">
        The full decision tree in one view. Click any node to inspect it, or use
        search to find specific patterns.
      </p>

      <div className="mt-6">
        <DecisionTreeGraphWrapper />
      </div>
    </Container>
  );
}
