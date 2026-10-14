---
name: rope-shape
description: Shapes clarified requirements into a .rope issue package with PRD, slices, matrix, and E2E. Use after rope-grill, or when the user wants shape / 出 PRD / 拆切片 under .rope/issues.
---

# Rope Shape

Parent Orchestrator: turn a clarified requirement into an **issue package**
(`.rope/issues/<slug>/{prd,tasks,e2e}.md`). Not a `.rope/specs/` architecture
doc — keep **issue / PRD / slice** vocabulary.

Templates: [references/issue-package.md](references/issue-package.md).
Seam placement vocabulary: [references/seam-design.md](references/seam-design.md).
Architecture impact and Constraint Bundle: [references/architecture-continuity.md](references/architecture-continuity.md).
E2E classes, gates, graph vocabulary: [references/gates-and-vocab.md](references/gates-and-vocab.md).

Default handoff: same-session `rope-go`.

## Workflow

1. Read CONTEXT, routes, architecture continuity, and relevant
   adr/research/specs.
2. Inspect only enough for public interfaces and verification **seams**
   (explore leaf if wide). Seed `<issue>/map.md` from what exploration
   learned — one fact per line, each with a file path and a date; later
   leaves orient by it and update the lines they falsify.
3. Fill missing `routes.md` repo contracts (existing repos join here without
   re-running rope-init):
   - `Worktree setup:` — ask the user how a fresh worktree becomes testable;
     prefer a check-first idempotent script, or `host-managed`.
   - `Test tiers:` — derive per go's execution-rules criteria (zero-human;
     timing budget and derivation note there, never duplicated here).
   - `Test policy:` — `fast-iteration` | `full-at-freeze`; missing is legal
     and means the ladder decides.
4. Probe whether this harness can spawn an isolated (worktree) subagent;
   record `Execution mode: worktree | shared` in the tasks.md header (one
   line on how verified). Go consumes it; a capability mismatch at go
   degrades to shared with a recorded reason.
5. Architecture Impact trigger check (architecture-continuity.md): record
   `required`, or `not-applicable` with the lightweight check. For
   `required`, read effective source sections **before slicing** and record
   every source status, disposition, invariant, forbidden shortcut, evidence,
   scope, and conflict; no source found ⇒ risk-reviewed New decision candidate.
   Confirm high-risk candidates, supersedes, exceptions, and conflicts with user.
6. **Slice outline quiz:** title, user-visible delivery, `Blocked by`,
   matrix rows, constraint IDs, evidence → iterate until approved → then
   write full files.
7. **Research record gate:** PRD cites `.rope/research/` findings or records
   `research: not-needed` + reason — neither present ⇒ return to grill.
   Write `prd.md`, `tasks.md`, and `e2e.md` per templates. Each slice carries
   mandatory Constraint IDs, required source paths/sections, and Architecture
   landing evidence; Testing Decisions declares architecture guards and
   exception paths. Apply package readiness gate before handoff. Slicing hard
   rules and evidence projection live in [gates-and-vocab.md](references/gates-and-vocab.md)
   and [architecture-continuity.md](references/architecture-continuity.md).
8. **Graph, granularity quiz, and execution choice:** derive waves (levels)
   and rivers (clusters) from `Blocked by` edges; show ready count, level
   widths, and longest gating chain. **Narrow is default:** window is a ceiling,
   not sizing target; file-disjoint slices run parallel. Quiz granularity in
   same message (coarse/fine, edge labels real). Then ask execution choice:
   ≥2 rivers ⇒ offer split or parallel; 1 chain ⇒ confirm wave order and go.
   Requirements-bending re-cuts return to grill.
9. `e2e.md` carries **real-environment behaviors only** — real external
   systems, real entrypoints, real data mocks cannot prove; never ticket-level
   reruns. Label each item's **mechanism** (gates-and-vocab); resolve non-agent
   gates at shape; go re-resolves against live capability probe.
10. **Contract Note gate:** output `## Contract Note` from prd.md (3–5
    one-sentence observable bullets + failure visibility). User confirms note
    **instead of reading full PRD**. Then confirm architecture decisions +
    gates → commit package.
11. **Done when** package is committed, package readiness gate passes, every
    applicable impact entry has resolved disposition, and gates are decided.
    Recorded blockers are not ready for execution. Handoff go in-session
    (issue path + commit).

## Guardrails

- No feature code; no package ready while Contract, seams, dispositions,
  conflicts, or research records are open.
- High-risk New decision candidates block shape; not-applicable requires
  its trigger-check record.
- Fresh-context fit is iron: never merge rivers to dodge the split question.
  No stale file-by-file plans — public interfaces and seams only.
- Contract Note gate (step 10) replaces default full-PRD review.
- Seam-migration slices require a consumer-sweep evidence entry (gates-and-vocab).
