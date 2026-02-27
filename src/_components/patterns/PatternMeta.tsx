import type { PatternDefinition } from "@/_lib/domain/Pattern";

interface PatternMetaProps {
  pattern: PatternDefinition;
}

export function PatternMeta({ pattern }: PatternMetaProps) {
  return (
    <div className="space-y-6">
      <Section title="Intent">
        <p className="text-text-secondary leading-relaxed">{pattern.intent}</p>
      </Section>

      <Section title="Problem">
        <p className="text-text-secondary leading-relaxed">{pattern.problem}</p>
      </Section>

      <Section title="Solution">
        <p className="text-text-secondary leading-relaxed">
          {pattern.solution}
        </p>
      </Section>

      <Section title="Participants">
        <ul className="space-y-1.5 text-text-secondary">
          {pattern.participants.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-accent-green/20 bg-accent-green/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-green">Advantages</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
            {pattern.consequences.advantages.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-accent-rose/20 bg-accent-rose/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-rose">Disadvantages</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
            {pattern.consequences.disadvantages.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-rose" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Section title="Real-World Analogy">
        <div className="rounded-lg border-l-4 border-accent-amber bg-bg-inset p-4">
          <p className="text-text-secondary leading-relaxed italic">
            {pattern.realWorldAnalogy}
          </p>
        </div>
      </Section>

      <Section title="Use Cases">
        <ul className="space-y-1.5 text-text-secondary">
          {pattern.useCases.map((uc) => (
            <li key={uc} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-purple" />
              <span>{uc}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border-primary bg-bg-surface p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">{title}</h2>
      {children}
    </section>
  );
}
