/**
 * Claude Code hooks (see .claude/settings.json). Other agents are covered by .githooks/pre-commit.
 *   post-edit  after Edit/Write: format the file, then lint it; lint errors go back to the agent
 *   stop       before the agent stops: if files changed, `bun run check` must pass
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = process.cwd();
const input = (() => {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return {};
  }
})();
const sh = process.platform === "win32";
const run = (cmd, args) => spawnSync(cmd, args, { cwd: root, encoding: "utf8", shell: sh });
const fail = (r) => {
  process.stderr.write(`${r.stdout}${r.stderr}`.split("\n").slice(-60).join("\n"));
  process.exit(2); // exit 2 = send stderr back to the agent
};

const mode = process.argv[2];

if (mode === "post-edit") {
  const file = input.tool_input?.file_path;
  if (!file) process.exit(0);
  const rel = relative(root, resolve(root, file)).replaceAll("\\", "/");
  const skip = /^(\.\.|node_modules|\.next|artifacts|openwiki|\.agents|\.claude)(\/|$)/;
  if (skip.test(rel) || !/\.(tsx?|jsx?|mjs|cjs|json|css)$/.test(rel)) process.exit(0);

  run("bunx", ["oxfmt", rel]);
  if (/\.(tsx?|jsx?|mjs|cjs)$/.test(rel)) {
    const lint = run("bunx", ["oxlint", "--deny-warnings", rel]);
    if (lint.status !== 0) fail(lint);
  }
} else if (mode === "stop") {
  if (input.stop_hook_active) process.exit(0); // already retried once; let the agent stop and report
  if (!run("git", ["status", "--porcelain"]).stdout?.trim()) process.exit(0); // nothing changed
  const check = run("bun", ["run", "check"]);
  if (check.status !== 0) fail(check);
}
