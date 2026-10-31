# Recipe: Login

## Goal
Authenticate the mini-app user (initData or form) and land on home.

## Steps
1. Layout with brand + `Card` form (`FormStack`, `Input`, `Button`).
2. On submit: call app auth API; show `Spinner` on button; toast errors.
3. Success: route to home; persist session per app rules.

## UI
`PageHeader` optional; prefer centered `Card` max-w-sm.

## Notes
ERP initData bridge is app/SDK concern — do not put secrets in the UI package.
