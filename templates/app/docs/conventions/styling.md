# Styling & colors

Rules for mini apps consuming `@erp/miniapp-ui`. Library components already use semantic
color tokens internally (`bg-primary`, `text-muted-foreground`, `bg-surface`, …) — use those
same tokens when composing library components; only app chrome (below) uses raw Tailwind
palette classes.

## App-only chrome (shell, sidebar)

Shell layout is **not** part of `@erp/miniapp-ui`. Style it with Tailwind palette
utilities written **directly** on each element:

```tsx
<aside className="… bg-sky-100 …">
<div className="… bg-sky-50/80 …">
<div className="… bg-white …">
```

### Avoid in mini apps

1. **Custom `:root` variables** such as `--app-sidebar`, `--app-canvas` — duplicates
   the design system and forces `bg-[var(--…)]` syntax.
2. **Palette constant objects** (`const SHELL = { … }`) — colors belong on the JSX
   element, not in an indirection layer.
3. **`bg-[var(--token)]`** for tokens that already have Tailwind classes.

Reference implementation: `src/components/app-shell.tsx`.

## Optional accent backgrounds

Feature cards may use light palette tints for KPI emphasis (`bg-sky-50`, `ring-sky-100/80`)
when paired with semantic text colors. Follow this app's and `../miniapp-workshop`'s
feature components.
