# Design Pattern Decision Tree

Interactive website helping developers choose the right design pattern using a pain-point-first decision tree.

## Tech Stack

- **Framework**: Next.js 16+ (App Router, `output: 'export'` for static site)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + CSS custom properties
- **Decision Tree**: React Flow (`@xyflow/react`) + dagre layout
- **Animations**: Motion (`motion`) with reduced-motion support
- **Syntax Highlighting**: Shiki (build-time via RSC)
- **Dark Mode**: next-themes (system/light/dark)
- **Fonts**: Geist + Geist Mono (variable)
- **Package Manager**: pnpm

## Commands

- `pnpm dev` — Start dev server with Turbopack
- `pnpm build` — Build static site to `out/`
- `pnpm start` — Serve `out/` locally
- `pnpm lint` — ESLint
- `pnpm typecheck` — TypeScript check
- `pnpm test` — Vitest unit/component tests
- `pnpm test:watch` — Vitest watch mode
- `pnpm test:e2e` — Playwright E2E (requires build first)

## Project Structure

- `src/app/` — Next.js App Router pages
- `src/_components/` — React components (tree/, patterns/, layout/, ui/)
- `src/_lib/` — Domain model, data, utilities
  - `domain/` — Branded types, value objects (immutable)
  - `data/` — Pattern definitions, decision tree data
  - `highlighting/` — Shiki setup
  - `tree/` — dagre layout, React Flow conversion
  - `utils/` — Branded type utility
- `src/__tests__/` — Unit tests
- `tests/e2e/` — Playwright E2E tests

## Conventions

- All domain objects use `readonly` fields and branded types
- Pattern data is the single source of truth (data-driven)
- Code examples are stored as template literals in pattern data files
- Components follow WAI-ARIA patterns (no component library)
- `@/*` path alias maps to `src/*`
- Static export: no API routes, no server-side dynamic behavior
- Prefer `interface` for object shapes, `type` for unions/intersections
- Tests co-located in `src/__tests__/` (unit) and `tests/e2e/` (E2E)
- CSS custom properties define the design token system in `globals.css`
- Three-way theme toggle: System / Light / Dark
- Use `useSyncExternalStore` for client-only state (mounted, media queries) — never `useState` + `useEffect`
- `useMounted()` hook at `@/_lib/utils/use-mounted.ts` for hydration guards
- `useMediaQuery()` hook at `@/_lib/utils/use-media-query.ts` for responsive behavior
- Client components in pattern pages use `CodeBlockClient.tsx` (dynamic Shiki import)
- Next.js 16 has no `next lint` — use `eslint src/` directly
- `eslint-config-next` already includes jsx-a11y; don't add it again

## Adding a New Pattern

1. Create `src/_lib/data/patterns/new-pattern.ts`
2. Add to registry in `src/_lib/data/patterns/index.ts`
3. Add decision tree nodes/edges in `src/_lib/data/decision-tree.ts`
4. Pages, tree, and catalog auto-generate from data
