# Constants

Static, serializable values used by pages and shell. Prefer `src/constants/*.ts`.

## Rules

1. **No React** — no JSX, no hooks, no `"use client"`.
2. **No I/O** — no `fetch`, no ERP client, no `process.env`.
3. Group by surface: `pages.ts` (headers / empty / error), `nav.ts` (shell links), `status.ts` (badges/labels).
4. Page early-returns import the same constant object so `PageHeader` copy is not duplicated by hand.
5. ERP **field display names** stay in `lib/erp/schema.ts` (`F`, `OBJECTS`) — not in `constants/`.

```ts
// src/constants/pages.ts
export const FACTORIES_PAGE = {
  header: {
    title: "Factories",
    description: "List of active factories…",
  },
  errorTitle: "Failed to load factory list",
  empty: {
    title: "No factories yet",
    description: "Create a Factory record in the workspace…",
  },
} as const;
```

```tsx
// components/page/factories-page.tsx
import { FACTORIES_PAGE } from "@/constants/pages";

if (isLoading) {
  return (
    <>
      <PageHeader {...FACTORIES_PAGE.header} />
      <LoadingRows rows={4} />
    </>
  );
}
```
