# AI skills

Load the relevant skill before generating or reviewing UI / ERP wiring.  
Entry points for agents: root [`AGENTS.md`](../../AGENTS.md) / [`CLAUDE.md`](../../CLAUDE.md).  
Engineering conventions: [`../conventions/`](../conventions/) · Copy-ready recipes: [`../recipes/`](../recipes/)

## UI (`@erp/miniapp-ui`)

| Skill | When |
| --- | --- |
| [styling.md](./styling.md) | Shell, sidebar, canvas, or any custom color in mini apps |
| [component.md](./component.md) | New feature/domain component |
| [page.md](./page.md) | New route / page orchestration (+ `docs.md` next to `page.tsx`) |
| [pattern.md](./pattern.md) | Reusable pattern composition |
| [recipe.md](./recipe.md) | Follow an existing recipe |
| [review.md](./review.md) | Review UI quality |
| [accessibility-review.md](./accessibility-review.md) | Accessibility review |
| [performance-review.md](./performance-review.md) | Performance review |
| [refactor.md](./refactor.md) | Replace local UI with `@erp/miniapp-ui` |

## ERP (`erp-sdk`)

Installed from the SDK itself into `.agents/skills/` (re-run `bunx erp skill install --dir .agents/skills` after upgrading `erp-sdk`).

| Skill | When |
| --- | --- |
| `erp-miniapp` | Boot `createMiniApp`, `schema.json`, initData / session, deploy contract |
| `erp-data` | Records, filters, relations, SQL, dashboards |
| `erp-tools` | Workflows, drive, task board |
| `erp-wiki` | ERP wiki retrieval and writing |

Env: [`.env.local.example`](../../.env.local.example).
