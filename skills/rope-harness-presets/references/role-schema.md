# Rope Leaf Role Schema

Shared across harness writers. Parent/session role is **not** a preset row.

## Roles

| Role key | Agent name | Job | Default tools (pi) | Default thinking |
| --- | --- | --- | --- | --- |
| `implementer` | `rope-implementer` | Write, test, commit one unit of work from a self-contained brief | full write set: read, bash, edit, write, grep, find, ls (+ host equivalents) | `medium` |
| `reviewer` | `rope-reviewer` | End-of-issue behavior acceptance: Matrix walk over the assembled diff + high-risk boundaries; verdict owner. Code-only — the Standards axis is a separate scanner leaf (below), the product run belongs to the runner (ADR 0015) | read-only: read, bash, grep, find, ls | `high` |
| `runner` | `rope-e2e-runner` | E2E acceptance leaf: drives one real-entrypoint journey on the parent's shared stack; evidence, not fixes (ADR 0015) | read-only code + product surface: read, bash, grep, find, ls (+ the host browser family, e.g. `agent_browser*`, when present) | `low` |
| `explore` | `rope-explore` | Read-only fact gathering / codebase navigation; **research mode** (brief-selected): external sources + findings persisted to `.rope/research/` (ADR 0011) | **unrestricted** host tool surface (web/search/fetch + write included) — mode discipline lives in the agent body, never in tool restriction | `low` |

## Shared leaf rules

1. Receive a self-contained brief + artifact paths + acceptance criteria.
2. Return a **short** summary plus paths/status only — not full traces.
3. **Must not spawn other agents / subagents.** No nested orchestration.
4. Do not expand scope beyond the brief.
5. Prefer filesystem artifacts (issue package, git) over chat history.

## Parent override

Presets pin default `model` + `thinking` (effort). The parent orchestrator may
override either field at spawn when risk warrants. Hosts that ignore per-agent
effort simply drop the field. Leaves do not self-pick effort as the primary
strategy.

## Naming

Harness-native agent type names are exactly:

- `rope-implementer`
- `rope-reviewer`
- `rope-e2e-runner`
- `rope-explore`

External research is a **mode of `rope-explore`** (ADR 0011), selected by
the brief — it is not a fifth agent. Default and scanner dispatches stay
read-only; a research brief may use web/search and write only a findings
artifact under `.rope/research/**`. The explore preset is generated with
an **unrestricted tool surface** — mode discipline lives in the agent
body. Preset-level tool restriction made research mode unreachable in
the field (2026-09-09: every grill research leaf degraded to a
general-purpose twin). If a host truly cannot grant the tools, run the
research brief on a generic worker and record the type used
(declared deviation).

The `rope-e2e-runner` is a deliberate fourth leaf (ADR 0015): its job —
operating real entrypoints on a booted product and gathering evidence —
is orthogonal to code judgment (reviewer) and code writing (implementer).
Splitting it keeps the review gate read-only and cheap while the expensive
real-environment walk runs once, after review, on the delivery HEAD. The
no-spawn rule applies to it like every leaf.

The end-of-issue **scanner leaf** (ADR 0010) is the `rope-explore` agent
spawned with the Standards brief — no separate agent file, no manifest
role; its model/thinking ride the explore preset.

Spawn example (pi / pi-subagents):

```text
Agent({ subagent_type: "rope-implementer", prompt: "<brief>" })
```
