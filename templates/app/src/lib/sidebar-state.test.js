import { expect, test } from "bun:test";
import { isSidebarCollapsed } from "./sidebar-state";

test("treats only the persisted collapsed marker as collapsed", () => {
  expect(isSidebarCollapsed("1")).toBe(true);
  expect(isSidebarCollapsed(null)).toBe(false);
  expect(isSidebarCollapsed("0")).toBe(false);
});
