# Review checklist

- [ ] Uses `@erp/miniapp-ui` — no forked Button/Input
- [ ] Tokens only — no hard-coded brand colors (Styling)
- [ ] No `--app-*` shell vars or `bg-[var(--…)]` in mini apps
- [ ] Shell colors: Tailwind inline on JSX, not palette `const` objects
- [ ] Loading / empty / error covered
- [ ] Destructive actions use `ConfirmDialog`
- [ ] Icon-only controls labeled
- [ ] No API keys in client bundles
