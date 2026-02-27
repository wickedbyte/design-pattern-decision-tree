import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center text-sm text-text-muted">
          <p>
            Inspired by{" "}
            <a
              href="https://medium.com/womenintechnology/stop-memorizing-design-patterns-use-this-decision-tree-instead-e84f22fca9fa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary underline underline-offset-2 transition-colors"
            >
              &ldquo;Stop Memorizing Design Patterns&rdquo;
            </a>{" "}
            by Alina Kovtun
          </p>
          <div className="flex gap-4">
            <Link
              href="/patterns"
              className="hover:text-text-secondary transition-colors"
            >
              Patterns
            </Link>
            <Link
              href="/about"
              className="hover:text-text-secondary transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
