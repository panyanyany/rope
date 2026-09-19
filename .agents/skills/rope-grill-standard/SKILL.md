---
name: rope-grill-standard
description: Clarify software requirements through self-contained risk-based discovery, decision grilling, architecture checks, and Rope-compatible documentation without delegating to another grilling skill.
---

# Rope Grill Standard

Self-contained requirements discovery for work that needs more rigor than a
quick clarification but should not become an unbounded design interview. This
skill owns the entire discussion: exploration, questioning, decision tracking,
documentation, architecture impact, and the final Rope-compatible handoff.
Do not delegate the discussion to `grill-me`, `grill-with-docs`, or `rope-grill`.

## Plain-language rules

Use product language with the user. Say:

- “what behavior must we guarantee” instead of “Behavior Contract”
- “where the user sees the error” instead of “failure visibility”
- “a shortcut that could pass shallow tests but violate the intent” instead of
  “forbidden shortcut”
- “this needs your explicit approval” instead of “human gate”

Every decision question contains:

1. One plain-language question.
2. A recommended answer.
3. A concrete example of what the user, API, or operator would see.
4. The tradeoff of the other option.

Number every visible option. A bare numeric reply selects that option.
Ask one question at a time when later questions depend on the answer. Group
only genuinely independent decisions.

## Phase 1: discover facts

Before asking the user:

1. Restate the requested outcome and suspected ambiguity.
2. Read the relevant code, tests, configuration, and local conventions.
3. In a Rope repository, read `.rope/CONTEXT.md`, `.rope/routes.md`,
   relevant `.rope/specs/`, `.rope/adr/`, and `.rope/research/`.
4. Separate facts from decisions. Look up facts in code or documentation;
   ask the user only about product choices, policy, tradeoffs, or missing
   authority.
5. Check glossary conflicts and contradictions between the request, code, and
   existing documentation before continuing.

## Phase 2: select discussion depth

Choose the shallowest depth that covers every implementation-changing branch.
State the selected depth briefly; allow the user to override it.

### Quick

Use when the blast radius is local, behavior is obvious, and no public
contract, data boundary, permission, deployment, or architecture decision
changes.

Resolve:

- target behavior
- acceptance criteria
- regression test

Normally ask no more than three questions.

### Standard

Use by default for a feature or non-trivial bug fix.

Resolve:

- affected users, callers, or records
- primary successful flow
- failure behavior and where it is visible
- meaningful empty, duplicate, unavailable, or boundary cases
- compatibility and regression expectations
- acceptance evidence

Normally ask no more than five decision questions. The budget is a stopping aid,
not a target.

### Architecture

Use when any architecture trigger is present:

- public interface changes
- dependency direction or module seam changes
- state, lifecycle, persistence, permissions, concurrency, or error semantics
  change
- a caller, entrypoint, adapter, or runtime is added
- an existing responsibility may be duplicated
- an ADR or spec is cited or contradicted

Inspect the relevant decisions, resolve their disposition, and record the
invariants and evidence needed to prove them. Continue until all high-impact
branches are resolved, not until an arbitrary question count is reached.

### Investigation

Use when the main uncertainty is factual or the request conflicts with the
existing code or documents. Explore first, show the evidence, then ask only
the decision that remains. Do not make the user answer questions the repository
can answer.

## Phase 3: control the decision tree

Ask a question only if a different answer could change at least one of:

- implementation structure or approach
- observable user or API behavior
- data model, persistence, migration, or compatibility
- authorization, security, privacy, reliability, or deployment
- tests or acceptance evidence

For every unresolved question, identify its impact before asking it. Resolve
blockers before sibling branches. After each answer:

1. Mirror the chosen decision in plain language.
2. Update the working contract.
3. Run the mandatory persistence checkpoint below.
4. Remove questions made irrelevant by the answer.
5. Recalculate whether any high-impact branch remains unresolved.

Stop when all implementation-changing decisions are resolved or explicitly
delegated, acceptance behavior is testable, and remaining uncertainty is
low-risk engineering judgment.

### Mandatory persistence checkpoint

This checkpoint runs after every substantive user answer and before the next
question. It is not optional and must use the file tools, not only the chat
context:

1. Classify the decision as a domain term, stable contract/gotcha, external
   fact, architectural tradeoff, or issue-local product decision.
