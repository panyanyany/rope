# Rope Leaf Role Schema

Shared across harness writers. Parent/session role is **not** a preset row.

## Roles

| Role key | Agent name | Job | Default tools (pi) | Default thinking |
| --- | --- | --- | --- | --- |
| `implementer` | `rope-implementer` | Write, test, commit one unit of work from a self-contained brief | full write set: read, bash, edit, write, grep, find, ls (+ host equivalents) | `medium` |
| `reviewer` | `rope-reviewer` | End-of-issue behavior acceptance: Matrix walk over the assembled diff + high-risk boundaries; verdict owner. Code-only — the Standards axis is a separate scanner leaf (below), the product run belongs to the runner | read-only: read, bash, grep, find, ls | `high` |
| `runner` | `rope-e2e-runner` | E2E acceptance leaf: drives one real-entrypoint journey on the parent's shared stack; evidence, not fixes | read-only code + product surface: read, bash, grep, find, ls (+ the host browser family, e.g. `agent_browser*`, when present) | `low` |
| `explore` | `rope-explore` | Investigation and validation without product-code edits; **research mode** (brief-declared): external sources + findings persisted to `.rope/research/` | **unrestricted** host tool surface (web/search/fetch + write included) — mode discipline lives in the agent body, never in tool restriction | `medium` |

## Shared leaf rules

1. Receive a self-contained brief + artifact paths + acceptance criteria.
2. Return a **short** summary plus paths/status only — not full traces.
3. **Must not spawn other agents / subagents.** No nested orchestration.
4. Do not expand scope beyond the brief.
5. Prefer filesystem artifacts (issue package, git) over chat history.

Implementer bodies require reading brief-mapped effective spec/ADR sections
before product/test edits and recording the ≤3-line Architecture landing
(existing responsibility / public seam / preserved ownership-direction).
Return actual source-reading record references, the pre-edit record reference, and applicable Constraint
IDs checked. A source conflict stops the unit for parent resolution; slice-local
convenience never silently changes an effective specification.

Reviewer bodies require reading the applicable bundle/source sections upfront
and checking responsibility ownership, lifecycle, seams, dependency direction,
and every exception-list/guard-rule delta against confirmed dispositions.
Scanner briefs carry declared full architecture guard commands/evidence.
Execution details: [architecture gates](../../rope-go/references/architecture-gates.md).
These obligations must also travel in briefs so already-generated presets do
not need a refresh to execute the contract.

## Exploration and validation handoff

- Default unknown-answer searches, call-chain tracing, and diagnosis to an
  explore leaf. The parent may read a known location briefly and verify
  decisive evidence; no tool-call quota decides the handoff.
- Brief from symptoms: observed/expected behavior, reproduction entrypoint,
  relevant contracts and the question. A diagnosed root cause or file-level
  fix plan is not a dispatch prerequisite. The parent interprets findings,
  decides scope/contract changes, and re-briefs incomplete investigations
  instead of duplicating the leaf's search.
- The parent selects validation scope and evidence reuse. Delegate substantive
  baseline/integration checks to existing leaves; include the return contract
  below in their briefs. Reuse an already assigned check where appropriate,
  rather than add a worker for every command. Slice self-tests do not replace
  assembled validation. Product journeys remain the E2E runner's job.
- Check returns: tested commit and relevant environment, command, exit status,
  pass/fail counts and failing items, full-log path, and blockers. Save full
  logs at the briefed evidence location; return summaries, not traces. The
  parent decides failure disposition; unknown failures follow the diagnosis
  handoff above. Stack lifecycle remains parent-owned; check leaves do not
  start/restart services or edit code/tests to make a check pass.

These obligations travel in briefs; existing presets and generic fallback
workers must not depend on a preset refresh to follow them. The solo quick
path retains its own execution boundary.

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

External research is a **mode of `rope-explore`**, declared by the brief
— the brief is the contract. It is not a fifth agent. Default and
scanner dispatches stay
read-only; a research brief may use web/search and write only a findings
artifact under `.rope/research/**`. The explore preset is generated with
an **unrestricted tool surface** — mode discipline lives in the agent
body. Restricting tools at preset level can make research mode unreachable
and force generic-worker fallbacks. If a host truly cannot grant the tools, run the
research brief on a generic worker and record the type used
(declared deviation).

The `rope-e2e-runner` is a deliberate fourth leaf: its job —
operating real entrypoints on a booted product and gathering evidence —
is orthogonal to code judgment (reviewer) and code writing (implementer).
Splitting it keeps the review gate read-only and cheap while the expensive
real-environment walk runs once, after review, on the delivery HEAD. The
no-spawn rule applies to it like every leaf.

The end-of-issue **scanner leaf** is the `rope-explore` agent
spawned with the Standards brief — no separate agent file, no manifest
role; its model/thinking ride the explore preset.

Spawn example (pi / pi-subagents):

```text
Agent({ subagent_type: "rope-implementer", prompt: "<brief>" })
```
