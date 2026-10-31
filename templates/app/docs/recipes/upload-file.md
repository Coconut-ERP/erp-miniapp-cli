# Recipe: Upload file

## Goal
Pick a file, upload via app API; show filename + progress + toast.

## Steps
1. Read `@erp/miniapp-ui` `docs/patterns/upload.mdx`. Feature UI: hidden `<input type="file">` via `Button asChild` + `Label`; show selected filename.
2. Uploading: `Spinner` on button; success toast; `FieldError` or toast on failure.
3. `FormData` POST `/api/...` in `src/hooks/`; validate + store in route handler + `src/lib/api/`.

## Notes
Storage and credentials stay server-side — compose `@erp/miniapp-ui` only, no local upload primitive.
