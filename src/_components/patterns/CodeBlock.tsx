import { highlightCode } from "@/_lib/highlighting/highlight-code";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export async function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const html = await highlightCode(code, language);

  return (
    <div className="group relative">
      {filename && (
        <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-white/10 bg-bg-elevated px-4 py-2 text-xs text-text-muted font-mono">
          {filename}
        </div>
      )}
      <div
        className={`overflow-x-auto text-sm [&_pre]:p-4 [&_pre]:overflow-x-auto ${
          filename ? "[&_pre]:rounded-t-none" : ""
        } [&_pre]:rounded-lg [&_.shiki]:!bg-bg-elevated`}
        dangerouslySetInnerHTML={{ __html: html }}
        aria-label={`Code example in ${language}`}
      />
    </div>
  );
}
