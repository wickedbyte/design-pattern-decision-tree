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
      className={`rounded-xl border border-white/10 bg-bg-surface/60 p-6 backdrop-blur-xl ${className}`}
    >
      {children}
    </Tag>
  );
}
