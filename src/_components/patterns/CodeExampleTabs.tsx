import type {
  CodeExample,
  LanguageAntiPatternNotice,
} from "@/_lib/domain/CodeExample";
import type { Language } from "@/_lib/domain/Language";
import { LANGUAGE_ORDER } from "@/_lib/data/languages";
import { highlightCode } from "@/_lib/highlighting/highlight-code";
import { CodeExampleTabsClient } from "./CodeExampleTabsClient";

interface CodeExampleTabsProps {
  examples: readonly CodeExample[];
  antiPatternNotices: readonly LanguageAntiPatternNotice[];
}

export interface PreRenderedTabItem {
  lang: Language;
  example?: CodeExample;
  notice?: LanguageAntiPatternNotice;
  highlightedHtml?: string;
}

export async function CodeExampleTabs({
  examples,
  antiPatternNotices,
}: CodeExampleTabsProps) {
  const items = await Promise.all(
    LANGUAGE_ORDER.map(async (lang) => {
      const example = examples.find((e) => e.language === lang);
      const notice = antiPatternNotices.find((n) => n.language === lang);
      const highlightedHtml = example
        ? await highlightCode(example.code, example.language)
        : undefined;
      return { lang, example, notice, highlightedHtml };
    })
  );

  const filteredItems = items.filter((item) => item.example || item.notice);

  return <CodeExampleTabsClient items={filteredItems} />;
}
