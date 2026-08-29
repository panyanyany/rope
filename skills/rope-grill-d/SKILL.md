---
name: rope-grill-d
description: Runs the full Rope delivery pipeline by grilling requirements, writing the issue package, shaping slices, and executing go in the same session. Use when the user wants rope-grill to continue automatically through issue, shape, and implementation without a second handoff confirmation.
---

# Rope Grill D

Full-pipeline Parent Orchestrator. The user confirms the requirement once;
this skill then owns `rope-grill` → `rope-shape` → `rope-go` in one session.
It is the default choice when durable planning artifacts and implementation are
both wanted without pausing between stages.

## Workflow

1. Load `.rope/CONTEXT.md`, `.rope/routes.md`, relevant specs, ADRs, research,
   and the three referenced skill packages.
2. Run the `rope-grill` interview in plain language. Resolve facts, domain
   terms, the six Behavior Contract fields, architecture impact, product
   decisions, and primary/failure/forbidden-shortcut scenarios.
3. Present the shared-understanding recap. Ask the user to confirm the recap.
   Do not ask whether to skip issue or shape: this skill's explicit contract is
   to continue automatically after confirmation.
4. If the user does not confirm, keep grilling and list the blockers. If a
   schema, dependency, auth, deploy, destructive operation, production/shared
   environment, unresolved architecture conflict, or other human gate appears,
   stop and ask the required question before writing or executing anything.
5. After confirmation, write any durable CONTEXT / ADR / research / spec
   decisions required by the grill outcome, then invoke `rope-shape`.
6. Let `rope-shape` write and commit the issue package, including PRD,
   Contract Note, Behavior Matrix, Constraint Bundle, tracer-bullet slices,
   graph/waves/rivers, and classified E2E plan.
7. Continue directly into `rope-go` using the committed package. Do not ask for
   another handoff confirmation unless a new human gate or contract conflict
   appears.
8. Let `rope-go` complete TDD slice execution, end-of-issue review, and E2E.
   Then hand off to `rope-verify`; do not claim completion while verify or a
   required gate is non-terminal.

## Handoff contract

- Pass the confirmed recap, issue path, shape commit, architecture
  dispositions, gates, and any user decisions by reference to the next stage.
- Preserve the existing parent ownership rule: this session owns all
  orchestration and leaf dispatch; no nested leaf spawning.
- Keep the full pipeline's durable artifacts. Never substitute direct-go mode
  or `rope-quick` unless the user explicitly changes the route.
- At each handoff, report the next stage and continue in-session by default.

## Stop / report

Stop on missing facts, unresolved decisions, dirty unrelated changes, missing
environment, human gates, escalation, or failed terminal checks. Report the
stage, artifact paths, commits, slice/TDD evidence, review verdict, E2E status,
verify status, and the exact blocker or next action.

## Source skills

- Grill rules: [../rope-grill/SKILL.md](../rope-grill/SKILL.md)
- Shape rules: [../rope-shape/SKILL.md](../rope-shape/SKILL.md)
- Go rules: [../rope-go/SKILL.md](../rope-go/SKILL.md)
- Verify rules: [../rope-verify/SKILL.md](../rope-verify/SKILL.md)
