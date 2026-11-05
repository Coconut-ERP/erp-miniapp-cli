import { spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const TEMPLATES = fileURLToPath(new URL("../templates", import.meta.url));
const NAME_RE = /^[a-z][a-z0-9-]*$/;

// Used only when the GitHub API is unreachable (rate limit, offline).
const FALLBACK = {
  "Coconut-ERP/erp-sdk": "https://github.com/Coconut-ERP/erp-sdk/releases/download/v0.5.9/erp-sdk.tgz",
  "Coconut-ERP/erp-miniapp-ui":
    "https://github.com/Coconut-ERP/erp-miniapp-ui/releases/download/v0.10.1/erp-miniapp-ui-0.10.1.tgz",
};

// No version ranges on purpose: `bun add <name>` resolves the latest release of everything.
const DEPS = ["next", "react", "react-dom", "@tanstack/react-query", "@tanstack/react-table", "lucide-react", "sonner"];
const DEV_DEPS = [
  "typescript",
  "@types/node",
  "@types/react",
  "@types/react-dom",
  "@types/bun", // types for bun:test
  "tailwindcss",
  "@tailwindcss/postcss",
  "oxlint",
  "oxfmt",
  "@shadcn/lint",
];
const OPENWIKI_HOSTS = ["claude", "codex", "cursor"];

export const titleCase = (name) =>
  name
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

function isText(buf) {
  return !buf.subarray(0, 8000).includes(0);
}

/** Copy `from` into `to`, replacing {{name}} / {{title}} in text files. `_gitignore` -> `.gitignore`. */
export function copyTemplate(from, to, vars) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const src = join(from, entry.name);
    const dst = join(to, entry.name === "_gitignore" ? ".gitignore" : entry.name);
    if (entry.isDirectory()) {
      copyTemplate(src, dst, vars);
      continue;
    }
    const buf = readFileSync(src);
    writeFileSync(
      dst,
      isText(buf)
        ? buf.toString("utf8").replaceAll("{{name}}", vars.name).replaceAll("{{title}}", vars.title)
        : buf,
    );
  }
}

function run(cmd, args, cwd, { soft = false, quiet = false } = {}) {
  const r = spawnSync(cmd, args, { cwd, stdio: quiet ? "ignore" : "inherit", shell: process.platform === "win32" });
  if (r.status !== 0 && !soft) throw new Error(`\`${cmd} ${args.join(" ")}\` failed`);
  return r.status === 0;
}

function capture(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8", shell: process.platform === "win32" });
  return r.status === 0 ? r.stdout.trim() : null;
}

async function latestTarball(repo) {
  try {
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: token ? { authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(String(res.status));
    const release = await res.json();
    const asset = release.assets.find((a) => a.name.endsWith(".tgz"));
    if (!asset) throw new Error("no .tgz asset");
    return asset.browser_download_url;
  } catch (e) {
    console.warn(`! could not resolve latest ${repo} (${e.message}); using pinned ${FALLBACK[repo]}`);
    return FALLBACK[repo];
  }
}

async function askName() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question("Mini app name (kebab-case): ")).trim();
  } finally {
    rl.close();
  }
}

/** Link every .agents/skills/<name> into .claude/skills (relative symlink, junction on Windows, copy if refused). */
function mirrorSkills(dir) {
  const from = join(dir, ".agents/skills");
  const to = join(dir, ".claude/skills");
  mkdirSync(to, { recursive: true });
  for (const name of readdirSync(from)) {
    const link = join(to, name);
    if (existsSync(link)) continue;
    try {
      if (process.platform === "win32") symlinkSync(resolve(from, name), link, "junction");
      else symlinkSync(join("..", "..", ".agents", "skills", name), link);
    } catch {
      cpSync(join(from, name), link, { recursive: true });
    }
  }
}

export async function init({ name, skipInstall = false, cwd = process.cwd() } = {}) {
  name ??= await askName();
  if (!NAME_RE.test(name)) {
    throw new Error(`"${name}" is not a valid name — use lowercase letters, digits and dashes, starting with a letter`);
  }
  const dir = resolve(cwd, name);
  if (existsSync(dir) && readdirSync(dir).length) throw new Error(`${dir} already exists and is not empty`);
  if (!skipInstall && !capture("bun", ["--version"])) {
    throw new Error("bun is required — install it from https://bun.sh");
  }

  console.log(`\nCreating ${name} in ${dir}\n`);
  copyTemplate(join(TEMPLATES, "app"), dir, { name, title: titleCase(name) });
  cpSync(join(TEMPLATES, "skills"), join(dir, ".agents/skills"), { recursive: true });

  const bunVersion = capture("bun", ["--version"]);
  writeFileSync(
    join(dir, "package.json"),
    `${JSON.stringify(
      {
        name,
        version: "0.1.0",
        private: true,
        description: `${titleCase(name)} — ERP mini app`,
        engines: { node: ">=20" },
        scripts: {
          dev: "next dev",
          "dev:https": "next dev --experimental-https",
          build: "next build",
          start: "next start",
          lint: "oxlint --deny-warnings",
          "lint:fix": "oxlint --fix",
          format: "oxfmt",
          "format:check": "oxfmt --check",
          typecheck: "tsc --noEmit",
          test: "bun test",
          check: "bun run format:check && bun run lint && bun run typecheck && bun test",
          prepare: "node scripts/prepare.mjs",
          schema: "bun run scripts/schema.ts",
          zip: "erp-miniapp zip",
          pack: "erp-miniapp pack",
        },
        ...(bunVersion && { packageManager: `bun@${bunVersion}` }),
      },
      null,
      2,
    )}\n`,
  );

  run("git", ["init", "-q"], dir, { soft: true });
  chmodSync(join(dir, ".githooks/pre-commit"), 0o755);
  run("git", ["config", "core.hooksPath", ".githooks"], dir, { soft: true });

  if (skipInstall) {
    mirrorSkills(dir);
    console.log("\nSkipped install (--skip-install). Run `bun install` yourself.");
    return dir;
  }

  const [sdk, ui] = await Promise.all([
    latestTarball("Coconut-ERP/erp-sdk"),
    latestTarball("Coconut-ERP/erp-miniapp-ui"),
  ]);
  run("bun", ["add", ...DEPS, ui, sdk], dir);
  run("bun", ["add", "-d", ...DEV_DEPS], dir);

  // Skills that ship inside erp-sdk (erp-miniapp, erp-data, erp-tools, erp-wiki) match the installed version.
  run("bunx", ["erp", "skill", "install", "--dir", ".agents/skills"], dir, { soft: true, quiet: true });

  // Agent integration for the repo wiki. Agents update it as part of each change (see AGENTS.md); no CI job.
  const openwiki = capture("openwiki", ["--version"]) ? ["openwiki"] : ["npx", "-y", "openwiki"];
  for (const host of OPENWIKI_HOSTS) {
    const ok = run(openwiki[0], [...openwiki.slice(1), "integrations", "install", host, "--project"], dir, {
      soft: true,
    });
    if (!ok) console.warn(`! openwiki integration for ${host} failed — run it later in ${name}`);
  }

  mirrorSkills(dir); // after every installer has written its skills
  run("bunx", ["oxfmt"], dir, { soft: true });

  console.log(`
Done. Next:

  cd ${name}
  cp .env.local.example .env.local     # ERP_BASE_URL + ERP_API_KEY
  bun run dev

Repo wiki (once): npm i -g openwiki, restart your agent, then ask it
"Initialize this repository's OpenWiki from the current source and tests."
`);
  return dir;
}
