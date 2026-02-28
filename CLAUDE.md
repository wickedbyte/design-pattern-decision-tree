# Design Pattern Decision Tree

Interactive website helping developers choose the right design pattern using a pain-point-first decision tree.

## Tech Stack

- **Framework**: Next.js 16+ (App Router, `output: 'export'` for static site)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-only config via `@theme inline`, no tailwind.config file) + CSS custom properties
- **Decision Tree**: React Flow (`@xyflow/react`) + dagre layout
- **Animations**: Motion (`motion`) with reduced-motion support
- **Icons**: FontAwesome SVG icons via custom `Icon` component (`@/_components/ui/Icon.tsx`) — renders from FA icon definitions, no react-fontawesome
- **Syntax Highlighting**: Shiki (build-time pre-rendering via server-side `highlightCode()`, no client-side Shiki)
- **Dark Mode**: next-themes (defaults to system preference, two-way light/dark toggle)
- **Fonts**: Geist Sans + Geist Mono (variable, loaded from `geist` package)
- **Formatting**: Prettier (config in `.prettierrc.json`, integrated with ESLint via `eslint-config-prettier`)
- **Package Manager**: pnpm

## Commands

- `pnpm dev` — Start dev server with Turbopack
- `pnpm build` — Build static site to `out/`
- `pnpm start` — Serve `out/` locally
- `pnpm lint` — ESLint (`eslint src/`)
- `pnpm typecheck` — TypeScript check (`tsc --noEmit`)
- `pnpm test` — Vitest unit/component tests (70 tests across 8 suites)
- `pnpm test:watch` — Vitest watch mode
- `pnpm test:e2e` — Playwright E2E (32 tests, Chromium, requires build first)
- `pnpm format` — Format all files with Prettier
- `pnpm format:check` — Check formatting without writing

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on pushes to `main` and all pull requests:

1. **Setup**: Checkout, pnpm (version from `packageManager` field), Node 22, dependency install
2. **Checks**: `format:check` → `lint` → `typecheck` (fast, fail early)
3. **Tests**: `test` (70 unit tests)
4. **Build**: `build` (static export to `out/`)
5. **E2E**: Install Chromium, `test:e2e` (32 Playwright tests, `workers: 1` + `retries: 2` in CI)
6. **Artifacts**: Playwright report uploaded on E2E failure

Concurrency groups cancel in-progress runs for the same branch.

## Architecture: Wizard-First

The **wizard** is the primary experience (homepage). It asks one question at a time and recommends a pattern. The **graph** is a secondary reference view at `/tree`.

- **Wizard** (`DecisionWizard.tsx`): Step-by-step flow using React state only. Category selection auto-advances to the first yes/no question (no intermediate click-through). Shows category context (badge + accent color) alongside each question. No URL pollution. Clean animated transitions. Shows a result card with pattern details on completion.
- **Graph** (`DecisionTreeGraph.tsx`): Standalone React Flow visualization with search + inspector panel. Lives at `/tree`. No path tracking — purely exploratory.

## Project Structure

