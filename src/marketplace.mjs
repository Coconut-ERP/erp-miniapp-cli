import { existsSync, mkdirSync, openAsBlob, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { setTimeout as sleep } from "node:timers/promises";
import { readPackage } from "./files.mjs";
import { zip } from "./zip.mjs";

const DEFAULT_API = "https://cc-marketplace-api.mozyfin.com/api/v1";
const CONFIG = ".marketplace/config.json";

async function ask(question, { hidden = false } = {}) {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  // ponytail: mute echo for passwords by swallowing readline's writes after the prompt.
  if (hidden) rl._writeToOutput = (s) => s.includes(question) && process.stdout.write(s);
  try {
    return (await rl.question(question)).trim();
  } finally {
    if (hidden) process.stdout.write("\n");
    rl.close();
  }
}

/** Call the marketplace API and unwrap the `{success, message, data}` envelope. */
async function api(apiUrl, path, { token, ...init } = {}) {
  const res = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: { ...(token && { Authorization: `Bearer ${token}` }), ...init.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    const fields = body.data && typeof body.data === "object" ? ` ${JSON.stringify(body.data)}` : "";
    throw Object.assign(new Error(`${res.status} ${body.message ?? res.statusText}${fields}`), { status: res.status });
  }
  return body.data;
}

async function login(apiUrl, email, password) {
  const data = await api(apiUrl, "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return data.accessToken;
}

export function readConfig(cwd) {
  const path = join(cwd, CONFIG);
  if (!existsSync(path)) throw new Error("not set up — run `erp-miniapp marketplace init` first");
  return JSON.parse(readFileSync(path, "utf8"));
}

/** Ask for the publisher account, verify it, and save `.marketplace/config.json` (no secrets). */
export async function marketplaceInit({ cwd = process.cwd(), apiUrl } = {}) {
  readPackage(cwd);
  const prev = existsSync(join(cwd, CONFIG)) ? readConfig(cwd) : {};
  apiUrl = (apiUrl ?? prev.apiUrl ?? DEFAULT_API).replace(/\/$/, "");
  const email = (await ask(`Publisher email${prev.email ? ` (${prev.email})` : ""}: `)) || prev.email;
  if (!email) throw new Error("email is required");
  await login(apiUrl, email, await ask("Password: ", { hidden: true }));
  mkdirSync(join(cwd, ".marketplace"), { recursive: true });
  writeFileSync(join(cwd, CONFIG), `${JSON.stringify({ apiUrl, email }, null, 2)}\n`);
  console.log(`Logged in as ${email}. Saved ${CONFIG}`);
}

/** Description = README.md, minus a leading `# Title` line. */
export function readDescription(cwd) {
  const path = join(cwd, "README.md");
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^#[^\n]*\n+/, "").trim() : "";
}

/** Zip, re-auth with the password, upload, then wait for the build. */
export async function marketplacePublish({ cwd = process.cwd(), check = true } = {}) {
  const { apiUrl, email } = readConfig(cwd);
  const pkg = readPackage(cwd);
  if (!pkg.version) throw new Error('package.json needs a "version"');

  const archive = zip({ cwd, check });
  const password = await ask(`Password for ${email}: `, { hidden: true });
  let token = await login(apiUrl, email, password);

  const form = new FormData();
  form.set("file", await openAsBlob(archive), basename(archive));
  form.set("name", pkg.name);
  if (pkg.displayName) form.set("displayName", pkg.displayName);
  const description = readDescription(cwd);
  if (description) form.set("description", description);

  console.log(`Publishing ${pkg.name}@${pkg.version}...`);
  await api(apiUrl, "/packages/miniapp", { method: "POST", body: form, token });

  // ponytail: no timeout; builds queue one at a time, Ctrl+C is the escape hatch.
  for (;;) {
    await sleep(4000);
    // Access tokens last 15 min and a queued build can outlast that: log in again on 401.
    const data = await api(apiUrl, `/packages/miniapp/${pkg.name}`, { token }).catch(async (e) => {
      if (e.status !== 401) throw e;
      token = await login(apiUrl, email, password);
      return api(apiUrl, `/packages/miniapp/${pkg.name}`, { token });
    });
    const v = data.versions?.find((x) => x.version === pkg.version);
    if (v?.status === "ready") return console.log(`Ready: ${pkg.name}@${pkg.version} (${v.imageTag ?? v.hash})`);
    if (v?.status === "failed") {
      const log = await api(apiUrl, `/packages/miniapp/${pkg.name}/versions/${pkg.version}/log`, { token }).catch(() => null);
      if (log?.log) console.error(log.log);
      throw new Error(`build failed: ${v.message ?? "see log above"}`);
    }
    process.stdout.write(".");
  }
}
