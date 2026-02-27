import type { LanguageAntiPatternNotice } from "@/_lib/domain/CodeExample";
import { LANGUAGE_INFO } from "@/_lib/data/languages";

interface LanguageNoticeProps {
  notice: LanguageAntiPatternNotice;
}

export function LanguageNotice({ notice }: LanguageNoticeProps) {
  const langInfo = LANGUAGE_INFO[notice.language];

  return (
    <div
      role="note"
      className="rounded-lg border border-accent-amber/30 bg-accent-amber/5 p-4"
    >
      <p className="text-sm font-semibold text-accent-amber">
        Note for {langInfo.displayName}
      </p>
      <p className="mt-1 text-sm text-text-secondary">{notice.reason}</p>
      {notice.alternatives && (
        <p className="mt-2 text-sm text-text-secondary">
          <strong className="text-text-primary">Alternatives:</strong>{" "}
          {notice.alternatives}
        </p>
      )}
    </div>
  );
}
