---
name: rope-finish
description: Verifies and closes a .rope issue after go — paperwork gate (review recorded, E2E terminal, tree clean, architecture continuity) plus closeout and documentation routing. Invoke by name when the user wants to close the issue.
disable-model-invocation: true
---

# Rope Finish

Verify and close out a Rope issue package. This skill does not implement
new functionality. Product truth and assembled-diff judgment already
happened in go's **end-of-issue review**; finish never re-judges code.

Verify verdict rules and `verify.md` format: [references/verify-rules.md](references/verify-rules.md).
Final status checks and reusable lesson routing: [references/finish-checklist.md](references/finish-checklist.md).
Architecture continuity fields: [../rope-shape/references/architecture-continuity.md](../rope-shape/references/architecture-continuity.md).

## Preconditions

- `.rope/issues/<issue>/prd.md`, `tasks.md`, and `e2e.md` exist.

## Stage 1 — Verify (paperwork gate, read-only)

Run these five checks, nothing more (skip a check only if `verify.md`
already carries a `Verdict: PASS` round and nothing changed after it):

1. The end-of-issue review really ran: one verdict line with run/agent
   identity + fix rounds recorded; `review_degraded` carries its reason.
2. Every E2E item has a terminal status (`agent_passed`, `user_confirmed`,
   `waived`, `blocked_on_gate`, `blocked_on_user`, `not_run_with_reason`).
   Hunt drift: `agent_failed` / `pending` items that silently became
   completed — re-run or block, never absorb. An item parked on `user`
   whose mechanism label a probed harness tool covers is classification
   drift — send it back to agent execution instead of accepting the
   parking.
3. Per-slice commits present; no unrelated dirty files.
4. Architecture continuity paperwork: package readiness passes; every slice
   has Constraint IDs, required source sections, and source-reading/pre-edit
   Architecture landing evidence (or justified non-applicability; a missed
   pre-edit step needs an honest omission/corrective-work record and reviewer
   acceptance, never a retroactive claim). Check declared full architecture
   guard evidence at the accepted code state, per-entry exception delta
   reasons + review outcome, and confirmed changed dispositions; integration
   merges also carry candidate/target/reconciliation records. Check records
   per [architecture gates](../rope-go/references/architecture-gates.md), not code.
5. Matrix rows point at recorded evidence (spot-check pointers, never re-run).

Verified existing evidence may be linked into missing paperwork fields
directly (recorded under Document Fixes Applied). Never manufacture a
source-reading, guard-pass, exception approval, or review record.

Append a round to `verify.md` per [verify-rules.md](references/verify-rules.md):
PASS → Stage 2. CHANGES_REQUESTED → fix brief back to go's fix loop (a
round that leaves the must-fix set unchanged → Human Escalation Stop);
missing constraints return to shape. BLOCKED → stop and report to the
user. Legacy packages with an existing `Verdict: PASS` round need no new
round unless state changed after it.

## Stage 2 — Closeout

1. Read the issue package and referenced `.rope/` docs.
2. Confirm no new development is needed.
3. Check git status and recent commits.
4. Update issue docs only if they are missing final status, E2E outcome, commit summary,
   or Architecture Impact documentation outcome.
5. If Architecture Impact contains a confirmed `pending-finish` outcome, route the
   change through the existing `.rope/` homes and write the canonical update directly;
   do not ask again. Replace `pending-finish` with a terminal documentation
   outcome (`updated-existing`, `added-new`, `no-new-decision`,
   `exception-recorded`) and record the path/reason. Legacy packages record
   the compatibility marker before closeout.
6. If final behavior reveals an architecture change that was not confirmed by
   shape or a later parent decision, pause for human/parent disposition before
   writing or closing. Do not invent an exception.
7. Before durable updates, read
   [current documents](../rope-clear/references/current-docs.md) and revise
   the current owner in place. If reusable lessons were learned:
   - update `.rope/specs/` for implementation contracts or gotchas
   - update `.rope/research/` for external facts
   - update `.rope/GLOSSARY.md` for stable project terms
   - update `.rope/adr/` for hard-to-reverse decisions
8. Commit final doc updates if any were made.
9. Report final status, terminal documentation outcome, and remaining blocked/user-only validation, if any.

## Guardrails

- Do not read the diff to judge code quality — that was the reviewer's job.
- Do not invent PASS; a missing verdict line is a finding, not a formality.
- Do not re-run green E2E items; check recorded evidence instead.
- Do not archive, delete, push, merge, rebase, or clean worktrees unless the user explicitly asks.
- Do not invent successful E2E results.
- Do not force user validation when all required E2E was agent-executable and passed.
