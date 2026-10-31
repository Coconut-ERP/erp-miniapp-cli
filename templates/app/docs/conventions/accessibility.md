# Accessibility convention

PR checklist for mini-app screens built with `@erp/miniapp-ui`. Library components already
guarantee baseline a11y (labels, focus rings, keyboard); this checklist covers what the app
layer must add on top. See also the general PR checklist at [review](./review.md).

## Review checklist

- [ ] Tab through the view — no traps except intentional modal traps
- [ ] Screen-reader label present for icon buttons
- [ ] Errors associated with fields
- [ ] Contrast OK for text and focus ring on surfaces used
