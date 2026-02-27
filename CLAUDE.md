# Design Pattern Decision Tree

Interactive website helping developers choose the right design pattern using a pain-point-first decision tree.

## Tech Stack

- **Framework**: Next.js 16+ (App Router, `output: 'export'` for static site)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-only config via `@theme inline`, no tailwind.config file) + CSS custom properties
- **Decision Tree**: React Flow (`@xyflow/react`) + dagre layout
- **Animations**: Motion (`motion`) with reduced-motion support
- **Icons**: FontAwesome SVG icons via custom `Icon` component (`@/_components/ui/Icon.tsx`) — renders from FA icon definitions, no react-fontawesome
- **Syntax Highlighting**: Shiki (client-side dynamic import via `CodeBlockClient.tsx`)
- **Dark Mode**: next-themes (defaults to system preference, two-way light/dark toggle)
- **Fonts**: Geist Sans + Geist Mono (variable, loaded from `geist` package)
- **Package Manager**: pnpm

## Commands

- `pnpm dev` — Start dev server with Turbopack
- `pnpm build` — Build static site to `out/`
- `pnpm start` — Serve `out/` locally
- `pnpm lint` — ESLint (`eslint src/`)
- `pnpm typecheck` — TypeScript check (`tsc --noEmit`)
- `pnpm test` — Vitest unit/component tests (43 tests)
- `pnpm test:watch` — Vitest watch mode
- `pnpm test:e2e` — Playwright E2E (Chromium, requires build first)

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout: ThemeProvider, Header, Footer, skip-to-content
    page.tsx            # Home: hero, decision tree, category overview
    not-found.tsx       # Custom 404
    globals.css         # Design tokens, Tailwind v4 config, dark mode overrides
    about/page.tsx
    patterns/
      page.tsx          # Pattern catalog (filterable grid)
      [slug]/page.tsx   # Pattern detail page (generateStaticParams)
  _components/
    tree/               # Decision tree views
      DecisionTreeContainer.tsx   # Responsive switcher (desktop/mobile)
      DecisionTreeDesktop.tsx     # React Flow interactive tree
      DecisionTreeMobile.tsx      # Step-by-step wizard
      nodes/            # StartNode, CategoryNode, QuestionNode, PatternNode, FallbackNode
      edges/            # AnimatedEdge
      hooks/            # useTreeLayout, useDecisionPath
    patterns/           # Pattern display components
      PatternDetail.tsx, PatternCard.tsx, PatternMeta.tsx
      CodeExampleTabs.tsx, CodeExampleTabsClient.tsx, CodeBlockClient.tsx
      CodeBlock.tsx, RelatedPatterns.tsx, LanguageNotice.tsx
    layout/             # Site chrome
      Header.tsx        # Site identity, nav, GitHub link, theme toggle
      Footer.tsx        # Attribution, WickedByte logo (inline SVG), copyright
      ThemeToggle.tsx   # Light/dark toggle button
      MobileNav.tsx     # Hamburger menu for mobile
    ui/                 # Primitives
      Icon.tsx, Container.tsx, Card.tsx, Badge.tsx, Tabs.tsx, Breadcrumb.tsx
  _lib/
    domain/             # Branded types, immutable value objects
      Pattern.ts, PatternSlug.ts, PatternCategory.ts
      DecisionNode.ts, DecisionEdge.ts, DecisionPath.ts
      CodeExample.ts, Language.ts
    data/
      patterns/         # 17 pattern data files + index.ts registry
      decision-tree.ts  # Tree nodes and edges
      languages.ts      # TypeScript, Python, PHP, Rust metadata
    highlighting/       # Shiki highlighter setup
    tree/               # dagre layout + React Flow conversion
    utils/              # brand.ts, use-mounted.ts, use-media-query.ts
  __tests__/
    domain/             # Value object unit tests
    data/               # Data integrity tests (cross-references, DAG validation)
tests/e2e/              # Playwright E2E tests
```

## Design System

- **Category colors**: Creational (blue), Structural (purple), Behavioral (green)
- **Dark mode**: `@custom-variant dark (&:where(.dark, .dark *))` in globals.css syncs Tailwind `dark:` utilities with next-themes `.dark` class
- **Design tokens**: All colors, shadows, and fonts defined as CSS custom properties in `:root` / `.dark` blocks, exposed to Tailwind via `@theme inline`
- **Shiki dual-theme**: Uses `--shiki-light` / `--shiki-dark` CSS variables with `.dark .shiki` override
- **SVG logos/icons**: Inline SVG components using `fill="currentColor"` — no external SVG files in `public/`

## Conventions

- All domain objects use `readonly` fields and branded types
- Pattern data is the single source of truth (data-driven architecture)
- Code examples stored as template literals in pattern data files
- Components follow WAI-ARIA patterns (no component library dependency)
- `@/*` path alias maps to `src/*`
- Static export: no API routes, no server-side dynamic behavior
- Prefer `interface` for object shapes, `type` for unions/intersections
- Tests co-located in `src/__tests__/` (unit) and `tests/e2e/` (E2E)
- Use `useSyncExternalStore` for client-only state (mounted, media queries) — never `useState` + `useEffect`
- `useMounted()` hook at `@/_lib/utils/use-mounted.ts` for hydration guards
- `useMediaQuery()` hook at `@/_lib/utils/use-media-query.ts` for responsive behavior
- Next.js 16 has no `next lint` — use `eslint src/` directly
- `eslint-config-next` already includes jsx-a11y; don't add it again
- Python f-strings in TS template literals: avoid `$` in Python code examples (causes parse errors inside backticks)

## Adding a New Pattern

1. Create `src/_lib/data/patterns/new-pattern.ts`
2. Add to registry in `src/_lib/data/patterns/index.ts`
3. Add decision tree nodes/edges in `src/_lib/data/decision-tree.ts`
4. Pages, tree, and catalog auto-generate from data
