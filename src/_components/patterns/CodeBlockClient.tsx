"use client";

import { useEffect, useState } from "react";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("shiki").then(async ({ codeToHtml }) => {
      const result = await codeToHtml(code, {
        lang: language,
        themes: {
          dark: "github-dark",
          light: "github-light",
        },
      });
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      {filename && (
        <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-white/10 bg-bg-elevated px-4 py-2 text-xs text-text-muted font-mono">
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
      {html ? (
        <div
          className={`overflow-x-auto text-sm [&_pre]:p-4 [&_pre]:overflow-x-auto ${
            filename ? "[&_pre]:rounded-t-none" : ""
          } [&_pre]:rounded-lg [&_.shiki]:!bg-bg-elevated`}
          dangerouslySetInnerHTML={{ __html: html }}
          aria-label={`Code example in ${language}`}
        />
      ) : (
        <pre
          className={`overflow-x-auto rounded-lg bg-bg-elevated p-4 text-sm text-text-secondary ${
            filename ? "rounded-t-none" : ""
          }`}
        >
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
