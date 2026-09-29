---
name: rope-go
description: Executes a .rope issue package — TDD slices dispatched to leaf workers, one end-of-issue review, then a real-entrypoint E2E stage. Use after rope-shape when running slices on an issue.
---

# Rope Go

Parent Orchestrator for one `.rope/issues/<slug>/` package. Dispatch every
ready slice to a leaf worker, land branches serially, then one two-axis
review and one E2E acceptance stage. Leaves never spawn leaves; the parent
never bulk-loads leaf noise into its own context.

**Parent writes no code:** during slice execution and E2E the
parent produces no product or test code — every code change rides an
implementer brief. The correction path is always rewrite-brief +
re-dispatch, never parent self-editing: parent self-writes bloat the
parent context (compaction-dependent decisions, blurred stage boundaries).

Execution rules (test scope, briefs, merge queue, review, E2E stage):
[references/execution-rules.md](references/execution-rules.md).
TDD playbook (also for implementer leaves):
[references/tdd.md](references/tdd.md).
Architecture constraints:
[../rope-shape/references/architecture-continuity.md](../rope-shape/references/architecture-continuity.md).

## Startup

1. Load the Behavior Contract, slice statuses, E2E plan, and Constraint
   Bundle index — deep-read details on dispatch, not upfront. Check git
   status; resolve unrelated dirty work before proceeding.
2. Baseline: reuse same-HEAD green evidence ≤24h that covers the selected
   scope; else run the declared quick tier or affected tests. Record the
   scope, command, and reason in Testing Decisions (impact-based ladder in
   execution-rules — never a blanket suite).
3. Consume shape's `Execution mode:` (worktree | shared); recheck the host
   can still isolate. A mismatch degrades to shared with a recorded
   reason. Commit the issue package before worktree dispatch — fresh
   worktrees start from HEAD.
4. Report initial ready count, maximum graph width, planned parallelism,
   and the reason for any serialization.

## Slice loop

- Worktree mode: a slice is ready when its `seam-required` blockers are
  merged — dispatch immediately from the latest merged HEAD;
  `file-overlap` orders merges, never dispatch; no wave barrier.
- Shared mode: waves with disjoint owned files; file-overlap also blocks
  dispatch. Collect commits serially — one index, one checkout.
- Brief each implementer per the ≤60-line budget in execution-rules:
  contract, constraint IDs, map path, focused TDD commands, required
  evidence, and the unconditional worktree-setup step 0.
- On each landing, reconcile every Required-evidence item to returned
  output or an artifact path (Return Gate). Missing evidence bounces the
  leaf to exactly those items — not a review, not a parent test rerun.
  Missing tests need an explicit brief correction; a changed acceptance
  requirement returns to shape.
- Fix rounds: re-brief a fresh leaf, at most two per problem; independent
  ready slices keep running. Design/contract defects stop for the human.
- Merge landed branches serially, one at a time, in landing order.
  Conflicts get one re-dispatch on the unmerged branch using both
  branches' intent; unresolved merges stay blocked. After each merge,
  update map evidence and refill the ready set.

## Investigation map

`<issue>/map.md`: one current fact per line, path + date, seeded at shape.
Shared mode: leaves update falsified lines in their disjoint scope.
Worktree mode: leaves return corrections; the parent writes after merging.

## End-of-issue review

After every slice is integrated, freeze a clean tree with no active leaf.
Spawn two fresh read-only leaves in one message: **Standards scanner**
(explore preset; affected lint/typecheck/build; never runs the product)
and **Behavior reviewer** (`rope-reviewer`; walks the Matrix and
high-risk boundaries over the assembled diff — code-only). Aggregate
mechanically, worst verdict wins; transcribe blocking findings into one
fix brief; at most two fix rounds with delta-only re-review, then Human
Escalation Stop. Notes stay notes.

## E2E acceptance stage

Review approved, then the real environment: bring up the project-declared
shared stack, then **dispatch** — every journey goes to a read-only
`rope-e2e-runner` leaf, one journey per leaf, parallel when
resource-disjoint, serialized on shared accounts and mutable state. The
parent never substitutes itself for a runner dispatch (driving the browser
or CLI itself because a leaf failed or returned empty is the documented
failure mode, not a fallback). Delivery gates on every required e2e item
passing with evidence or an explicit per-item user waiver. Failures run the
same bounded fix loop; after a fix lands, re-run affected journeys on the
new HEAD. Full contract: execution-rules.

## Stop / report

Missing evidence, failed gates, missing environment, unresolved contracts,
and human gates remain explicit blockers. Report slices and commits,
parallelism, red/green evidence or waivers, review and fix history, E2E
statuses, held versus continuing work. Never infer success from silence.
Review + E2E green → hand off to `rope-verify`.
