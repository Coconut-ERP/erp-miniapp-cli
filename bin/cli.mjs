#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { pack } from "../src/pack.mjs";
import { init } from "../src/init.mjs";
import { zip } from "../src/zip.mjs";

const HELP = `erp-miniapp <command>

  init [name] [--skip-install]   Scaffold a new mini app (asks for the name if omitted)
  zip  [-o file] [--no-check]    Run bun check, then zip the project for ERP deploy -> artifacts/
  pack [-o file]                 Pack the codebase into one Markdown file -> artifacts/

  -v, --version   -h, --help`;

const [cmd, ...args] = process.argv.slice(2);
const flag = (...names) => args.some((a) => names.includes(a));
const value = (...names) => {
  const i = args.findIndex((a) => names.includes(a));
  return i >= 0 ? args[i + 1] : undefined;
};

try {
  if (flag("-v", "--version") || cmd === "-v" || cmd === "--version") {
    console.log(JSON.parse(readFileSync(new URL("../package.json", import.meta.url))).version);
  } else if (cmd === "init") {
    const name = args.find((a, i) => !a.startsWith("-") && args[i - 1] !== "-o");
    await init({ name, skipInstall: flag("--skip-install") });
  } else if (cmd === "zip") {
    zip({ out: value("-o", "--out"), check: !flag("--no-check") });
  } else if (cmd === "pack") {
    pack({ out: value("-o", "--out") });
  } else {
    console.log(HELP);
    process.exitCode = cmd && !["-h", "--help", "help"].includes(cmd) ? 1 : 0;
  }
} catch (error) {
  console.error(`error: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
