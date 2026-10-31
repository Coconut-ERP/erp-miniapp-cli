# Service request form (`/requests/new`)

## Purpose

Multi-step wizard: basics → schedule → review, with validation, conditional fields (incident severity), toast + React Query mutation. Pattern for long forms — not a production ERP write yet.

## Primary users

- Employees submitting requests (once ERP-wired)
- Agents cloning multi-step form + mutation patterns

## Data

- Options seed: `SEED_SERVICE_REQUEST_OPTIONS` via `GET /api/service-requests/options`
- Submit mock: `createServiceRequest` returns a generated reference (no ERP create yet)
- ERP target: declare a request object in `schema.ts`, then `withErp` + `writable` / relations

## Files

| Layer | Path |
| --- | --- |
| Route (RSC) | `src/app/requests/new/page.tsx` (Suspense + loading) |
| Page (client) | `src/components/page/form-page.tsx` |
| Feature UI | `src/components/features/service-request-form.tsx` |
| Hooks | `src/hooks/use-service-requests.ts` |
| Copy | `src/constants/pages.ts` (`FORM_PAGE`) |
| DTOs | `src/domain/types.ts` (`ServiceRequestInput`, `ServiceRequestFormOptions`, …) |

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/service-requests/options` | Departments, types, severities, notify options |
| `POST` | `/api/service-requests` | Body = `ServiceRequestInput` → `{ id, reference }` |

### `POST /api/service-requests` (body essentials)

```ts
{
  requestType, title, description, departmentId, priority,
  startDate, endDate, urgent, severity, notifyIds,
  referenceId, acceptPolicy
}
```

## Status

`seed` — mock create; switch handler to `withErp` + `erp.objects.*` for `wired`.
