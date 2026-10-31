import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { zipSync } from "fflate";
import { listFiles, readPackage, stamp } from "./files.mjs";

/** Zip the project for ERP deploy. Returns the archive path. */
export function zip({ cwd = process.cwd(), out, check = true } = {}) {
  const pkg = readPackage(cwd);
  if (!pkg.scripts?.start) throw new Error('package.json needs a "start" script (ERP runs `npm start`)');

  // Never ship a build that fails format / lint / typecheck / tests.
  if (check && pkg.scripts?.check) {
    const r = spawnSync("bun", ["run", "check"], { cwd, stdio: "inherit", shell: process.platform === "win32" });
    if (r.status !== 0) throw new Error("`bun run check` failed — fix it, or pass --no-check to skip");
  }

  const files = listFiles(cwd);
  const entries = Object.fromEntries(files.map((f) => [f, readFileSync(join(cwd, f))]));
  const target = resolve(cwd, out ?? `artifacts/${pkg.name}-v${pkg.version}-${stamp()}.zip`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, zipSync(entries, { level: 9 }));
  console.log(`Created deploy archive (${files.length} files): ${target}`);
  if (!files.includes("schema.json")) console.warn("note: no schema.json — the app declares no tables");
  return target;
}
