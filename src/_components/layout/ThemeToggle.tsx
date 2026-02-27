"use client";

import { useTheme } from "next-themes";
import { useMounted } from "@/_lib/utils/use-mounted";
import { Icon } from "@/_components/ui/Icon";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-7 w-7" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-md p-1.5 text-text-muted hover:text-text-primary transition-colors"
    >
      <Icon name={isDark ? "sun" : "moon"} className="h-4 w-4" />
    </button>
  );
}
