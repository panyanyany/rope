# Rope Verify Rules

## Verdict

- `PASS` — paperwork complete: review recorded, E2E terminal, tree clean,
  architecture inheritance and guard/exception records complete.
  Says nothing about product truth — that claim lives in the end-of-issue
  review plus the E2E acceptance stage's evidence.
- `CHANGES_REQUESTED` — paperwork gaps for go's fix loop to close
  (unrecorded review, drifted E2E, missing commits).
- `BLOCKED` — a human decision is required (real-environment failure the
  reviewer logged, ambiguous PRD conflict, missing credential). List the
  blockers; do not fabricate a verdict.

## Finding severity

- `must-fix` — blocks finish: missing review record, drifted E2E, dirty tree.
- `nice-to-fix` — recorded, does not block.

## Document fixes (verify may edit issue docs only)

`tasks.md` verdict/status fields left blank, `e2e.md` Result fields left
blank, stale Open Questions — fill only from existing verified evidence,
never from completion claims alone; record under Document Fixes
Applied with file + change + reason. Never touch code.

## Drift

The failure mode verify exists to catch: an `agent_failed` or `pending` E2E
item drifting into a completed slice with no re-verification. Hunt drift on
every such item. `agent_passed` items are evidence-checked (recorded command), never
re-run.

## `verify.md` format

Append a round per run; never overwrite prior rounds.

```md
# <Issue Title> Verify

## Round N — <date>

### Verdict
PASS | CHANGES_REQUESTED | BLOCKED

### Checks
- Review recorded: <verdict line + identity + fix rounds, or finding>
- E2E terminal / drift: <status sweep result>
- Commits / tree: <result>
- Architecture inheritance: <package mapping + actual source-reading records + pre-edit landing evidence pointers; justified none where applicable>
- Architecture guards / exceptions: <coverage + command/output/commit; per-entry delta reasons + confirmations + reviewer outcome; or recorded absence/manual review>
- Integration reconciliation (when applicable): <target/candidate commits + decisions + pre-landing guard/review records>
- Architecture docs: <outcome routing>
- Matrix evidence: <spot-check pointers>

### Findings
- [must-fix|nice-to-fix] <finding> — evidence: <location>

### Document Fixes Applied
- <file>: <change> — reason: <why>
```

## Fix loop

`CHANGES_REQUESTED` → fix brief → parent spawns implementer leaf → re-verify
appends Round N+1 scoped to the must-fix items. A round that leaves the
must-fix set unchanged, or a design/requirements defect → Human Escalation
Stop.
