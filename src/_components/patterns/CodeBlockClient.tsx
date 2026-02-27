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
        defaultColor: false,
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
      {html ? (
        <div
          className={`overflow-x-auto bg-bg-code text-sm [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:bg-transparent!`}
          dangerouslySetInnerHTML={{ __html: html }}
          aria-label={`Code example in ${language}`}
        />
      ) : (
        <pre className="overflow-x-auto bg-bg-code p-4 text-sm text-text-secondary">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
