# AGENTS.md — {{name}}

ERP mini app built on Next.js + Bun, `@erp/miniapp-ui` (UI) and `erp-sdk` (data).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Working agreement (read first)

1. **Tests are not optional.** Every behavior change ships with a unit test (`bun test`). New logic in `src/lib/`, `src/hooks/`, `src/lib/api/` → test beside the file (`foo.ts` → `foo.test.ts`). Fixing a bug → write the failing test first. Before adding a test, apply the [`test-audit`](.agents/skills/test-audit/SKILL.md) gate and [docs/conventions/testing.md](docs/conventions/testing.md). If you skip a test, say why in your final message.
2. **Docs are not optional.** Every change keeps the docs true in the same turn — see [Keeping docs current](#keeping-docs-current). Stale docs are a bug.
3. **Verify before you say done:** `bun run check` (format, lint, typecheck, tests). Fix every error; never silence a rule, add `--no-verify`, or loosen `.oxlintrc.json` to get green. Enforced three ways: Claude Code hooks (`.claude/settings.json` — format + lint after every edit, full check before stopping), the git `pre-commit` hook, and `erp-miniapp zip`.
4. **Unclear request or big design choice?** Load the `grilling` skill and interview the user before building. **Prefer the smallest change** that fully solves the task (`ponytail` skill).

## Skills (load before the matching task)

Skills live in `.agents/skills/` (mirrored to `.claude/skills/`). Read the `SKILL.md` first; do not invent APIs.

| When | Skill |
| --- | --- |
| Boot `createMiniApp`, `schema.json`, initData / session, deploy contract | `erp-miniapp` |
| Read / write / query ERP records, SQL, dashboards | `erp-data` |
| Workflows, drive, task board | `erp-tools` |
| ERP wiki retrieval or writing | `erp-wiki` |
| Page layout, composition, visual polish, "looks generic" | `design-taste-frontend` — art direction **inside** the `@erp/miniapp-ui` constraint (rule 1 below still wins; never fork components for style) |
| Writing or reviewing Next.js / React code (data fetching, bundle size, re-renders) | `vercel-react-best-practices` |
| Component APIs, compound components, avoiding boolean-prop sprawl | `vercel-composition-patterns` |
| Verifying a change in the running app (routes, errors, browser) | `next-dev-loop` |
| Writing, changing or reviewing tests | `test-audit` |
| Keep a change minimal, avoid over-engineering | `ponytail` |
| Stress-test a plan or design with the user | `grilling` (`grill-me`) |
| Understand repo architecture / update the wiki | `openwiki` |

Project UI conventions (from the miniapp-ui kit) live under `docs/skills/` — read the matching file:

| When | File |
| --- | --- |
| Shell, sidebar, canvas, or custom color | [docs/skills/styling.md](docs/skills/styling.md) |
| New feature / domain component | [docs/skills/component.md](docs/skills/component.md) |
| New route / page orchestration | [docs/skills/page.md](docs/skills/page.md) — also add `docs.md` beside `page.tsx` |
| Reusable pattern composition | [docs/skills/pattern.md](docs/skills/pattern.md) |
| Follow an existing recipe | [docs/skills/recipe.md](docs/skills/recipe.md) |
| Review UI quality / a11y / performance | [review.md](docs/skills/review.md), [accessibility-review.md](docs/skills/accessibility-review.md), [performance-review.md](docs/skills/performance-review.md) |
| Replace local UI with library | [docs/skills/refactor.md](docs/skills/refactor.md) |

Index: [docs/skills/README.md](docs/skills/README.md) · Conventions: [docs/conventions/](docs/conventions/) · Recipes: [docs/recipes/](docs/recipes/)

## Next.js rules

Full detail and doc map: [docs/conventions/nextjs.md](docs/conventions/nextjs.md). The bundled docs in `node_modules/next/dist/docs/` are the source of truth for the installed version — read the matching guide **before** writing routes, data fetching, caching, route handlers or `proxy.ts`; never code Next.js APIs from memory.

- Server Components by default; add `"use client"` only to the smallest leaf that needs state, effects or browser APIs. Never mark a page or layout `"use client"`.
- `params`, `searchParams`, `cookies()` and `headers()` are async — `await` them.
- `next/link` for internal navigation, `next/image` for images, `next/font` for fonts, the Metadata API for titles. (Lint-enforced: no `<a>` / `<img>` for these.)
- Client code never imports `erp-sdk`, `@/lib/erp/*` or `@/lib/api/*` (lint-enforced). Secrets are never `NEXT_PUBLIC_*`.
- Fetch in parallel (`Promise.all`), stream with `loading.tsx` / `<Suspense>`, give each route segment sensible `error.tsx` / `not-found.tsx`.
- Middleware is called **Proxy** (`proxy.ts`) in Next 16. Do not call this app's own Route Handlers from Server Components — call the service function directly.
- After changing a route, API handler, config or anything the browser renders: verify at runtime (`next-dev-loop` skill / Next.js MCP `get_errors`, `get_compilation_issues`), and run `bun run build` when routes or prerendering changed. A passing typecheck is not proof the page works.

## Hard rules

1. Import UI from `@erp/miniapp-ui` only — no local `components/ui` / shadcn forks.
2. `app/**/page.tsx` is a **Server Component** (no `"use client"`). Interactive UI → `src/components/page/*-page.tsx`.
3. Domain UI (cards, forms, tables, sections) → `src/components/features/`. Keep `*-page.tsx` as orchestration (hooks, early returns, layout).
4. Copy (titles, empty, errors) → `src/constants/` (e.g. `pages.ts`). Shared helpers → `src/lib/` (e.g. `date.ts`).
5. Page body: **early returns** — loading → error → empty → success (one branch only). Use `PageHeader` + loading/empty/error/permission states.
6. Mutations: toast + invalidate React Query.
7. **Colors** (lint-enforced by `@shadcn/lint`: `no-raw-colors`, `no-arbitrary-values`, `no-inline-styles`, `no-unknown-classes`)
   - Semantic tokens only: `bg-primary`, `text-muted-foreground`, `bg-surface`, `text-success`, `text-destructive`, `bg-warning/10`, …
   - App chrome (shell/sidebar/canvas): Tailwind classes **inline** on elements, still tokens.
   - Never: raw palette (`bg-sky-50`), arbitrary values (`text-[11px]`, `p-[13px]`), `style={{…}}`, `--app-*` CSS vars, `bg-[var(--…)]`, color palette `const` objects. Need a new color → add a token, do not bypass the rule.
8. API keys / ERP credentials stay server-side (`lib/erp`, `lib/api`, route handlers). Never in client components.
9. Data layer: `erp-sdk` only on the server. FE talks to app `/api/*` with `X-Init-Data`; see the `erp-miniapp` skill.

## Keeping docs current

Update docs **in the same change** as the code; do not leave it for later and do not wait to be asked.

| You changed | Update |
| --- | --- |
| A route (`src/app/**/page.tsx`) | its `docs.md` (purpose, files, API, `seed`/`wired` status) + the Pages table in [README.md](README.md) |
| An API route / `src/lib/api/*` | the `docs.md` API table of every page that calls it + the API table in [README.md](README.md) |
| `src/lib/erp/schema.ts` | run `bun run schema` and commit `schema.json`; note new fields in the page `docs.md` |
| A convention, folder, or command | `AGENTS.md`, `README.md`, and the file under `docs/conventions/` |
| Anything architectural | the repo wiki (`openwiki/`): ask `openwiki` to update it for the changes since its last run |

The repo wiki is generated by [OpenWiki](https://github.com/langchain-ai/openwiki) into `openwiki/`. If `openwiki/` does not exist yet, initialize it first ("Initialize this repository's OpenWiki"). Do not hand-edit OpenWiki-owned files (`openwiki/.claims/`, indexes, provenance). Never put docs updates in CI/CD — agents do it as part of the change.

## Folder layout

```text
schema.json               # mini-app table declaration (when wired to ERP)
scripts/schema.ts         # generate schema.json from src/lib/erp/schema.ts
src/
  app/                    # routes + app/api/* + per-route docs.md
  components/
    page/                 # *-page.tsx (client orchestration)
    features/             # domain cards, forms, tables
    app-shell.tsx
    providers.tsx
  constants/              # nav.ts, pages.ts (copy only)
  hooks/                  # React Query
  lib/
    api/                  # server domain services + route helpers
    erp/                  # createMiniApp, schema, session, records (ERP only)
    client/               # browser fetch + initData bridge
    date.ts
  domain/types.ts         # DTOs
docs/                     # conventions, recipes, UI skills
openwiki/                 # generated repo wiki (OpenWiki)
.agents/skills/           # agent skills (mirrored to .claude/skills)
```

## Commands

```bash
bun install
bun run dev
bun run typecheck
bun run check             # format:check + lint + typecheck + test — run before finishing
bun run lint              # oxlint --deny-warnings (+ @shadcn/lint rules)
bun run format            # oxfmt
bun test                  # unit tests (bun:test)
bun run build
bun run schema            # regenerate schema.json from src/lib/erp/schema.ts
bunx erp doctor           # env + ERP connectivity (needs .env.local)
erp-miniapp zip           # deploy archive in artifacts/
erp-miniapp pack          # whole codebase as one Markdown file (for LLM context)
```

## Library docs (`@erp/miniapp-ui`)

**Primary source** — ships in `node_modules/@erp/miniapp-ui/` after `bun install`. No network required.

| Order | Path | When |
| --- | --- | --- |
| 1 | `llms.txt` | Start of any UI task — index of components, foundations, patterns |
| 2 | `docs/foundations/`, `docs/patterns/` | Guides (colors, forms, upload, crud, …) |
| 3 | `dist/index.d.ts` | Props, variants, JSDoc (Purpose, A11y, Do/Don't) |

Do not infer APIs from memory, other libraries, or by grepping component source.

## Next.js MCP (`next-devtools`)

Configured in `.mcp.json`, `.cursor/mcp.json` and `.codex/config.toml`. With `bun run dev` running it connects to `/_next/mcp`: `get_errors`, `get_routes`, `get_compilation_issues`, `compile_route`, `get_logs`. Prefer it over guessing from stdout. If a dev server is already running (`.next/dev/lock`), reuse it instead of starting another.

## MCP UI (optional — `coconut-erp-ui`)

Supplement when configured — story snippets, extra variants, Storybook preview. Not a replacement for shipped docs.

| Tool | When |
| --- | --- |
| `get-documentation` / `get-documentation-for-story` | Local `index.d.ts` + pattern docs don't show the prop or variant you need |
| `get-storybook-story-instructions` | Creating or editing `*.stories.*` |
| `preview-stories` | Visual verification after UI changes |

Never assume a prop exists — if neither local docs nor MCP show it, it does not exist.
