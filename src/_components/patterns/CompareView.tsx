import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { Badge } from "@/_components/ui/Badge";
import { CodeExampleTabs } from "./CodeExampleTabs";

interface CompareViewProps {
  patternA: PatternDefinition;
  patternB: PatternDefinition;
}

export function CompareView({ patternA, patternB }: CompareViewProps) {
  return (
    <div className="space-y-8">
      {/* Header row */}
      <div className="grid grid-cols-2 gap-6">
        <PatternHeader pattern={patternA} />
        <PatternHeader pattern={patternB} />
      </div>

      {/* Intent */}
      <CompareRow title="Intent">
        <p className="text-sm text-text-secondary leading-relaxed">
          {patternA.intent}
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          {patternB.intent}
        </p>
      </CompareRow>

      {/* Problem */}
      <CompareRow title="Problem">
        <p className="text-sm text-text-secondary leading-relaxed">
          {patternA.problem}
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          {patternB.problem}
        </p>
      </CompareRow>

      {/* Solution */}
      <CompareRow title="Solution">
        <p className="text-sm text-text-secondary leading-relaxed">
          {patternA.solution}
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          {patternB.solution}
        </p>
      </CompareRow>

      {/* Advantages */}
      <CompareRow title="Advantages">
        <ProConList items={patternA.consequences.advantages} color="green" />
        <ProConList items={patternB.consequences.advantages} color="green" />
      </CompareRow>

      {/* Disadvantages */}
      <CompareRow title="Disadvantages">
        <ProConList items={patternA.consequences.disadvantages} color="rose" />
        <ProConList items={patternB.consequences.disadvantages} color="rose" />
      </CompareRow>

      {/* Use Cases */}
      <CompareRow title="Use Cases">
        <ul className="space-y-1 text-sm text-text-secondary">
          {patternA.useCases.map((uc) => (
            <li key={uc} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-purple" />
              <span>{uc}</span>
            </li>
          ))}
        </ul>
        <ul className="space-y-1 text-sm text-text-secondary">
          {patternB.useCases.map((uc) => (
            <li key={uc} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-purple" />
              <span>{uc}</span>
            </li>
          ))}
        </ul>
      </CompareRow>

      {/* Code Examples */}
      <CompareRow title="Code Examples">
        <CodeExampleTabs
          examples={patternA.codeExamples}
          antiPatternNotices={patternA.antiPatternNotices}
        />
        <CodeExampleTabs
          examples={patternB.codeExamples}
          antiPatternNotices={patternB.antiPatternNotices}
        />
      </CompareRow>
    </div>
  );
}

function PatternHeader({ pattern }: { pattern: PatternDefinition }) {
  return (
    <div className="rounded-lg border border-border-primary bg-bg-surface p-4">
      <Badge category={pattern.category}>{pattern.category as string}</Badge>
      <h2 className="mt-2 text-xl font-bold text-text-primary">
        {pattern.name}
      </h2>
      <p className="mt-1 text-sm text-text-secondary">{pattern.summary}</p>
    </div>
  );
}

function CompareRow({
  title,
  children,
}: {
  title: string;
  children: [React.ReactNode, React.ReactNode];
}) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {children[0]}
        {children[1]}
      </div>
    </section>
  );
}

function ProConList({
  items,
  color,
}: {
  items: readonly string[];
  color: "green" | "rose";
}) {
  const dotColor = color === "green" ? "bg-accent-green" : "bg-accent-rose";
  return (
    <ul className="space-y-1 text-sm text-text-secondary">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span
            className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
