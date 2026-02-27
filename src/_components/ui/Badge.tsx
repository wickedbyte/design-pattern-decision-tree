import type { PatternCategoryId } from "@/_lib/domain/PatternCategory";

const CATEGORY_STYLES: Record<string, string> = {
  creational:
    "bg-creational/15 text-creational-light border-creational/30 dark:bg-creational/15 dark:text-creational-light dark:border-creational/30",
  structural:
    "bg-structural/15 text-structural-light border-structural/30 dark:bg-structural/15 dark:text-structural-light dark:border-structural/30",
  behavioral:
    "bg-behavioral/15 text-behavioral-light border-behavioral/30 dark:bg-behavioral/15 dark:text-behavioral-light dark:border-behavioral/30",
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
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style} ${className}`}
    >
      {children}
    </span>
  );
}
