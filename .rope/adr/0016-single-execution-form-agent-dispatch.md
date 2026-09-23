# 0016 Single Execution Form — Parent Agent Dispatch

**Status:** active — supersedes [0014](0014-workflow-execution-mode.md) in
full: the dynamic execution form, its kernel (`go-execute.js`), the
`execution-template.md` plan/run-record contract, `~/.rope/config.toml`
`[execution]` resolution, the tiered L1/L2/L3 gate menu, and the fan budgets
are retired. [0008](0008-slice-ready-worktree-execution.md) and
[0012](0012-worktree-verified-full-demotion-of-file-overlap-edges.md) are
unaffected — worktree/shared are isolation modes of agent dispatch, not an
execution form. [0015](0015-agent-mode-e2e-acceptance-stage.md) remains
active and is now the only E2E acceptance path.

Date: 2026-09-23

## Context

ADR 0014's kernel never reached production quality: its merge classification
carried a known defect, the offline smoke suite was not green, and the
machine config stayed pinned to `agent` with a "do not use until fixed"
note. The deterministic form promised cheap parent context and mechanical
gates, but maintaining two execution forms meant every phase skill carried
dual-path instructions, a shared startup contract, and a 479-line plan
schema — sediment that cost readability on every run while the shipped path
was always agent dispatch.

## Decision

Retire the dynamic form entirely. Parent Agent dispatch is the only
execution form: the parent LLM runs the slice loop, the merge queue, the
end-of-issue review, and the E2E acceptance stage directly, per
execution-rules. Integration acceptance is covered by the end-of-issue
review (Matrix walk on the assembled diff) plus the E2E stage — the L1/L2/L3
tier numbering and the kernel's mechanical dual assertions are not replaced
with prose equivalents: the parent owns slice state natively, and a
forgotten branch surfaces at review or E2E.

Skill text shrinks accordingly (grill/shape/go rewritten; startup contract,
config resolution, and kernel references deleted). If a deterministic
executor returns, it must re-earn its place through a new ADR with green
tests on arrival.

## Consequences

- One path to document, test, and read; issue packages no longer have an
  execution-form dimension at all.
- Parent context discipline (briefs by reference, summaries not traces)
  becomes the only protection against fan-out context cost.
- Deterministic replay/prefix-cache resume and exit-code-gated checks are
  gone; host-native workflow runners remain usable outside Rope without
  this harness depending on them.
