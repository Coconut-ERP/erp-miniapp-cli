# erp-miniapp-cli

CLI that replaces the `erp-miniapp-template` repo: scaffold a mini app, zip it for deploy, pack the code.

Not published to npm. Every release is a tarball attached to a [GitHub Release](https://github.com/Coconut-ERP/erp-miniapp-cli/releases):

```bash
npm  i -g https://github.com/Coconut-ERP/erp-miniapp-cli/releases/download/latest/erp-miniapp-cli.tgz
bun  add -g https://github.com/Coconut-ERP/erp-miniapp-cli/releases/download/latest/erp-miniapp-cli.tgz
erp-miniapp init      # asks for a name, then scaffolds (like create-next-app)
```

`latest` is re-pointed at every release; use `.../download/v0.1.0/erp-miniapp-cli.tgz` to pin a version. From a local checkout: `npm i -g .`.

Requires Node ≥ 20, [Bun](https://bun.sh), git, and network access (package install + resolving the latest `erp-sdk` / `erp-miniapp-ui` releases).

| Command | What it does |
| --- | --- |
| `erp-miniapp init [name] [--skip-install]` | Next.js + Bun, latest `erp-sdk` and `@erp/miniapp-ui`, Oxlint + Oxfmt + `@shadcn/lint`, `bun test`, starter pages, `AGENTS.md`, skills, OpenWiki for agents |
| `erp-miniapp zip [-o file] [--no-check]` | Runs `bun run check`, then zips the source for ERP deploy → `artifacts/<name>-v<version>-<date>.zip` (leaves out `node_modules`, `.next`, `.git`, `.env*`, lockfiles, `.agents`, `.claude`, `.marketplace`) |
| `erp-miniapp marketplace init [--api url]` | Asks for the publisher email + password, verifies the login, saves `.marketplace/config.json` (`apiUrl`, `email`; no password or token) |
| `erp-miniapp marketplace publish [--no-check]` | Runs `zip`, asks for the password again, uploads to the marketplace (`name`, `displayName`, `version` from `package.json`, description from `README.md`), then waits for the build and prints the log if it fails |
| `erp-miniapp pack [-o file]` | Packs the whole codebase into one Markdown file (file tree + contents) to hand to an LLM → `artifacts/<name>-code-<date>.md` |

## What `init` does

1. Copies `templates/app` (replacing `{{name}}` and `{{title}}`); `package.json` is generated in code.
2. Runs `bun add` for the latest version of every package, with no version pins. `erp-sdk` and `@erp/miniapp-ui` come from their GitHub `latest` release tarballs (pinned fallback if the API is unreachable).
3. Installs skills into `.agents/skills/` (symlinked into `.claude/skills/`): `erp-miniapp`, `erp-data`, `erp-tools`, `erp-wiki` (from `erp-sdk`, matching the installed version), `design-taste-frontend`, `vercel-react-best-practices`, `vercel-composition-patterns`, `next-dev-loop`, `test-audit`, `ponytail`, `grilling`, `grill-me`, `openwiki`.
4. Runs `openwiki integrations install claude|codex|cursor --project`. There is no CI/CD: `AGENTS.md` makes agents update docs and the wiki in the same change as the code, and always write unit tests.
5. Enforces `bun run check` (format, lint, typecheck, tests) through Claude Code hooks and `erp-miniapp zip`; the git `pre-commit` hook skips tests.
6. Runs `git init` and `oxfmt`.

## Changing the template

`templates/app` is the starter project; `templates/skills` holds vendored skills (not the ones that ship with `erp-sdk`). After editing, run `npm test` (covers zip, pack and template copy), then run `erp-miniapp init` in a scratch directory and `bun run check` in the result.

## Releasing

`.github/workflows/release.yml` (same scheme as `erp-sdk`):

```bash
npm version 0.2.0 --no-git-tag-version   # bump package.json, commit it
git push && git tag v0.2.0 && git push origin v0.2.0
```

The tag must equal `package.json`'s version. The workflow runs the tests, packs `erp-miniapp-cli.tgz`, smoke-tests the tarball itself (npm and bun: `--version`, then `init --skip-install` and a check that every dotfile the generated project needs survived packing), then publishes a GitHub Release and re-points the `latest` release. **Actions ▸ Release ▸ Run workflow** is a dry run that only uploads the tarball as an artifact.
