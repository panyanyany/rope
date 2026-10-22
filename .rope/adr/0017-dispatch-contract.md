# 0017 Dispatch Contract — Research Floor, Brief-as-Contract, Parent Writes No Code

**Status:** active — restores and hardens the dispatch discipline eroded by
[0016](0016-single-execution-form-agent-dispatch.md)'s slim-down (which kept
the single execution form, unchanged); item 8's mode wording in
[0011](0011-edge-classification-and-acceptance-gates.md) is revised here.

Date: 2026-09-29

## Decision

1. **Research floor.** A grill request involving a new mechanism, an
   external platform/service integration, or a "how do mature products solve
   this" design judgment requires **parallel research dispatch before the
   decision rounds** — typically two briefs (repo precedent + external
   product survey). Purely internal small changes record
   `research: not-needed` + one-line reason on the issue/PRD. The floor's
   backstop lives in shape: a PRD with neither research citations nor a
   not-needed record is refused. Unverified industry-practice claims
   ("X and Y both do it") are never a decision basis without a research
   artifact.
   Clarification (2026-10-22): before recommending a new mechanism/tool
   surface, research how mature implementations solve the same user task,
   verify this project's additional constraints rather than assuming every
   custom mechanism is necessary, and put reuse/adapt/build conclusions and
   minimal custom scope into the decision. Findings must affect the choice,
   not merely produce a bibliography; independent questions determine fan-out.
2. **Brief-as-contract.** The dispatch prompt states the task — question,
   sources, output path, return shape — and the leaf honors exactly what it
   declares. `rope-explore` returns map.md-style facts by default; a brief
   that names a findings output under `.rope/research/` switches the return
   to path + ≤300-word summary + confidence. A requirement the leaf could
   not meet goes in the return under `unknowns` with what was attempted —
   never silently dropped. Explore default thinking rises `low → medium`:
   at `low`, cheap leaves returned empty on research briefs.
3. **Must dispatch, parallel by default.** Dispatch is the mandated path
   wherever the rules name a leaf: every E2E journey runs as a
   `rope-e2e-runner` dispatch, parallel when resource-disjoint. The parent
   never substitutes itself for a dispatch that failed or returned empty —
   that is the documented failure mode, not a fallback.
4. **Parent writes no product/test code** during go and E2E. Every code
   change rides an implementer brief; course correction = rewrite brief +
   re-dispatch. "Small" mid-E2E fixes by the parent are equally violations.
   Clarification (2026-10-22): default unknown searches, call-chain tracing
   and diagnosis to explore before the cause is known; parent retains short
   known-location reads, decisive evidence checks, contract interpretation
   and scope decisions. Delegate substantive baseline/integration execution
   and log summarization to existing leaves, while parent selects scope,
   handles failures and owns stack lifecycle. No tool-count threshold,
   additional role, or replacement of assembled acceptance by slice self-tests.
5. **Per-round crystallize.** A grill decision confirmed in a round is
   written to `.rope/` in that same round; a confirmed decision still living
   only in chat when its round ends is a violation.
6. **Narrow-first slicing.** The fresh-context window is a re-cut ceiling,
   not a sizing target: cut the smallest independently verifiable behavior
   with its own demo path; more, thinner slices beat fewer packed ones.

Explicitly **not** adopted (user decision 2026-09-29): no mechanical
re-dispatch protocol for dead/empty leaves; no evidence-void rules beyond
ADR 0015's existing ones; no tightening of fix-round counts; no model-tier
change for `rope-e2e-runner`; no fifth agent role.

## Context

A three-session audit
(`.rope/research/grill-research-coverage-regression-audit.md`) found: grill
research dispatch regressed to "only when the user insists" after 0016's
slim-down deleted the step-2 dispatch directive; two sessions of parent
self-implementation (≈6 compactions each, S0 overrun past its fix-round
budget, 5 mid-E2E parent fixes); one E2E runner leaf dead on arrival with
the parent driving the browser itself; decisions confirmed 09-24 written
09-28; an S0 slice spanning runner+composition+registry+tests far past a
fresh window. Precedent research
(`.rope/research/dispatch-precedents/`: superpowers, gsd, Trellis,
mattpocock skills) converged on: the brief is an executable contract;
findings persist to disk and only paths return; no nested spawning;
parent-side bounded escalation rather than leaf self-rescue.

## Why this shape

- The failures are one failure: dispatch discipline was permissive
  ("prefer", "when wide") where it needed to be a floor, and the parent
  always had a legal-looking self-serve alternative. Making dispatch
  mandatory at the named joints and closing the parent's write path
  removes the alternative without rebuilding 0016's retired machinery.
- Precedents from three independent harnesses agree on brief-as-contract
  and path-only returns; disagreeing parts (cheap-model defaults, fixed
  fan-out counts, retry ladders) are exactly the parts the user declined —
  judgment stays with the parent.

## Consequences

- grill/shape/go skill texts gain hard floors and a backstop; explore
  preset body + thinking change (regenerate harness presets to apply).
- Parent sessions stay small: orchestration, briefs, merges, gates — no
  implementation noise. Leaf failures surface as dispatch problems to
  re-brief, not parent takeover.
- Risk: over-dispatch on genuinely trivial work. Mitigation: the tiered
  floor (not-needed record) and quick-path (ADR 0006) unchanged.
- ADR 0011 item 8 wording ("brief-selected") reads now as brief-declared;
  no other item changes.

## Alternatives considered

- New `rope-research` preset: rejected — mode discipline in the explore
  body already covers it; a fifth role fragments the scanner/e2e preset
  lineage.
- Mechanical recovery protocol (dead-leaf re-dispatch rounds, quality
  gates): rejected per user decision — parent judgment plus the
  must-dispatch emphasis instead.
- Restore 0016's dynamic research fan machinery: rejected — the regression
  was textual (a deleted directive), not mechanical; text floors restore
  the behavior without the retired kernel.

## Context-protection clarification (2026-10-22)

Confirmed in [the parent-token retrospective](../issues/parent-token-retro/retro.md):

- Shape delegates source/consumer/test-seam/ownership/dependency facts, not
  contract decisions, slicing, or complete issue-package writing. Parent
  remains the author of PRD/tasks/E2E; delegated package drafting was declined.
- The TDD playbook stays independent. Parent passes its verified installed
  absolute path in implementer briefs (including corrections/generic fallback),
  not its body; no global preset refresh is required. The upstream comparison
  found no reason to add TDD policy; existing Rope acceptance/evidence
  adaptations remain. Runtime owner: [brief contract](../../skills/rope-go/references/execution-rules.md#leaf-brief-contract-hard-budget).
- Documentation maintenance belongs to clear, initial scaffolding to init.
  `.rope/GLOSSARY.md` is the sole new glossary convention, not a root-level
  file. Clear proposes content-preserving CONTEXT rename/consolidation and
  active-reference repair through its existing approved batch; rename and
  content cleanup are separate. Legacy content remains readable before
  migration. Runtime owners: [current docs](../../skills/rope-clear/references/current-docs.md)
  and [clear](../../skills/rope-clear/SKILL.md).

These clarify existing dispatch/reader boundaries without restoring a kernel,
adding fixed fan-out or an automatic installation/migration system. The
approved per-task owner can be overridden by an explicit user instruction;
this repository's skill edits were deliberately performed without subagents.
