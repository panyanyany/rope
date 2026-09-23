---
name: rope-e2e
description: Runs the Rope agent-mode E2E acceptance stage for a full issue — after the end-of-issue code review passes, bring up the project's declared test stack, fan out read-only E2E runner leaves on real-user-entrypoint journeys, and gate delivery on per-item evidence. Use when the end-of-issue review has returned approve and e2e.md still has pending items, when handing off toward rope-verify, or when the user asks to run the E2E stage / e2e journeys / 真实入口验收.
---

# Rope E2E

Parent-orchestrated acceptance stage (ADR 0015): the two-axis code review has
approved; now the **real entrypoint** must prove the issue. The reviewer
already judged the code — do not re-review it here. Quick-path sessions
without an issue package are out of scope.

Role contract and terms: `.rope/CONTEXT.md` (`E2E Runner`). Decision:
`.rope/adr/0015-agent-mode-e2e-acceptance-stage.md` (in the Rope repo).

## Workflow

1. **Preconditions.** `tasks.md` records an end-of-issue review `approve`
   (with identity); tree clean; record HEAD — every evidence line cites the
   commit it ran on. Any miss → stop and return to go's review; this stage
   never starts before code review passes.
2. **Resolve executors** (capability-relative, gates-and-vocab). Read each
   `e2e.md` item's mechanism label; probe the harness tool surface. Covered
   mechanism ⇒ an agent journey this stage runs. `judgment` / `credentialed`
   / `unreachable` ⇒ user lane (user-run or explicit waiver). Every item
   ends this step labeled `agent` or `user`/`not-run` with a reason.
3. **Bring up the one shared stack.** Start command and entrypoints come
   from the project's declaration — `routes.md` (`E2E entrypoints:` /
   stack start) or the issue's Testing Decisions. Never invent an
   entrypoint; no declaration → BLOCKED, ask the user. Probe readiness
   before any dispatch; save the boot log and record ports under
   `<issue>/evidence/e2e/`. Readiness failure → `blocked_on_*`, report —
   no dispatch, no fix rounds spent on environment.
4. **Plan journeys.** Group items into journeys (one user-visible walk per
   leaf; one journey may prove several items of one mechanism). Journeys
   sharing an account or mutable state serialize; resource-disjoint
   journeys run parallel with isolated browser sessions. Host without
   session isolation → serial journeys, reason recorded. Written plan:
   journey list, item ids, parallel/serial + reasons.
5. **Dispatch runner leaves** (`rope-e2e-runner` preset; generic read-only
   worker with explicit instructions otherwise, type recorded). One brief
   per journey — [template](references/journey-brief.md). Background
   dispatch for the parallel set; serial queue for contended journeys;
   reduced parallelism gets a recorded reason. Collect every structured
   return; a journey that returned nothing is a blocker, not a pass.
6. **Record evidence.** Per item into `e2e.md`: status (`agent_passed` /
   `agent_failed` / `blocked_on_gate` / `blocked_on_user` /
   `not_run_with_reason`), tool/command, artifact paths, and the commit it
   ran on. Internal-seam output (submitter injection, fixtures) is
   integration evidence — it never marks a real-entrypoint item passed.
7. **Fix loop.** `agent_failed` → one fix brief to an implementer leaf:
   transcribe the runner's failure verbatim; zero acceptance requirements
   beyond the Matrix (Defense Budget). ≤2 rounds, then Human Escalation
   Stop. After a fix merges: delta-only code re-review, re-deploy the
   stack onto the new HEAD, re-run affected journeys plus a shared-entry
   smoke, and annotate every reused evidence line with its commit — a
   green from a superseded HEAD is void.
8. **Gate and handoff.** Every required item `agent_passed`, or carrying an
   explicit **per-item user waiver** recorded as a waiver (never as a
   pass)? Yes → stop the stack (record), write the stage verdict line,
   hand off to `rope-verify`. No → BLOCKED to the user with the exact
   unproven items and what each needs.

## Guardrails

- The parent owns the stack and all dispatch; runners never build their own
  stack, edit code, or spawn.
- One waiver decision covers one item; it names the user, the reason, and
  the unverified risk. Silence is not a waiver.
- Do not run this stage on a dirty tree, a superseded HEAD, or before the
  review verdict — the cheap gate first, the expensive walk once.
