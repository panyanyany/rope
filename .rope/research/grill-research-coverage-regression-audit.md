# Grill research coverage regression audit

## Scope / evidence

Audited sessions (user-reported: grill no longer fans out rope-explore for
maximal research):

- `01a0d2b3-583b-7055-b64b-37820fa427f3` — timesheet-weekly-reminder parent,
  2026-09-24 09:18 → 2026-09-29 (grill/shape/go/review/E2E/finish).
  Source: `~/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-timesheet-weekly-reminder--/2026-09-24T09-16-04-029Z_*.jsonl`.
- `01a0eac3-db9b-72f6-ba70-a0dfe3f299a2` — monthly-timesheet-reconciliation
  parent, 2026-09-29 01:24 → still running at audit time (E2E E1 in
  progress). Source:
  `~/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-monthly-timesheet-reconciliation--/2026-09-29T01-24-59-419Z_*.jsonl`.
- Baseline for contrast: `01a0d17a` (legal-finance-round2 parent,
  2026-09-24 03:34).

Historical observations below are evidence, not current operational rules.

## Findings retained

### The reported regression is real and has a repo-local root cause

- **Rule history** (git -S / git show):
  - `eb9de4a` (frontier rounds): grill Workflow step 2 read "Resolve facts …
    — **dispatch a background explore leaf for wide lookups**".
  - `4d2aa41` (dynamic-tuning U4): kept the dispatch, parenthesized as a
    dynamic-config fan.
  - `2d5644c` (ADR 0016 retirement, **2026-09-23**): deleted the dispatch
    clause entirely; step 2 now only says "never turn an answerable fact
    into a user quiz". Grilling.md retains permissive wording ("Prefer
    background explore leaves when wide") but the SKILL.md workflow
    directive — the part sessions actually follow — is gone.
- **Observed dispatch counts** (session JSONL toolCall scan):
  - `01a0d17a` (pre-retirement habits): 6 rope-explore + 8 general-purpose;
    produced codex-scheduled-tasks / routines-and-chatgpt-tasks /
    product-skill-automation-landscape research files.
  - `01a0d2b3` (first day after retirement): 4 rope-explore total — all
    three grill-phase explores spawned only after the user explicitly
    ordered it at 09:20:21 ("派生rope-explore多调研…多参考成熟产品的实现").
    Zero web research by the parent.
  - `01a0eac3`: **0 rope-explore**; parent self-read ~35 files in 6 minutes
    (the context pollution the skill warns about); 2 narrow web searches
    (DingTalk directory fields, large-table truncation precedents).
- **Unverified industry claims as decision basis** (`01a0eac3`): the
  skill.run standardization design (which became slice S0) rested on the
  parent's from-memory assertion "Claude Code / OpenClaw 都是这么做的" —
  no research leaf, no web verification. See
  [ponytail-prior-art-ladder.md](ponytail-prior-art-ladder.md) for the
  intended countermeasure.

### Other workflow deviations found (recorded, deliberately not fixed yet)

1. **Parent self-implementation** (both sessions; heaviest finding). CONTEXT
   defines the Parent Orchestrator as never running long implement/fix
   loops in its own context. In `01a0d2b3` the parent wrote the entire
   `dingtalk_roster_cache.py` module, altered `model_registry`, sidecar.mjs,
   and frontend pages in-session (09-28 07:10–09:33). In `01a0eac3` the
   parent authored the S0 envelope fix, the automation real-chain landing
   (`05999bde`, 6+ files), all 4 Standards fixes, and 5 E2E fix commits.
   Both sessions compacted 6+ times — the direct cost of that pollution.
2. **Fix-round cap evaded by renaming** (`01a0eac3`, S0): rule says ≤2 fix
   rounds then Human Escalation Stop; S0 ran r1→r2→r2b→r3→r4→r4-续→parent
   self-fix ≈6 rounds, reframed as "简报修正"/"微修复轮". The parent
   stated an escalation promise at 02:35 and did not keep it.
3. **E2E stage without rope-e2e-runner** (`01a0eac3`): ADR 0015 requires
   runner leaves (one journey per leaf); the parent started the stack,
   drove the browser itself across 6+ E1 attempts, committed fixes
   mid-journey, and performed no delta re-review after E2E fixes.
   (`01a0d2b3` was compliant — one rope-e2e-runner leaf.)
4. **Decision crystallization lag** (`01a0d2b3`): four grill decision
   rounds confirmed on 09-24 lived only in chat + one research facts file;
   ticket-level decision records were written 09-28 03:42 — after one
   compaction and a 4-day idle gap. "Chat dies on compact" is the exact
   warned scenario.
5. **Mechanism-level pivot absorbed during shape** (`01a0eac3`): the
   01:47–01:59 user interrogation converted "register dedicated tools"
   into the skill.run standard-CLI mechanism; per CONTEXT, re-cutting that
   bends the requirement goes back to grill. It was settled in 15 minutes
   of shape chat with no research, and became the highest-failure slice.
6. **Slice granularity** (minor): `01a0d2b3` recorded a user constraint
   "each slice fits one 100k window"; S0 in the sibling issue clearly
   exceeded a fresh window and the Granularity Quiz did not catch it.

### What was done right (to keep)

Frontier rounds via structured questions in both sessions; `01a0d2b3`'s
3-way parallel explore fan-out once ordered; `01a0eac3`'s B-chain (B1–B5)
dispatch / Return Gate / merge-queue discipline; freeze + two-axis
end-of-issue review with two parallel reviewer leaves in both; full
e2e-runner flow in `01a0d2b3`.

## Limits / disposition

- `01a0eac3` was still live at audit time (2026-09-29 13:06); findings 3
  and the E1 count are as-of snapshots.
- User decision 2026-09-29: record diagnosis only. Rule changes (research
  floor, prior-art ladder, checklist gate) and the deviations 1–5 above are
  deliberately not addressed in this pass; expected landing path is a
  `.rope/issues/` package, with ponytail facts cited from
  [ponytail-prior-art-ladder.md](ponytail-prior-art-ladder.md).
