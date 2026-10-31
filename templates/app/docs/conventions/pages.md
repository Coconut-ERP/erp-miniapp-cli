# Pages (Next.js App Router)

`page.tsx` stays a **Server Component**. Do not put `"use client"` on route files.

Interactive UI (hooks, React Query, forms, browser APIs) lives in a colocated client module under `components/page/`.

```text
src/app/factories/[id]/page.tsx          # server — params, compose
src/components/page/factory-detail-page.tsx  # "use client"
```

```tsx
// src/app/factories/[id]/page.tsx  — no "use client"
import { FactoryDetailPage } from "@/components/page/factory-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FactoryDetailPage factoryId={id} />;
}
```

```tsx
// src/components/page/factory-detail-page.tsx
"use client";
// hooks, tables, mutations…
```

## Rules

1. Route `page.tsx` / `layout.tsx`: server by default.
2. Client boundary only where needed — prefer `components/page/*-page.tsx`.
3. Pass route `params` / `searchParams` from the server page into the client page as props (avoid `useParams` when the server already has them).
4. `useSearchParams` still needs a client child + `<Suspense>` from the server page.
5. Providers (`QueryClientProvider`) stay in a client layout wrapper, not on every page.
6. **Early-return render** — one branch at a time (`isLoading` → `error` → empty → success). Do not stack `isLoading ? … : null` then `error ? … : null` then `data ? … : null` (avoids overlapping stale data + error).
7. **Copy from `constants/`** — titles, empty/error strings live in `src/constants/pages.ts` (see [constants](./constants.md)). Date helpers live in `src/lib/date.ts` (see [lib](./lib.md)).
8. **Extract feature UI** — rich list cards / sections belong in `components/features/`, not inline in `*-page.tsx` (see [folder](./folder.md)).

```tsx
import { FACTORIES_PAGE } from "@/constants/pages";

export function FactoriesPage() {
  const { data, isLoading, error, refetch } = useFactories();

  if (isLoading) {
    return (
      <>
        <PageHeader {...FACTORIES_PAGE.header} />
        <LoadingRows rows={4} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader {...FACTORIES_PAGE.header} />
        <ErrorState
          title={FACTORIES_PAGE.errorTitle}
          error={error}
          onRetry={() => void refetch()}
        />
      </>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <>
        <PageHeader {...FACTORIES_PAGE.header} />
        <EmptyState {...FACTORIES_PAGE.empty} />
      </>
    );
  }

  return (
    <>
      <PageHeader {...FACTORIES_PAGE.header} />
      {/* content */}
    </>
  );
}
```
