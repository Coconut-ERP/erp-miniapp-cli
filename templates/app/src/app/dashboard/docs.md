# HRM dashboard (`/dashboard`)

## Purpose

Static reference layout for an HRM home: workforce KPIs, attendance, payroll CTA, recruitment. No live ERP reads — copy and metrics live in constants so agents can restyle without inventing APIs.

## Primary users

- Product / UI agents cloning the kit layout
- Demo viewers inside the mini-app shell

## Data

- **None from ERP** — all numbers and labels from `src/constants/hrm-dashboard.ts`
- ERP boot (`getErp`, `/api/me`) is available but unused by this page

## Files

| Layer | Path |
| --- | --- |
| Route (RSC) | `src/app/dashboard/page.tsx` |
| Page (client) | `src/components/page/hrm-dashboard-page.tsx` |
| Feature UI | `src/components/features/hrm-dashboard.tsx` |
| Copy | `src/constants/hrm-dashboard.ts` |

## API

| Method | Path | Notes |
| --- | --- | --- |
| — | — | No page API calls |

## Status

`seed` — static demo only.
