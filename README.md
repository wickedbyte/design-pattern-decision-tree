# Design Pattern Decision Tree

An interactive website that helps developers choose the right **Gang of Four design pattern** through a pain-point-first decision tree. Instead of memorizing 23 patterns, answer a few questions about your problem and get a targeted recommendation with code examples.

## Features

- **Guided Wizard** — Step-by-step questionnaire that narrows down to the right pattern based on your actual pain point
- **Interactive Graph** — Full decision tree visualization built with React Flow, with search and an inspector panel
- **17 Patterns** — Creational, Structural, and Behavioral patterns with real-world descriptions and trade-offs
- **4 Languages** — Code examples in TypeScript, Python, PHP, and Rust
- **Pattern Comparison** — Side-by-side comparison of any two patterns
- **Filterable Catalog** — Browse all patterns by category
- **Dark Mode** — System-preference-aware with manual toggle
- **Fully Accessible** — WAI-ARIA compliant, keyboard navigable, reduced-motion support

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server (Turbopack)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the wizard.

## Scripts

| Command             | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `pnpm dev`          | Start dev server with Turbopack                           |
| `pnpm build`        | Static export to `out/`                                   |
| `pnpm start`        | Serve the built site locally                              |
| `pnpm lint`         | Run ESLint                                                |
| `pnpm typecheck`    | TypeScript type checking                                  |
| `pnpm test`         | Run Vitest unit tests                                     |
| `pnpm test:watch`   | Vitest in watch mode                                      |
| `pnpm test:e2e`     | Playwright E2E tests (requires `pnpm build`)              |
| `pnpm format`       | Format all files with Prettier                            |
| `pnpm format:check` | Check formatting without writing                          |
| `pnpm check`        | Run all checks: format, lint, typecheck, test, build, e2e |

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, static export)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-only config)
- [React Flow](https://reactflow.dev/) + dagre for graph layout
- [Motion](https://motion.dev/) for animations
- [Shiki](https://shiki.style/) for build-time syntax highlighting
- [Playwright](https://playwright.dev/) + [Vitest](https://vitest.dev/) for testing

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    page.tsx            # Home — wizard experience
    tree/page.tsx       # Full decision tree graph
    patterns/           # Catalog, detail pages, comparison
    about/page.tsx
  _components/
    tree/               # Wizard + graph components
    patterns/           # Pattern display components
    layout/             # Header, Footer, ThemeToggle, MobileNav
    ui/                 # Reusable primitives (Icon, Card, Badge, etc.)
  _lib/
    domain/             # Branded types and value objects
    data/
      patterns/         # 17 pattern definition files (single source of truth)
      decision-tree.ts  # Tree nodes and edges
    highlighting/       # Shiki setup
    tree/               # dagre layout + React Flow conversion
    utils/              # Hooks and helpers
  __tests__/            # Vitest unit tests
tests/e2e/              # Playwright E2E tests
docs/                   # Reference decision tree (Markdown + Mermaid)
```

## Architecture

The project follows a **data-driven architecture** — all pattern definitions, code examples, and decision tree structure live in `src/_lib/data/`. Pages, the catalog, comparison view, and both tree visualizations are generated from this data automatically.

**Two ways to explore the tree:**

1. **Wizard** (homepage) — The primary experience. Asks one question at a time, starting with your main pain point category, then narrowing to a specific pattern recommendation.
2. **Graph** (`/tree`) — A secondary reference view. Pan, zoom, search, and click any node to inspect it.

Domain objects use **branded types** (`PatternSlug`, `PatternCategoryId`) and immutable `readonly` fields for type safety.

## Adding a New Pattern

1. Create a pattern file in `src/_lib/data/patterns/`
2. Register it in `src/_lib/data/patterns/index.ts`
3. Add decision tree nodes and edges in `src/_lib/data/decision-tree.ts`
4. Update `docs/design-pattern-decision-tree.mermaid`
5. Everything else generates automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run `pnpm check` to verify everything passes
4. Open a pull request

## License

[MIT](LICENSE) &copy; WickedByte
