import Link from "next/link";
import { Container } from "@/_components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-6xl font-bold text-text-muted">404</p>
      <h1 className="mt-4 text-2xl font-bold text-text-primary">
        Page Not Found
      </h1>
      <p className="mt-2 text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-6 flex gap-4">
        <Link
          href="/"
          className="rounded-lg border border-border-accent px-6 py-2 font-medium text-text-primary transition-colors hover:border-border-primary"
        >
          Go Home
        </Link>
        <Link
          href="/patterns"
          className="rounded-lg border border-border-accent px-6 py-2 font-medium text-text-primary transition-colors hover:border-border-primary"
        >
          Browse Patterns
        </Link>
      </div>
    </Container>
  );
}