2. Write it immediately to the smallest appropriate durable document:
   - domain term -> `.rope/CONTEXT.md`
   - stable contract/gotcha -> `.rope/specs/<area>/<topic>.md`
   - external fact -> `.rope/research/<topic>.md`
   - architectural tradeoff -> `.rope/adr/`
   - issue-local product decision -> the current issue decision record or,
     before an issue package exists, `.rope/issues/<slug>/grill-decisions.md`
3. Re-read the changed file or the written section to verify the write.
4. Tell the user what was saved and where, for example:
   `已记录 D2：失败时保留原数据，写入 .rope/specs/orders/cancellation.md`
5. Only then ask the next question.

If no durable document is appropriate, say so explicitly and append the
decision to `.rope/issues/<slug>/grill-decisions.md` with status
`issue-local / pending issue package`; never leave a confirmed decision only in
the conversation. This single file is a clarification ledger, not an issue
package: do not create `prd.md`, `tasks.md`, `matrix.md`, or other issue
artifacts until the shared-understanding gate is confirmed. When full flow is
chosen, carry this ledger into the issue package; when direct go is chosen,
pass its path with the confirmed contract. If the repository has no `.rope/`
layer, stop and ask where the user wants the decision record stored before
continuing.

When an existing document must be changed, preserve unrelated user changes and
append or edit only the relevant section. Do not claim a decision was saved
without a successful file write and verification.

## Phase 4: maintain the compatible contract

Maintain these six fields throughout the discussion:

1. System under test
2. Trigger or input
3. Collaborators
4. Observable result
5. Failure visibility
6. Shortcut that could pass shallow tests but violate the intent

Stress-test at least:

- primary-path success
- failure visibility
- one meaningful boundary case
- the forbidden shortcut
- empty input or unavailable dependency when relevant

The user must be able to repeat the final decision without knowing Rope
terminology. If not, stop and explain with a concrete scenario.

## Phase 5: crystallize decisions

Write confirmed decisions as they become stable; do not wait until the end.
Only create or update the smallest relevant document:

| Decision | Destination |
| --- | --- |
| Canonical domain term | `.rope/CONTEXT.md` |
| Stable contract or gotcha | `.rope/specs/<area>/<topic>.md` |
| Reusable external or platform fact | `.rope/research/<topic>.md` |
| Hard-to-reverse, surprising tradeoff with credible alternatives | `.rope/adr/` |

Do not write contested choices as settled. Do not put implementation steps,
temporary facts, or ticket details in `CONTEXT.md`.

The persistence checkpoint takes precedence over the routing gate: the final
recap is not allowed to contain a confirmed decision that has no document path
or an explicit `issue-local / pending issue package` status.

For architecture work, maintain a decision entry for each relevant source:

```md
- ID: D1
  Source: <.rope/adr/... or .rope/specs/...>
  Decision status: active | superseded | deprecated | provisional | unknown
  Scope: <behavior and boundary>
  Decision disposition: inherit | extend | supersede | exception | not-applicable
  Inherited invariants:
    - <invariant>
  Affected public interfaces: <seams or none>
  Forbidden shortcuts:
    - <shortcut>
  Required evidence: <test, integration check, review, or documentation>
  Applies to: issue | Slice N | e2e | verify
  Documentation update: pending-finish | updated-existing | added-new |
    no-new-decision | exception-recorded
  Unresolved conflicts: <none or conflict>
```

If no architecture trigger applies, record a lightweight `not-applicable`
check. If uncertain whether a trigger applies, treat impact as required until
resolved.

## Phase 6: finish and route

Produce a shared-understanding recap with:

- scope and explicit non-goals
- six-field behavior contract
- confirmed decisions and their document paths
- primary, failure, boundary, and shortcut scenarios
- acceptance criteria and required evidence
- open risks or human gates
- recommended next step

After the user confirms the recap, present the compatible numbered route:

```text
1. 完整流程：写 issue → shape → go
2. 直接 go：跳过 issue 和 shape
```

If the user chooses the full flow, the recap must be sufficient to form a
shape-ready contract. If the user chooses direct go, the confirmed contract and
decision paths must be sufficient for implementation without first creating an
issue package. Do not create issue artifacts before the user confirms the
shared understanding.

This skill does not implement feature code. It owns the clarification and
decision record; implementation is a separate execution step.

## Guardrails

- No answerable uncertainty as a user question.
- No silent resolution of conflicting ADRs, specs, or code behavior.
- No ADR for a reversible, unsurprising, non-tradeoff choice.
- No feature implementation while grilling.
- Schema, dependency, authentication, deployment, destructive filesystem/git,
  production, or shared-environment changes require explicit approval.
