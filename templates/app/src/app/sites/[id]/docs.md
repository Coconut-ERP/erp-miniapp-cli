# Site detail (`/sites/[id]`)

## Purpose

Drill-in for one site: teams and nested member tables, CTA toward a new service request. Shows loading / error / empty / success early returns.

## Primary users

- Ops / site managers (once ERP-wired)
- Agents cloning detail + nested table patterns

## Data

- Seed: `SEED_SITE_DETAILS[id]` via `getSite(id)`
- ERP target: `Site` plus related team/member objects (extend `schema.ts` when wiring)

## Files

| Layer | Path |
| --- | --- |
| Route (RSC) | `src/app/sites/[id]/page.tsx` |
| Page (client) | `src/components/page/detail-page.tsx` (`siteId` from params) |
| Feature UI | `src/components/features/entity-members-table.tsx` |
| Hook | `src/hooks/use-sites.ts` → `useSite(id)` |
| Copy | `src/constants/pages.ts` (`DETAIL_PAGE`) |
| DTOs | `src/domain/types.ts` (`SiteDetail`, `TeamDetail`, `MemberRow`) |

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/sites/:id` | Site + teams + members (`withApi` + seed) |

### `GET /api/sites/:id` (shape)

```ts
{
  id, name, teamCount,
  teams: [{
    id, name,
    members: [{
      id, name, role, score,
      assignments: [{ assignmentId, projectName, projectCode, hours }],
    }],
  }]
}
```

## Status

`seed` — 404 via `notFound()` when id missing from seed map.