```
docs/
  design-pattern-decision-tree.md       # Original decision tree reference document
  design-pattern-decision-tree.mermaid  # Mermaid diagram (validated by sync test)
src/
  app/
    layout.tsx          # Root layout: ThemeProvider, Header, Footer, skip-to-content
    page.tsx            # Home: hero + wizard as centerpiece
    not-found.tsx       # Custom 404
    globals.css         # Design tokens, Tailwind v4 config, dark mode overrides
    about/page.tsx
    tree/page.tsx       # Full decision tree graph (React Flow)
    patterns/
      page.tsx          # Pattern catalog (filterable grid, "Compare Patterns" link)
      [slug]/page.tsx   # Pattern detail page (generateStaticParams)
      compare/page.tsx  # Side-by-side pattern comparison (client-side, uses searchParams)
  _components/
    tree/               # Decision tree views
      DecisionWizard.tsx          # Premium step-by-step wizard (the main experience)
      DecisionWizardWrapper.tsx   # Hydration guard for wizard
      DecisionTreeGraph.tsx       # React Flow graph with search + inspector
      DecisionTreeGraphWrapper.tsx # Hydration guard for graph
      TreeSearch.tsx              # Debounced node search overlay for graph
      InspectorPanel.tsx          # Slide-out panel showing node details
      WizardBreadcrumb.tsx        # Clickable breadcrumb nav
      nodes/            # StartNode, CategoryNode, QuestionNode, PatternNode, FallbackNode
      edges/            # AnimatedEdge
      hooks/
        useTreeLayout.ts        # Memoized dagre layout
        useDecisionPath.ts      # React state-backed decision path (no URL)
    patterns/           # Pattern display components
      PatternDetail.tsx, PatternCard.tsx, PatternMeta.tsx
      CodeExampleTabs.tsx          # Async server component: pre-highlights all code at build time
      CodeExampleTabsClient.tsx    # Client tab switching with pre-rendered HTML
      CodeBlock.tsx, RelatedPatterns.tsx, LanguageNotice.tsx
      CompareView.tsx             # Two-column pattern comparison layout
      CompareSelector.tsx         # Pattern selection comboboxes with swap
    layout/             # Site chrome
      Header.tsx        # Site identity, nav (Wizard, Catalog, Full Tree, About), theme toggle
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
      decision-tree.ts  # Tree nodes (37) and edges (41)
      languages.ts      # TypeScript, Python, PHP, Rust metadata
    highlighting/       # Shiki highlighter setup
    tree/               # dagre layout + React Flow conversion
    utils/
      brand.ts
      use-mounted.ts
      use-media-query.ts
      decision-path-url.ts    # URL hash serialization (available for future use)
  __tests__/
    domain/             # Value object unit tests (incl. DecisionPath serialization)
    data/               # Data integrity tests (cross-references, DAG, Mermaid sync)
    utils/              # URL serialization tests
tests/e2e/              # Playwright E2E tests
  decision-tree.spec.ts # Wizard flow, breadcrumb, graph page, search, inspector
  compare.spec.ts       # Compare view selection, swap, direct URL
  navigation.spec.ts    # Header nav, catalog, pattern detail, 404
  accessibility.spec.ts # Landmarks, ARIA labels, keyboard nav
  pattern-detail.spec.ts # Pattern sections, code tabs, related patterns
```

## Design System

- **Category colors**: Creational (blue), Structural (purple), Behavioral (green)
- **Dark mode**: `@custom-variant dark (&:where(.dark, .dark *))` in globals.css syncs Tailwind `dark:` utilities with next-themes `.dark` class
- **Design tokens**: All colors, shadows, and fonts defined as CSS custom properties in `:root` / `.dark` blocks, exposed to Tailwind via `@theme inline`
- **Shiki dual-theme**: Uses `--shiki-light` / `--shiki-dark` CSS variables with `.dark .shiki` override
- **SVG logos/icons**: Inline SVG components using `fill="currentColor"` — no external SVG files in `public/`

## Version Policy

- **Never assume a version number from memory.** Always look up the current release of any dependency, GitHub Action, tool, or library before adding or recommending it. Use web search or check the project's releases page. Training data goes stale; the registry/repo is the source of truth.

## Conventions

- All domain objects use `readonly` fields and branded types
- Pattern data is the single source of truth (data-driven architecture)
- Code examples stored as template literals in pattern data files
- Components follow WAI-ARIA patterns (no component library dependency)
- `@/*` path alias maps to `src/*`
- Static export: no API routes, no server-side dynamic behavior
- Prefer `interface` for object shapes, `type` for unions/intersections
- Tests co-located in `src/__tests__/` (unit) and `tests/e2e/` (E2E)
- Use `useSyncExternalStore` for client-only state (mounted, media queries) — never `useState` + `useEffect` for those
- Wizard state is plain React `useState` — no URL persistence
- `useMounted()` hook at `@/_lib/utils/use-mounted.ts` for hydration guards
- `useMediaQuery()` hook at `@/_lib/utils/use-media-query.ts` for responsive behavior
- `useReducedMotion()` from Motion for respecting prefers-reduced-motion in animations
- Next.js 16 has no `next lint` — use `eslint src/` directly
- `eslint-config-next` already includes jsx-a11y; don't add it again
- Python f-strings in TS template literals: avoid `$` in Python code examples (causes parse errors inside backticks)
- `packageManager` field in `package.json` pins the pnpm version for CI (Corepack)
- Run `pnpm format` after making changes; `pnpm format:check` verifies compliance

## Adding a New Pattern

1. Create `src/_lib/data/patterns/new-pattern.ts`
2. Add to registry in `src/_lib/data/patterns/index.ts`
3. Add decision tree nodes/edges in `src/_lib/data/decision-tree.ts`
4. Update `docs/design-pattern-decision-tree.mermaid` (keeps Mermaid sync test passing)
5. Pages, tree, catalog, and compare auto-generate from data
