# Folder structure

Recommended mini-app layout:

```text
src/
  app/                 # routes — page.tsx stays Server Components
  components/
    page/              # client page bodies (*-page.tsx)
    features/          # feature-specific composition
    # do NOT copy components/ui — import @erp/miniapp-ui
  hooks/               # React Query / UI hooks
  constants/           # static copy, nav, labels (no React, no I/O)
  lib/
    erp/               # createMiniApp, schema, session, records
    api/               # route wrappers, domain fetch/mutate
    client/            # browser fetch + initData
    date.ts|format.ts  # pure helpers shared FE/BE
  domain/              # types + zod (or lib/domain/ if preferred)
```

## What goes where

| Folder | Put here | Do not put here |
| --- | --- | --- |
| `constants/` | Page titles/descriptions, empty/error copy, nav labels, status enums as strings | Hooks, JSX, fetch, ERP field names |
| `lib/` | ERP bootstrap, API helpers, date/format utilities | React components, `"use client"` |
| `domain/` | Types, zod schemas for payloads | UI strings |
| `components/page/` | Client page orchestration: hooks, early returns, compose features | Hard-coded long copy; large inline card trees |
| `components/features/` | Domain cards/sections (`FactoryOverviewCard`, …) composed from `@erp/miniapp-ui` | Route params fetching; duplicated primitives |

## Extract feature components

When a page maps a list of domain items into rich cards (metrics, nested lists, CTAs), extract that card into `components/features/`:

```text
components/page/factories-page.tsx              # early returns + KPI grid + map
components/features/factory-overview-card.tsx   # one factory → DashboardCard + stats
```

`*-page.tsx` stays thin: load data, branch states, layout. Feature files own presentation for one domain unit.

See [pages](./pages.md), [constants](./constants.md), [lib](./lib.md).
