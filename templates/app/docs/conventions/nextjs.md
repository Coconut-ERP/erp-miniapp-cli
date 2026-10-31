# Next.js best practices

The installed Next.js ships its own version-matched docs: **`node_modules/next/dist/docs/01-app/`**. They override anything you remember. Read the matching guide before writing the code, not after it fails.

## Doc map (read before you write)

Paths are relative to `node_modules/next/dist/docs/01-app/`.

| Task | Read |
| --- | --- |
| Server vs Client Components, where `"use client"` goes | `01-getting-started/05-server-and-client-components.md`, `02-guides/server-and-client-boundary.md`, `03-api-reference/01-directives/use-client.md` |
| Fetching data, parallel fetches, streaming | `01-getting-started/06-fetching-data.md`, `03-api-reference/03-file-conventions/loading.md`, `02-guides/streaming.md` |
| Mutating data, forms, Server Actions | `01-getting-started/07-mutating-data.md`, `02-guides/forms.md`, `02-guides/server-actions.md` |
| Caching and revalidation | `01-getting-started/08-caching.md`, `01-getting-started/09-revalidating.md`, `03-api-reference/01-directives/use-cache.md` |
| Route Handlers (`app/api/*`) | `01-getting-started/15-route-handlers.md`, `03-api-reference/03-file-conventions/route.md` |
| Proxy (formerly middleware) | `01-getting-started/16-proxy.md`, `03-api-reference/03-file-conventions/proxy.md` |
| Errors, 404s | `01-getting-started/10-error-handling.md`, `03-api-reference/03-file-conventions/error.md`, `not-found.md` |
| Dynamic routes, `params`, `searchParams` | `03-api-reference/03-file-conventions/dynamic-routes.md`, `page.md` |
| Images, fonts, metadata | `01-getting-started/12-images.md`, `13-fonts.md`, `14-metadata-and-og-images.md` |
| Env vars, secrets, data leaks | `02-guides/environment-variables.md`, `02-guides/data-security.md` |
| Auth | `02-guides/authentication.md` |
| Before shipping | `02-guides/production-checklist.md` |
| Debugging the dev server | `02-guides/debugging.md`, `02-guides/mcp.md` |

Other skills that apply: `vercel-react-best-practices` (performance rules, ranked by impact), `vercel-composition-patterns` (component APIs), `next-dev-loop` (verify in the running app).

## Rules for this project

**Components**

1. Everything is a Server Component unless it needs state, effects, event handlers or browser APIs. `app/**/page.tsx` and `layout.tsx` are never `"use client"` — they render a client page from `src/components/page/`.
2. Push `"use client"` down to the smallest leaf. Pass Server Components to Client Components as `children`/props instead of importing them into a client file.
3. Props crossing the server → client boundary must be serializable (no functions or class instances).
4. Never write an `async` Client Component.

**Data**

5. Request-time APIs are async in this version: `await params`, `await searchParams`, `await cookies()`, `await headers()`.
6. Fetch on the server where the data is needed. Independent requests run in parallel (`Promise.all`); no sequential `await` waterfalls.
7. Do not call this app's Route Handlers from Server Components — call the service function in `src/lib/api/` directly. Route Handlers exist for the browser (React Query via `src/lib/client/api.ts`).
8. Stream slow parts: `loading.tsx` per segment or `<Suspense>` around the slow component, with a skeleton from `@erp/miniapp-ui`.
9. Caching is opt-in per the installed version's docs. Read `08-caching.md` before adding `use cache`, `revalidate`, `revalidateTag` or `fetch` cache options; never copy a caching snippet from memory.
10. Mutations: validate input on the server (Route Handler or Server Action), then toast + invalidate React Query on the client. A Server Action must authenticate and authorize **inside** the action — layout or proxy checks are not enough.

**Security**

11. `erp-sdk`, `src/lib/erp/*` and `src/lib/api/*` are server-only. Lint blocks importing them from `src/components`, `src/hooks` and `src/lib/client`. Keep it that way; do not add exceptions.
12. Secrets (`ERP_API_KEY`, anything `erp_sk_…`) only in server env. Only non-secret values may be `NEXT_PUBLIC_*`. Never log or return them.
13. Validate and narrow every Route Handler input (params, query, body); return `Response.json({ error }, { status })` through the existing `withApi` / `withErp` helpers.

**Framework features**

14. `next/link` for internal navigation, `next/image` for images (set `width`/`height` or `fill`), `next/font` for fonts, `next/script` for third-party scripts. Lint blocks `<a href="/…">` and `<img>`.
15. Titles and descriptions through the Metadata API (`export const metadata` / `generateMetadata`), per route.
16. `src/app/error.tsx` and `not-found.tsx` are the app-wide fallbacks (copy in `src/constants/errors.ts`). Add a segment-level `error.tsx` / `not-found.tsx` where a route can fail or miss differently; call `notFound()` for a missing id.
17. The ERP deploy runs `next start` on `$PORT` (see the `erp-miniapp` skill → deploy). Do not add a custom server or `output: "export"`; the app must run with `next start`.
18. `middleware.ts` is `proxy.ts` in Next 16. Prefer not to add one; see `16-proxy.md` first.

## Verify (a type-check is not enough)

1. `bun run check` — format, lint (incl. Next + a11y rules), typecheck, tests.
2. Run `bun run dev` and check the change at runtime: Next.js MCP (`get_errors`, `get_compilation_issues`, `compile_route`) or the `next-dev-loop` skill. Browser console errors are forwarded to the dev terminal.
3. Route, layout, config, API or prerendering change → also `bun run build` and read its route table (static `○` vs dynamic `ƒ` should match intent).
