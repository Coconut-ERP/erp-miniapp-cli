import { spawnSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";

const REPO = "Coconut-ERP/erp-miniapp-cli";
const TARBALL = `https://github.com/${REPO}/releases/download/latest/erp-miniapp-cli.tgz`;

export const newer = (a, b) => {
  const [x, y] = [a, b].map((v) => v.replace(/^v/, "").split(".").map(Number));
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  return false;
};

export async function update() {
  const current = JSON.parse(readFileSync(new URL("../package.json", import.meta.url))).version;
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`could not check the latest release (HTTP ${res.status})`);
  const latest = (await res.json()).tag_name;
  if (!newer(latest, current)) return console.log(`already up to date (${current})`);

  // ponytail: bun vs npm guessed from the install path; other managers (pnpm, yarn) fall back to npm.
  const bun = realpathSync(process.argv[1]).includes("/.bun/");
  const [cmd, ...args] = bun ? ["bun", "add", "-g", TARBALL] : ["npm", "i", "-g", TARBALL];
  console.log(`updating ${current} -> ${latest.replace(/^v/, "")} (${cmd})`);
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) throw new Error(`${cmd} failed; run manually: ${cmd} ${args.join(" ")}`);
}
