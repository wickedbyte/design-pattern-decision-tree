import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPatterns, getPatternBySlug } from "@/_lib/data/patterns";
import { getCategoryInfo } from "@/_lib/domain/PatternCategory";
import { PatternDetail } from "@/_components/patterns/PatternDetail";

interface PatternPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPatterns().map((p) => ({ slug: p.slug as string }));
}

export async function generateMetadata({
  params,
}: PatternPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern) return { title: "Pattern Not Found" };
  const category = getCategoryInfo(pattern.category);
  return {
    title: `${pattern.name} (${category.name})`,
    description: pattern.summary,
  };
}

export default async function PatternPage({ params }: PatternPageProps) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern) notFound();

  return <PatternDetail pattern={pattern} />;
}
