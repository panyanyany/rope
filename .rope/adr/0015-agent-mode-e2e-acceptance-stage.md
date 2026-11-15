# 0015 Agent-Mode E2E Acceptance Stage: Dedicated Runner Leaves After Code Review

**Status:** active — partially supersedes [0010](0010-parallel-two-leaf-end-of-issue-review.md)
rule 2 (product-run exclusivity) for **agent dispatch**; extends
[0007](0007-graph-driven-go-single-review.md) (single review gate kept, its
real-entrypoint probe moves to a separate stage). ADR 0016 later retired
dynamic execution; this agent-mode stage is the only E2E path. Rope-quick
is untouched by owner decision 2026-09-23.

Date: 2026-09-23

## Decision

For full issues under **agent dispatch**, the pipeline is:
slices integrated → **two-axis code review** → review `approve` → **E2E
acceptance stage** → all required journeys green or explicitly waived →
`rope-verify`.

1. **The Behavior reviewer no longer runs the product in agent mode.** The
   end-of-issue review stays exactly as ADR 0010 defines it — two parallel
   read-only leaves (Standards scanner + Behavior reviewer), mechanical
   aggregation, binary severity, ≤2 fix rounds, delta re-review — minus the
   product run: the reviewer judges the assembled diff against the Matrix and
   high-risk boundaries; ports, processes, and browsers move to the E2E stage.
2. **The E2E Runner is a new read-only leaf role.** One runner leaf drives one
   journey through the **project-declared real entrypoint** (browser, real
   message channel, CLI, API — the project's own declaration in `routes.md` /
   issue Testing Decisions; Rope prescribes no tool). Internal seams
   (submitter injection, fixtures, unit green) are integration evidence and
   never substitute for the real entrypoint. Runners never edit code and
   never spawn; they return structured evidence (steps, tool/command,
   artifacts, pass/fail per item).
3. **The parent owns one shared test stack.** Project-declared start command,
   readiness probe before any dispatch, teardown after the last journey.
   Runners never build their own stack. Journeys fan out as parallel runner
   leaves when resource-disjoint (isolated browser sessions / distinct test
   data); journeys sharing an account or mutable state serialize. A host
   without session isolation degrades to serial journeys with a recorded
   reason.
4. **Delivery gate:** every required `e2e.md` item carries success evidence
   — `agent_passed` (runner evidence) or `user_confirmed` (the user ran it)
   — or the issue stays blocked. The only alternative is an **explicit
   per-item user waiver** recorded as such — a waiver or `blocked_on_*`
   never reads as passed. Executor resolution stays capability-relative
   (gates-and-vocab); the runner stage runs every item whose mechanism the
   harness covers.
5. **Fix loop:** an E2E failure routes to one implementer fix brief
   (transcribed findings, Defense Budget intact), ≤2 rounds, then Human
   Escalation Stop. After a fix merges: delta-only code re-review, the stack
   re-deploys onto the new HEAD, affected journeys plus the shared-entry
   smoke re-run, and every reused evidence line is annotated with the commit
   it was taken on. A green from a superseded HEAD is void.

## Context

Field sampling 2026-09-16–23 (`.rope/research/e2e-real-sessions-2026-09.md`):
acceptance executor drifted across issues (main window, reviewer-built stack,
quick inline, headless-only). The `/clear` fix recorded E2E PASS from a
headless submitter seam with no real DingTalk entry; legal-finance's E4 real
Admin probe was blocked yet the issue closed; the model-management issue paid
twice for stacks (main window and reviewer each built one). Upstream research
(`.rope/research/matt-upstream-e2e-2026-09.md`): no independent-E2E-role or
shared-stack precedent exists in mattpocock/skills — community issue #397
reports the same "services green, UI absent" failure class, but no shipped
policy. This design is Rope's own, answering Rope's observed failures.

## Why this shape

- Code review and real-entrypoint acceptance have different failure classes
  (assembled-diff defects vs environment/entrypoint truth); serializing them
  behind one leaf made the expensive stage hostage to the cheap one and let
  the cheap one's green masquerade as the expensive one's pass.
- One parent-owned stack kills N× boot cost and port/account contention;
  parallel leaves with isolated sessions buy back wall-clock on wide journey
  sets.
- Capability-relative executor rules already exist (gates-and-vocab); this
  stage is their enforcement point, not a new classification scheme.

## Consequences

- The stage lives in rope-go's execution-rules (acceptance-stage section +
  E2E statuses + handoff checklist) — no standalone skill. `rope-reviewer`
  preset shrinks to code-only (harness-presets role schema + agent template
  updated here; regenerate `~/.pi/agent/agents/rope-reviewer.md` on
  install).
- `rope-e2e-runner` is the deliberate fourth harness role (role-schema,
  agent-templates, manifest schema updated here); install regenerates
  `~/.pi/agent/agents/rope-e2e-runner.md`.
- Go→verify handoff gains a precondition: E2E stage verdict recorded.
  rope-verify / rope-finish are unchanged by owner decision 2026-09-23 —
  the gate lives in go; verify stays the paperwork/anti-drift layer
  (one stale citation pointing product truth at the old reviewer model
  was corrected).
- Known cost, accepted: the stage adds one pipeline phase; a stack that
  cannot reach readiness blocks delivery until waived — by design.
- Known cost, accepted: parallel browser journeys depend on host session
  isolation; where absent, journeys serialize (slower, still correct).

## Alternatives considered

- Keep reviewer-runs-E2E (status quo): rejected — the drift evidence above.
- N reviewers each walking journeys: rejected — mixes code judgment with
  operation, or drops one axis; ADR 0010's two-axis economics stay.
- Implementer self-acceptance: rejected — self-evaluation skews positive;
  cross-role separation (implement vs accept) is an ADR 0001 invariant.
- Per-runner self-built stacks: rejected — observed double-stack cost and
  port/account contention in the 09-21/22 sessions.
