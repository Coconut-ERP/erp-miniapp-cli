# Table / pipeline CRUD (`/table`)

## Purpose

In-memory CRUD table demo (create, edit, delete, export menu, filter, side panels for Performance / Payments). Pattern for dense data tables with dialogs — not wired to ERP.

Query / alias: `/pipeline` redirects here.

## Primary users

- Agents building list+CRUD screens with `@erp/miniapp-ui` dialogs and tables

## Data

- **Client seed** — `PIPELINE_SEED` in `src/constants/pipeline.ts` held in `useState`
- Mutations stay in the browser until replaced with `withErp` API routes

## Files

| Layer | Path |
| --- | --- |
| Route (RSC) | `src/app/table/page.tsx` |
| Page (client) | `src/components/page/pipeline-page.tsx` |
| Features | `pipeline-table.tsx`, `pipeline-form-dialog.tsx`, `table-side-panels.tsx` |
| Copy + seed | `src/constants/pipeline.ts` |

## API

| Method | Path | Notes |
| --- | --- | --- |
| — | — | No server API; local state only |

## Status

`seed` — client-side CRUD demo.
