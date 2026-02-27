"use client";

import { Suspense } from "react";
import type { CodeExample, LanguageAntiPatternNotice } from "@/_lib/domain/CodeExample";
import type { Language } from "@/_lib/domain/Language";
import { LANGUAGE_INFO } from "@/_lib/data/languages";
import { Tabs } from "@/_components/ui/Tabs";
import { CodeBlock } from "./CodeBlockClient";
import { LanguageNotice } from "./LanguageNotice";

interface TabItem {
  lang: Language;
  example?: CodeExample;
  notice?: LanguageAntiPatternNotice;
}

interface CodeExampleTabsClientProps {
  items: TabItem[];
}

export function CodeExampleTabsClient({ items }: CodeExampleTabsClientProps) {
  const tabs = items.map((item) => ({
    id: item.lang,
    label: LANGUAGE_INFO[item.lang].displayName,
  }));

  return (
    <Tabs tabs={tabs}>
      {(activeId) => {
        const item = items.find((i) => i.lang === activeId);
        if (!item) return null;
        return (
          <div className="mt-4 space-y-4">
            {item.notice && <LanguageNotice notice={item.notice} />}
            {item.example && (
              <Suspense
                fallback={
                  <div className="h-48 animate-pulse rounded-lg bg-bg-elevated" />
                }
              >
                <CodeBlock
                  code={item.example.code}
                  language={item.example.language}
                  filename={item.example.filename}
                />
              </Suspense>
            )}
            {item.example && (
              <p className="text-sm text-text-secondary">
                {item.example.description}
              </p>
            )}
          </div>
        );
      }}
    </Tabs>
  );
}
