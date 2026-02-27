interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
}

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={`rounded-xl border border-border-primary bg-bg-surface shadow-sm ${className}`}
    >
      {children}
    </Tag>
  );
}
