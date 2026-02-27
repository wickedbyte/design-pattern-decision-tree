import type { PatternCategoryId } from "@/_lib/domain/PatternCategory";

const CATEGORY_STYLES: Record<string, string> = {
  creational:
    "bg-creational-bg text-creational-dark border-creational-border",
  structural:
    "bg-structural-bg text-structural-dark border-structural-border",
  behavioral:
    "bg-behavioral-bg text-behavioral-dark border-behavioral-border",
};

interface BadgeProps {
  category: PatternCategoryId;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ category, children, className = "" }: BadgeProps) {
  const style = CATEGORY_STYLES[category as string] ?? "";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style} ${className}`}
    >
      {children}
    </span>
  );
}
