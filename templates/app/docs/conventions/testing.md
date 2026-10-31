# Testing

Runner: `bun test` (`bun:test`). No extra framework, no jsdom — keep tests on pure logic.

```bash
bun test                  # all
bun test src/lib          # one folder
bun test --watch
```

## What to test

| Layer | Test? | How |
| --- | --- | --- |
| `src/lib/*` pure helpers (dates, formatting, state) | **Always** | Plain input → output |
| `src/lib/api/*` domain services | **Always** | Call the function; assert the returned DTO / thrown `ApiError` |
| `src/lib/erp/records.ts` mapping | Always | Feed raw records, assert DTOs. Do not hit a real ERP |
| `src/hooks/*` | When there is logic beyond `useQuery` | Extract the logic into `lib/`, test that |
| `src/constants/*` | No | Copy is not behavior |
| Route handlers | When they validate / branch | Call the exported handler with a `Request` |
| `*-page.tsx`, features | Prefer extracting the logic to `lib/`; test that | Visual checks via the browser, not unit tests |

## Rules

- Test **observable behavior**, not implementation (no call-shape assertions, no source greps). A behavior-preserving refactor must not break a test.
- Name tests by behavior: `treats only the persisted collapsed marker as collapsed`.
- A bug fix starts with a test that fails for the right reason, then passes.
- One owner per contract: do not replay the same assertion at every layer.
- No test-only exports or flags in production code. If you need one, test at a real boundary instead.
- Apply the `test-audit` skill (`.agents/skills/test-audit/SKILL.md`) before adding or reviewing tests.

## Layout

Co-locate: `src/lib/date.ts` → `src/lib/date.test.ts`.

```ts
import { expect, test } from "bun:test";
import { sameDay } from "./date";

test("matches ERP timestamps against a calendar day", () => {
  expect(sameDay("2026-01-05T09:30:00Z", "2026-01-05")).toBe(true);
});
```
