"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/_components/ui/Container";
import { CompareSelector } from "@/_components/patterns/CompareSelector";
import { CompareView } from "@/_components/patterns/CompareView";
import { getPatternBySlug } from "@/_lib/data/patterns";

function CompareContent() {
  const searchParams = useSearchParams();
  const slugA = searchParams.get("a") ?? "";
  const slugB = searchParams.get("b") ?? "";

  const patternA = slugA ? getPatternBySlug(slugA) : undefined;
  const patternB = slugB ? getPatternBySlug(slugB) : undefined;

  return (
    <>
      <CompareSelector slugA={slugA} slugB={slugB} />

      {patternA && patternB ? (
        <div className="mt-8">
          <CompareView patternA={patternA} patternB={patternB} />
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-text-muted">
            {!slugA && !slugB
              ? "Select two patterns above to compare them side by side."
              : "Select both patterns to start comparing."}
          </p>
        </div>
      )}
    </>
  );
}

export default function ComparePage() {
  return (
    <Container className="py-8">
      <div className="mb-2">
        <Link
          href="/patterns"
          className="text-sm text-text-muted hover:text-accent-blue transition-colors"
        >
          &larr; Back to catalog
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
        Compare Patterns
      </h1>
      <p className="mt-2 text-text-secondary">
        Select two design patterns to compare them side by side.
      </p>

      <div className="mt-6">
        <Suspense
          fallback={
            <div className="h-24 animate-pulse rounded-xl bg-bg-elevated" />
          }
        >
          <CompareContent />
        </Suspense>
      </div>
    </Container>
  );
}
