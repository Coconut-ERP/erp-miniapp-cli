# Sites list (`/sites`)

## Purpose

List dashboard: search sites, show aggregate stats, open detail cards. Template for “overview → drill-in” flows. Today reads seed data; swap `lib/api/sites.ts` to ERP `Site` records when wiring.

Not in the sidebar by default (`nav.ts`) — open `/sites` directly or add a nav item.

## Primary users

- Ops / site managers (once ERP-wired)
- Agents cloning list+card patterns

## Data

- Seed: `SEED_SITES` via `listSites()` (`src/lib/api/sites.ts`)
- ERP target (when wired): object `Site` — see `src/lib/erp/schema.ts` (`OBJECTS.site`, `F.site`)

## Files

| Layer | Path |
| --- | --- |
| Route (RSC) | `src/app/sites/page.tsx` |
| Page (client) | `src/components/page/list-dashboard-page.tsx` |
| Feature UI | `src/components/features/entity-overview-card.tsx` |
| Hook | `src/hooks/use-sites.ts` → `useSites()` |
| Copy | `src/constants/pages.ts` (`LIST_PAGE`) |
| DTOs | `src/domain/types.ts` (`SitesResponse`, `SiteSummary`) |

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/sites` | Overview list + aggregates (`withApi` + seed) |

### `GET /api/sites` (shape)

```ts
{
  activeCount, totalTeams, totalMembers,
  items: [{
    id, name, teamCount, memberCount, avgScore,
    teams: [{ id, name }],
  }]
}
```

## Status

`seed` — replace `listSites()` with `erp.objects.site` + `withErp` to go `wired`.
