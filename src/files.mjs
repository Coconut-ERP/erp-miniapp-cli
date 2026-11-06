import { lstatSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Never ship: VCS, deps, build output, secrets, agent tooling.
const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "artifacts",
  "certificates",
  ".agents",
  ".claude",
  ".marketplace",
]);
const SKIP_FILE = /^(\.env(\..*)?|bun\.lockb?|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|\.DS_Store|Thumbs\.db|.*\.tsbuildinfo|next-env\.d\.ts)$/;
// .env.example / .env.local.example are templates, not secrets.
const isSecret = (name) => /^\.env/.test(name) && !name.endsWith(".example");

/** Project files as sorted POSIX-style relative paths. Symlinks are skipped. */
export function listFiles(root, dir = "") {
  const out = [];
  for (const name of readdirSync(join(root, dir)).sort()) {
    const rel = dir ? `${dir}/${name}` : name;
    const stat = lstatSync(join(root, rel));
    if (stat.isSymbolicLink()) continue;
    if (stat.isDirectory()) {
      if (!SKIP_DIRS.has(name)) out.push(...listFiles(root, rel));
    } else if (isSecret(name) || (SKIP_FILE.test(name) && !name.endsWith(".example"))) {
      continue;
    } else {
      out.push(rel);
    }
  }
  return out;
}

export function readPackage(root) {
  try {
    return JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  } catch {
    throw new Error("no package.json here — run this inside a mini app project");
  }
}

export const stamp = () => new Date().toISOString().slice(0, 10).replaceAll("-", "");
