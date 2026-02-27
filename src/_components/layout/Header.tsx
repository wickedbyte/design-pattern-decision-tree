"use client";

import Link from "next/link";
import { Icon } from "@/_components/ui/Icon";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

const NAV_LINKS = [
  { href: "/", label: "Wizard" },
  { href: "/patterns", label: "Catalog" },
  { href: "/tree", label: "Full Tree" },
  { href: "/about", label: "About" },
];

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-primary bg-bg-primary/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        {/* Site identity */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-text-primary hover:text-accent-blue transition-colors shrink-0"
        >
          <Icon name="sitemap" className="h-8 w-8 text-accent-blue" />
          <span className="font-mono text-3xl font-normal hidden lg:inline">
            Design Pattern Decision Tree
          </span>
          <span className="font-mono text-2xl font-normal lg:hidden hidden sm:inline">
            DPDT
          </span>
        </Link>

        {/* Right side: nav + github + theme */}
        <div className="flex items-center gap-5 ml-auto">
          <nav aria-label="Main navigation" className="hidden md:block">
            <ul className="flex items-center gap-5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href="https://github.com/wickedbyte/design-pattern-decision-tree"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository for Website"
            className="rounded-md p-1.5 text-text-muted hover:text-text-primary transition-colors"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <div className="h-4 w-px bg-border-primary" />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
