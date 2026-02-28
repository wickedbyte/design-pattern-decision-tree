"use client";

import { useState } from "react";
import { LANGUAGE_INFO } from "@/_lib/data/languages";
import { Tabs } from "@/_components/ui/Tabs";
import { LanguageNotice } from "./LanguageNotice";
import type { PreRenderedTabItem } from "./CodeExampleTabs";

interface CodeExampleTabsClientProps {
  items: PreRenderedTabItem[];
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
            {item.example && item.highlightedHtml && (
              <PreRenderedCodeBlock
                html={item.highlightedHtml}
                code={item.example.code}
                language={item.example.language}
                filename={item.example.filename}
              />
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

function PreRenderedCodeBlock({
  html,
  code,
  language,
  filename,
}: {
  html: string;
  code: string;
  language: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border-primary">
      {filename && (
        <div className="flex items-center justify-between border-b border-border-primary bg-bg-inset px-4 py-2 text-xs text-text-muted font-mono">
          <span>{filename}</span>
          <button
            onClick={handleCopy}
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label="Copy code to clipboard"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <div
        className="overflow-x-auto bg-bg-code text-sm [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:bg-transparent!"
        dangerouslySetInnerHTML={{ __html: html }}
        aria-label={`Code example in ${language}`}
      />
    </div>
  );
}
