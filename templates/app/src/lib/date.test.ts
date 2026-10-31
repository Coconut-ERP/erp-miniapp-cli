import { expect, test } from "bun:test";
import { addDaysLocal, sameDay } from "./date";

test("matches ERP timestamps against a calendar day", () => {
  expect(sameDay("2026-01-05T09:30:00Z", "2026-01-05")).toBe(true);
  expect(sameDay("2026-01-06", "2026-01-05")).toBe(false);
  expect(sameDay(null, "2026-01-05")).toBe(false);
});

test("adds days across a month boundary", () => {
  expect(addDaysLocal("2026-01-31", 1)).toBe("2026-02-01");
  expect(addDaysLocal("2026-03-01", -1)).toBe("2026-02-28");
});
