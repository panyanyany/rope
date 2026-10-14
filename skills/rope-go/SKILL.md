---
name: rope-go
description: Executes a .rope issue package — TDD slices, architecture inheritance, one end-of-issue review, then E2E. Use after rope-shape, or when landing a long-lived feature/integration branch with architecture reconciliation.
---

# Rope Go

Parent Orchestrator for one `.rope/issues/<slug>/` package: dispatch ready
slices to leaf workers, land branches serially, then run one two-axis
review and one E2E acceptance stage. Leaves never spawn leaves; parent
never bulk-loads leaf noise into its own context.

**Parent writes no code:** all product/test edits ride implementer briefs.
The correction path is rewrite-brief + re-dispatch; parent self-editing
violates boundaries and bloats context.

Execution rules, briefs, test scope, and fault manual: [references/execution-rules.md](references/execution-rules.md).
TDD playbook for implementers: [references/tdd.md](references/tdd.md).
Architecture constraints, guard/exception evidence, and merge gates: [references/architecture-gates.md](references/architecture-gates.md).

## Startup

1. Load Behavior Contract, slice statuses, E2E plan, and Constraint Bundle.
   Check git status; resolve unrelated dirty work. Apply the package
   readiness gate before dispatch; integration merges use candidate-merge
   branches per architecture-gates.
2. Baseline: reuse same-HEAD green evidence ≤24h covering selected scope;
   else run declared quick tier or affected tests. Record scope, command, and
   reason in Testing Decisions (never a blanket suite).
3. Consume shape's `Execution mode:` (worktree | shared); recheck host
   isolation. Mismatch degrades to shared with a recorded reason. Commit
   package before worktree dispatch.
4. Report initial ready count, maximum graph width, planned parallelism,
   and serialization reasons.

## Slice loop

- Worktree mode: ready when `seam-required` blockers merge; dispatch
  immediately from latest merged HEAD; `file-overlap` orders merges, never
  dispatch; no wave barrier.
- Shared mode: waves with disjoint owned files; file-overlap blocks dispatch.
  Collect commits serially — one index, one checkout.
- Brief implementer per the ≤60-line budget in execution-rules: contract,
  mandatory Constraint IDs + source sections, map path, focused TDD commands,
  architecture evidence, and step 0 worktree setup. Leaf reads sources and
  records its Architecture landing before editing; conflicts stop the slice.
- Return Gate: reconcile every Required-evidence item mechanically to returned
  output or artifact path. Missing evidence bounces the leaf to missing items;
  missing tests need brief correction; changed acceptance returns to shape.
- Fix rounds: re-brief fresh leaf per problem; identical failure signature
  from fresh leaf or design defect stops for human. Independent ready slices
  keep running.
- Merge landed branches serially in landing order. Conflicts get one
  re-dispatch on unmerged branch using both intents; unresolved merges stay
  blocked. Update map evidence and refill ready set after each merge.

## Investigation map

`<issue>/map.md`: one current fact per line, path + date, seeded at shape.
Shared mode: leaves update falsified lines in disjoint scope.
Worktree mode: leaves return corrections; parent writes after merging.

## End-of-issue review

Freeze clean tree with no active leaf. Require declared full architecture guard
coverage and per-entry exception delta evidence per architecture-gates.
Spawn two fresh read-only leaves in one message: **Standards scanner**
(explore preset; affected lint/typecheck/build; never runs product) and
**Behavior reviewer** (`rope-reviewer`; walks Matrix, architecture sources,
and high-risk boundaries — code-only). Aggregate mechanically, worst verdict
wins; transcribe blocking findings into one fix brief; delta-only re-review;
first round that fails to shrink blocking set is Human Escalation Stop.

## E2E acceptance stage

Review approved, then real environment: bring up project-declared shared
stack, then dispatch read-only `rope-e2e-runner` leaves (one journey per leaf;
parallel when resource-disjoint). Parent never substitutes itself for runner
dispatch. Delivery gates on all required e2e items passing with evidence or
explicit user waiver. Failures run bounded fix loop; re-run affected journeys
on new HEAD. Full contract: execution-rules.

## Stop / report

Missing evidence, failed gates, missing environment, unresolved contracts,
and human gates remain explicit blockers. Report slices, commits,
parallelism, red/green evidence or waivers, review/fix history, E2E statuses,
held vs continuing work. Review + E2E green → hand off to `rope-verify`.
