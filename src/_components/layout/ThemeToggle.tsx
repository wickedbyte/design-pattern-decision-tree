"use client";

import { useTheme } from "next-themes";
import { useMounted } from "@/_lib/utils/use-mounted";

const THEMES = [
  { id: "system", label: "System", icon: "💻" },
  { id: "light", label: "Light", icon: "☀️" },
  { id: "dark", label: "Dark", icon: "🌙" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-9 w-[132px]" aria-hidden="true" />;
  }

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="flex rounded-lg border border-white/10 bg-bg-surface/60 p-0.5"
    >
      {THEMES.map(({ id, label, icon }) => (
        <button
          key={id}
          role="radio"
          aria-checked={theme === id}
          aria-label={label}
          onClick={() => setTheme(id)}
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
            theme === id
              ? "bg-bg-elevated text-text-primary"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          <span aria-hidden="true">{icon}</span>
          <span className="sr-only sm:not-sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}
