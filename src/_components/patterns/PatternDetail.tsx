import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { getCategoryInfo } from "@/_lib/domain/PatternCategory";
import { Badge } from "@/_components/ui/Badge";
import { Breadcrumb } from "@/_components/ui/Breadcrumb";
import { Container } from "@/_components/ui/Container";
import { PatternMeta } from "./PatternMeta";
import { CodeExampleTabs } from "./CodeExampleTabs";
import { RelatedPatterns } from "./RelatedPatterns";

interface PatternDetailProps {
  pattern: PatternDefinition;
}

export function PatternDetail({ pattern }: PatternDetailProps) {
  const category = getCategoryInfo(pattern.category);

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Patterns", href: "/patterns" },
          { label: category.name, href: `/patterns?category=${pattern.category}` },
          { label: pattern.name },
        ]}
      />

      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl" aria-hidden="true">
            {pattern.emoji}
          </span>
          <Badge category={pattern.category}>{category.name}</Badge>
        </div>
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          {pattern.name}
        </h1>
        <p className="mt-3 text-lg text-text-secondary">{pattern.summary}</p>
      </div>

      {/* Documentation */}
      <PatternMeta pattern={pattern} />

      {/* Code Examples */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Code Examples
        </h2>
        <CodeExampleTabs
          examples={pattern.codeExamples}
          antiPatternNotices={pattern.antiPatternNotices}
        />
      </div>

      {/* Related */}
      <div className="mt-10">
        <RelatedPatterns slugs={pattern.relatedPatterns} />
      </div>
    </Container>
  );
}
