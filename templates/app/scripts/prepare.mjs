// Point git at .githooks. Silent no-op outside a git checkout (e.g. the ERP deploy build).
import { execSync } from "node:child_process";

try {
  execSync("git config core.hooksPath .githooks", { stdio: "ignore" });
} catch {}
