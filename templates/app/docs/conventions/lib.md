# Lib

Shared non-UI code under `src/lib/`.

## Layout

```text
lib/
  erp/       # createMiniApp, assertSchema, session, records helpers
  api/       # withAuth wrappers, list/create domain functions used by route handlers
  client/    # browser api() + initData bridge (may be imported only from client modules)
  date.ts    # todayISO / todayLocal — pure, safe on server and client
  format.ts  # display formatting (optional)
```

## Rules

1. Prefer **pure functions** with no React imports.
2. Server-only ERP secrets stay in `lib/erp` / API routes — never import `lib/erp/app` from client components.
3. Date helpers used by both API (`Production.Date`) and Assign form live in `lib/date.ts` — do not redefine `todayLocal` inside a page.
4. Domain types stay in `domain/` (or `lib/domain/`); `lib/api` imports them, pages import hooks that call `lib/client`.

```ts
// src/lib/date.ts
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Local calendar day for <input type="date"> */
export function todayLocal(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}
```
