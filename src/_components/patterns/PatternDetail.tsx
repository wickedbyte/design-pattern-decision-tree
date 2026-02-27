import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { getCategoryInfo } from "@/_lib/domain/PatternCategory";
import { Badge } from "@/_components/ui/Badge";
import { Icon } from "@/_components/ui/Icon";
import { Breadcrumb } from "@/_components/ui/Breadcrumb";
import { Container } from "@/_components/ui/Container";
import { PatternMeta } from "./PatternMeta";
import { CodeExampleTabs } from "./CodeExampleTabs";
import { RelatedPatterns } from "./RelatedPatterns";

const CATEGORY_ICON_COLOR: Record<string, string> = {
  creational: "text-creational",
  structural: "text-structural",
  behavioral: "text-behavioral",
};

const CATEGORY_ACCENT: Record<string, string> = {
  creational: "bg-creational",
  structural: "bg-structural",
  behavioral: "bg-behavioral",
};

interface PatternDetailProps {
  pattern: PatternDefinition;
}

export function PatternDetail({ pattern }: PatternDetailProps) {
  const category = getCategoryInfo(pattern.category);
  const iconColor = CATEGORY_ICON_COLOR[pattern.category as string] ?? "text-text-muted";
  const accent = CATEGORY_ACCENT[pattern.category as string] ?? "bg-accent-blue";

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Design Pattern Catalog", href: "/patterns" },
          { label: category.name, href: `/patterns?category=${pattern.category}` },
          { label: pattern.name },
        ]}
      />

      {/* Hero */}
      <div className="mb-10">
        <div className={`h-1 w-12 rounded-full ${accent} mb-6`} />
        <div className="flex items-center gap-3 mb-3">
          <Icon name={pattern.icon} className={`h-7 w-7 ${iconColor}`} />
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
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
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
