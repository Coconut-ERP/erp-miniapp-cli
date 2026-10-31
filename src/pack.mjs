import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { listFiles, readPackage, stamp } from "./files.mjs";

const MAX_BYTES = 200_000;

/** Longest backtick run in `text`, so the fence can be longer. */
const fenceFor = (text) => "`".repeat(Math.max(3, ...[...text.matchAll(/`+/g)].map((m) => m[0].length + 1)));

/** Render the project as one Markdown document: file tree, then every text file. */
export function render(cwd) {
  const pkg = readPackage(cwd);
  const files = [];
  const skipped = [];
  for (const rel of listFiles(cwd)) {
    const path = join(cwd, rel);
    if (statSync(path).size > MAX_BYTES) {
      skipped.push(`${rel} (too large)`);
      continue;
    }
    const buf = readFileSync(path);
    if (buf.subarray(0, 8000).includes(0)) {
      skipped.push(`${rel} (binary)`);
      continue;
    }
    files.push({ rel, text: buf.toString("utf8") });
  }

  const parts = [`# ${pkg.name} — codebase\n`, "## Files\n", ...files.map((f) => `- ${f.rel}`)];
  for (const { rel, text } of files) {
    const fence = fenceFor(text);
    const lang = rel.includes(".") ? rel.split(".").pop() : "";
    parts.push(`\n## ${rel}\n\n${fence}${lang}\n${text.replace(/\n$/, "")}\n${fence}`);
  }
  if (skipped.length) parts.push(`\n## Skipped\n\n${skipped.map((s) => `- ${s}`).join("\n")}`);
  return { markdown: `${parts.join("\n")}\n`, count: files.length, name: pkg.name };
}

/** Pack the codebase into one Markdown file. Returns the file path. */
export function pack({ cwd = process.cwd(), out } = {}) {
  const { markdown, count, name } = render(cwd);
  const target = resolve(cwd, out ?? `artifacts/${name}-code-${stamp()}.md`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, markdown);
  console.log(`Packed ${count} files (~${Math.round(markdown.length / 4000)}k tokens): ${target}`);
  return target;
}
