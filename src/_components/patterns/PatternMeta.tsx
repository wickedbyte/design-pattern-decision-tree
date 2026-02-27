import type { PatternDefinition } from "@/_lib/domain/Pattern";

interface PatternMetaProps {
  pattern: PatternDefinition;
}

export function PatternMeta({ pattern }: PatternMetaProps) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-text-primary">Intent</h2>
        <p className="mt-2 text-text-secondary leading-relaxed">
          {pattern.intent}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-primary">Problem</h2>
        <p className="mt-2 text-text-secondary leading-relaxed">
          {pattern.problem}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-primary">Solution</h2>
        <p className="mt-2 text-text-secondary leading-relaxed">
          {pattern.solution}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-primary">Participants</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-text-secondary">
          {pattern.participants.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold text-accent-green">Advantages</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-text-secondary">
            {pattern.consequences.advantages.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold text-accent-rose">Disadvantages</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-text-secondary">
            {pattern.consequences.disadvantages.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h2 className="text-xl font-bold text-text-primary">
          Real-World Analogy
        </h2>
        <p className="mt-2 text-text-secondary leading-relaxed italic">
          {pattern.realWorldAnalogy}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-primary">Use Cases</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-text-secondary">
          {pattern.useCases.map((uc) => (
            <li key={uc}>{uc}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
