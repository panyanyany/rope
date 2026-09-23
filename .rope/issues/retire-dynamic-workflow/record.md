# Retire dynamic workflow + skill slimming (ADR 0016)

Record for the harness-self refactor session, 2026-09-23. No issue package —
direction set by a grill session (five decisions), executed directly.

## What changed

- **Retired** the dynamic execution form entirely (ADR 0016 supersedes 0014):
  `go-execute.js` kernel, `dynamic-workflow.md`, `execution-template.md`,
  `verify-delivery.sh` / `run-check.sh`, six kernel test files + workflow
  harness, `~/.rope/config.toml` `[execution]`, spec
  `dynamic-workflow-mode.md`, and every dual-path instruction in
  grill/shape/go.
- **L1/L2/L3 gate tiers deleted without prose successors** (grill decision):
  the parent owns slice state natively; integration acceptance rides on the
  end-of-issue review + E2E acceptance stage.
- **Composition-roots block retired with the L3 gate** it belonged to.
- **Deep-rewrote** rope-go / rope-grill / rope-shape SKILL.md (matt-pocock
  style: steps + completion criteria up top, rules disclosed to references,
  single source of truth per rule).
- **Light pass** on the other seven skills; only rope-harness-presets
  carried a genuine violation (go scheduling restated + duplicated
  guardrails).
- README (en/zh), CONTEXT terms, routes, specs index synced; stale
  HANDOFF-2026-06-11 deleted.

## Verification

- `node --test tests/*.test.mjs` green (3 tests: frontmatter, reference
  resolution, CLI install).
- Repo-wide grep: no live link to any deleted file; ADRs 0003/0014/0015
  statuses consistent with 0016.

## Deferred to user

- One-shot review of the assembled diff, then global install
  (`rope add`) — per repo AGENTS rule.
