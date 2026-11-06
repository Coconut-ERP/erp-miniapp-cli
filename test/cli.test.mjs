import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { unzipSync } from "fflate";
import { copyTemplate, titleCase } from "../src/init.mjs";
import { listFiles } from "../src/files.mjs";
import { render } from "../src/pack.mjs";
import { zip } from "../src/zip.mjs";
import { readDescription } from "../src/marketplace.mjs";

function project() {
  const dir = mkdtempSync(join(tmpdir(), "miniapp-"));
  const put = (rel, body = "x") => {
    mkdirSync(join(dir, rel, ".."), { recursive: true });
    writeFileSync(join(dir, rel), body);
  };
  put("package.json", JSON.stringify({ name: "demo", version: "1.2.3", scripts: { start: "next start" } }));
  put("schema.json", "{}");
  put("src/a.ts", "export const a = 1;\n");
  put("src/fence.md", "```ts\ncode\n```\n");
  put("src/blob.bin", "a\0b");
  put(".env.local", "ERP_API_KEY=secret");
  put(".env.local.example", "ERP_API_KEY=erp_sk_...");
  put("bun.lock", "lock");
  put("node_modules/dep/index.js", "x");
  put(".next/cache", "x");
  put(".agents/skills/s/SKILL.md", "x");
  put(".marketplace/config.json", "{}");
  return dir;
}

test("deploy file list drops secrets, deps, build output and agent folders", () => {
  assert.deepEqual(listFiles(project()), [
    ".env.local.example",
    "package.json",
    "schema.json",
    "src/a.ts",
    "src/blob.bin",
    "src/fence.md",
  ]);
});

test("zip writes a named archive without secrets and keeps schema.json", () => {
  const dir = project();
  const out = zip({ cwd: dir });
  assert.match(out, /artifacts\/demo-v1\.2\.3-\d{8}\.zip$/);
  const names = Object.keys(unzipSync(readFileSync(out)));
  assert.ok(names.includes("schema.json"));
  assert.ok(!names.some((n) => n.startsWith(".env.local") && !n.endsWith(".example")));
  assert.ok(!names.some((n) => n.includes("node_modules")));
});

test("zip refuses a project that cannot be started", () => {
  const dir = mkdtempSync(join(tmpdir(), "miniapp-"));
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "x", version: "1.0.0" }));
  assert.throws(() => zip({ cwd: dir }), /start/);
});

test("pack lists files, skips binaries, and out-fences embedded code blocks", () => {
  const { markdown } = render(project());
  assert.match(markdown, /## src\/a\.ts\n\n```ts\nexport const a = 1;\n```/);
  assert.match(markdown, /````md\n```ts\ncode\n```\n````/);
  assert.match(markdown, /- src\/blob\.bin \(binary\)/);
  assert.doesNotMatch(markdown, /secret/);
});

test("template copy fills placeholders and renames _gitignore", () => {
  const from = mkdtempSync(join(tmpdir(), "tpl-"));
  const to = join(mkdtempSync(join(tmpdir(), "out-")), "app");
  writeFileSync(join(from, "_gitignore"), "node_modules\n");
  writeFileSync(join(from, "a.md"), "# {{title}} ({{name}})");
  copyTemplate(from, to, { name: "my-app", title: titleCase("my-app") });
  assert.equal(readFileSync(join(to, "a.md"), "utf8"), "# My App (my-app)");
  assert.equal(readFileSync(join(to, ".gitignore"), "utf8"), "node_modules\n");
});

test("marketplace description is the README without its title", () => {
  const dir = project();
  assert.equal(readDescription(dir), "");
  writeFileSync(join(dir, "README.md"), "# Demo\n\nDoes **things**.\n");
  assert.equal(readDescription(dir), "Does **things**.");
});
