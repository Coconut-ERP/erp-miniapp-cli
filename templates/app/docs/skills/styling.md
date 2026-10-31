# Skill: Styling & colors (mini apps)

Load this skill before editing **app chrome** (shell, sidebar, canvas) or any custom
layout color in a mini app. Applies to `examples/miniapp-*`, not to library source
under `packages/miniapp-ui/src/`.

## Two layers — do not mix them up

| Layer | Where | How to color |
| --- | --- | --- |
| **Library UI** | `@erp/miniapp-ui` components (`Button`, `Card`, `PageHeader`, `AppSidebar`, …) | Semantic tokens only — see below |
| **App chrome** | Mini-app shell composition (`app-shell.tsx`) | Prefer library patterns; optional Tailwind tints **inline** on wrappers |

Library tokens live in `@erp/miniapp-ui/styles.css`. Mini apps **must not** add
parallel `:root { --app-* }` variables for shell colors.

## Library components — semantic tokens

Read `docs/foundations/colors.md` first.

**Do:**

```tsx
<div className="bg-surface text-foreground">
  <p className="text-muted-foreground">Helper</p>
  <Button variant="secondary">Action</Button>
  <StatisticCard className="bg-muted/40 ring-1 ring-border/60" />
</div>
```

**Don't:**

- `bg-[var(--primary)]`, `text-[var(--muted-foreground)]` — use `bg-primary`, `text-muted-foreground`
- `oklch(...)`, `#hex` in class strings
- New `:root` CSS variables in the mini app for brand colors
- `const SHELL = { sidebar: "bg-sky-100", … }` or any color palette object — put classes directly on elements

## App chrome (sidebar, canvas, panel)

**Prefer `AppSidebar`** for mini-app nav chrome (soft rail, `items` + `activeId`).
Use low-level `Sidebar*` only when you need collapse / icon rail / offcanvas from the compound API.

Pattern: `src/components/app-shell.tsx`. Docs: `docs/patterns/app-sidebar.md`.

```tsx
import Link from "next/link";
import { AppSidebar, type AppSidebarItem } from "@erp/miniapp-ui";

const items: AppSidebarItem[] = [
  { id: "/", label: "Overview", href: "/", icon: <LayoutTemplateIcon /> },
];

<div className="flex h-dvh overflow-hidden bg-muted/40 p-3 md:p-4">
  <AppSidebar
    items={items}
    activeId={pathname}
    logo={…}
    renderLink={({ item, className, children, isActive, onClick }) => (
      <Link href={item.href ?? "#"} className={className} aria-current={isActive ? "page" : undefined} onClick={onClick}>
        {children}
      </Link>
    )}
  />
  <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] bg-background shadow-sm">
    {children}
  </div>
</div>
```

Mobile: wrap a second `AppSidebar` in library `Sheet` (see kit `app-shell.tsx`) — do not hand-roll a custom drawer nav.

Default chrome uses semantic tokens (`bg-muted/40`, `bg-background`, `text-muted-foreground`, …).
Optional brand tints: only as inline `className` — never `--app-*` or palette `const`s.

**Don't:**

```tsx
// ❌ Custom CSS variables
bg-[var(--app-sidebar)]
:root { --app-canvas: … }

// ❌ Palette constant object
const SHELL = { canvas: "bg-sky-50/80", … } as const;
className={SHELL.canvas}

// ❌ Fork low-level Sidebar* just to get the soft AppSidebar look
```

## Accent tints on library components

Occasional stat/card tints (`bg-sky-50`, `bg-violet-50`) are OK for **one-off emphasis**
inside feature components. Keep text readable; prefer semantic tokens for default surfaces.

## Checklist before finishing

- [ ] Shell uses `AppSidebar` (or intentional low-level `Sidebar*`) from `@erp/miniapp-ui`
- [ ] No `--app-*` (or similar) variables in mini-app `globals.css`
- [ ] No `bg-[var(--…)]` / `text-[var(--…)]` in mini-app components
- [ ] No color palette `const` objects — classes inline on JSX
- [ ] Library primitives use `primary`, `muted`, `border`, `surface`, … not raw palette for defaults
- [ ] `@import "@erp/miniapp-ui/styles.css"` still present in app `globals.css`

See also: `docs/conventions/styling.md`, `docs/patterns/app-sidebar.md`, `docs/components/sidebar.md`.
