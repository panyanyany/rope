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
   `required`, record every source's status, disposition, invariant,
   forbidden shortcut, evidence, scope, and conflict; no source found ⇒ a
   risk-reviewed New decision candidate. Confirm high-risk candidates,
   supersedes, exceptions, and unresolved conflicts with the user.
6. **Slice outline quiz:** title, user-visible delivery, `Blocked by`,
   matrix rows, constraint IDs, evidence → iterate until approved → then
   write full files.
7. **Research record gate (ADR 0017):** the PRD cites `.rope/research/`
   findings or records `research: not-needed` + reason — neither present
   ⇒ refuse to start writing; send it back to grill's research floor.
   Then write `prd.md`, `tasks.md`, and `e2e.md` per the templates. Slicing hard
   rules — edge labels, fresh-context fit, demo path, component/prefactor
   slices, two-stage contracts, wide refactor, anti-patterns — live in
   [gates-and-vocab.md](references/gates-and-vocab.md); apply them all.
   Evidence rules stay here because only shape writes them:
   - Evidence projection: every Required-evidence entry cites the matrix
     rows it proves; a matrix row with no slice evidence is a shape defect.
   - A seam-migration slice carries a mandatory **consumer-sweep** entry
     (gates-and-vocab).
   - Shared ledgers (`map.md`, registries, standards files) never appear in
     two same-wave Owned files; leaves return evidence rows, the wave
     integrator appends once.
8. **Read the graph, then quiz granularity, then ask one question.** Derive
   waves (topological levels) and rivers (edge-free clusters) from the
   `Blocked by` edges; show initial ready count, level widths, and the
   longest gating chain (say which numbers are estimates) beside the serial
   total: a chain of *n* levels is *n* sequential rounds whatever the
   window is. **Narrow is the default posture (ADR 0017):** the
   fresh-context window is a ceiling, not a sizing target — cut the
   smallest independently verifiable behavior; file-disjoint slices run
   in parallel, and a methodology-order edge never blocks dispatch.
   Granularity quiz (same message): any slice too coarse to fit
   a window, or too fine (trivial grouping lost)? Blocking edges real per
   their label? Merge or split? **Then** exactly one execution question:
   two or more rivers ⇒ offer the split (each river its own issue) or one
   issue with rivers in parallel; one chain ⇒ confirm wave order and go.
   A re-cut that bends the requirement goes back to grill.
9. `e2e.md` carries **real-environment behaviors only** — real external
   systems, real entrypoints, real data the mocks cannot prove; never
   ticket-level test reruns. Label each item's **mechanism**
   (browser-walk/cli/api/file-inspect/judgment/credentialed/unreachable)
   and classify executors against it (gates-and-vocab), resolving
   non-agent gates at shape; go re-resolves against the live harness
   capability probe.
10. **Contract Note gate:** output the `## Contract Note` from prd.md
    (3–5 one-sentence observable bullets + failure visibility). The user
    confirms the note **instead of reading the full PRD** — it is the
    Behavior Contract's direct human projection, never a second contract.
    Then confirm architecture decisions + gates → commit the package.
11. **Done when** the package is committed, every impact entry has a
    disposition or recorded blocker, and gates are decided. Handoff go
    in-session (issue path + commit); cross-window only if the user
    switches sessions.

## Guardrails

- No feature code; no ready mark while Contract, seams, dispositions,
  conflicts, or facts are open. `not-applicable` requires its trigger-check
  record; a high-risk New decision candidate blocks shape.
- The PRD's research record (research citation or `not-needed` + reason)
  is a shape precondition — no record, no package (ADR 0017 floor's
  backstop).
- Do not ask serial-or-parallel before the slice graph exists; the graph
  answers it (step 8), with numbers. Do not merge rivers into one slice to
  dodge the split question. Fresh-context fit is an iron rule.
- No stale file-by-file plans in PRD — public interfaces and seams only.
  Do not call the PRD a "spec" or slices "tickets" in written artifacts.
- The Contract Note gate (step 10) replaces default full-PRD review; the
  note is the Behavior Contract's projection, never a second contract.
- A seam-migration slice without a consumer-sweep evidence entry is not
  ready; mocks at a migrated seam instead of the outer boundary are a
  shape defect, not a test-style preference.
