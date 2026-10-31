# Responsive

Mini apps run inside the ERP shell: desktop sidebar + mobile webview. Screen layouts must
work in both. Use the breakpoint scale `@erp/miniapp-ui` components use (`md`/`lg` Tailwind
breakpoints).

## Layout rules

1. **Single column forms** on mobile; multi-column only from `md` up.
2. **Avoid horizontal scroll** for primary flows.
3. **Drawers** on mobile where desktop uses dialogs/side panels.

## Example

```tsx
<div className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
  {/* fields */}
</div>
```

## Do

- Test critical flows at ~390px and ~1280px widths.
- Collapse secondary nav into sheets/drawers on small screens.

## Don't

- Don't hide essential actions behind hover-only affordances.
- Don't assume desktop pointer precision in the embedded shell.
