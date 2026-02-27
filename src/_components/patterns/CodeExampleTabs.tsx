import type { CodeExample, LanguageAntiPatternNotice } from "@/_lib/domain/CodeExample";
import { LANGUAGE_ORDER } from "@/_lib/data/languages";
import { CodeExampleTabsClient } from "./CodeExampleTabsClient";

interface CodeExampleTabsProps {
  examples: readonly CodeExample[];
  antiPatternNotices: readonly LanguageAntiPatternNotice[];
}

export function CodeExampleTabs({
  examples,
  antiPatternNotices,
}: CodeExampleTabsProps) {
  const orderedExamples = LANGUAGE_ORDER.map((lang) => ({
    lang,
    example: examples.find((e) => e.language === lang),
    notice: antiPatternNotices.find((n) => n.language === lang),
  })).filter((item) => item.example || item.notice);

  return (
    <CodeExampleTabsClient items={orderedExamples} />
  );
}
