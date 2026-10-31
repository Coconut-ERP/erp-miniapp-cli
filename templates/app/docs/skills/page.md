# Skill: Create Page

1. `app/**/page.tsx` is a **Server Component** — no `"use client"`. Put interactive UI in `components/page/*-page.tsx`.
2. **Add `docs.md` next to `page.tsx`** (same folder) before or with the route — see workshop pattern and [existing docs](../../src/app/dashboard/docs.md). Agents load it to learn purpose, files, API, and status.
3. Copy (titles, empty, errors) → `src/constants/pages.ts` (or a dedicated constants file). Shared helpers (dates) → `src/lib/date.ts`.
4. `PageHeader` + body.
5. Render with **early returns**: loading → error → empty → success (one branch only).
6. Wire loading (`LoadingRows`/`LoadingBlock`), empty, error, permission.
7. Mutations: toast + invalidate queries.
8. Follow library conventions: [pages.md](../conventions/pages.md), [folder.md](../conventions/folder.md), [constants.md](../conventions/constants.md), [lib.md](../conventions/lib.md), [styling.md](../conventions/styling.md).
9. **Extract feature UI** — do not inline large cards/sections in `*-page.tsx`. Put them in `components/features/<name>.tsx`. Compose only `@erp/miniapp-ui` (no local `components/ui`).
10. **Shell / sidebar colors** — load [styling.md](./styling.md): Tailwind classes inline, no `--app-*` vars, no palette `const` objects.
11. Index the route in root [`README.md`](../../README.md) Pages table (link to `docs.md`).

## `docs.md` template

```markdown
# <Title> (`/<path>`)

## Purpose
One short paragraph: what the screen does.

## Primary users
- Who uses it

## Data
- Seed vs ERP objects / fields (`F.*` when wired)

## Files
| Layer | Path |
| Route (RSC) | `src/app/.../page.tsx` |
| Page (client) | `src/components/page/...` |
| Features / hooks / copy | … |

## API
| Method | Path | Description |
| … | … | … |

Optional response/body shape in a ts fence.

## Status
`seed` | `wired` | `redirect`
```
