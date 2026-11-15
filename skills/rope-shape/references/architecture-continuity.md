# Architecture Continuity

Use this reference from shape, go, verify, and finish. The issue package is the transport; `.rope/adr/` and `.rope/specs/` remain the decision sources.

Before treating a retrieved passage as a requirement or updating a decision,
read [current documents](../../rope-clear/references/current-docs.md) and
check its status, scope, and replacement. A grep hit alone is not a constraint.

## Trigger check

Shape performs a targeted lookup through `.rope/GLOSSARY.md`, routes, the confirmed seams, task references, and relevant ADR/spec paths. It does not scan every architecture document.

Set `Impact: required` when any trigger applies:

- an existing public interface changes;
- a dependency direction or seam changes;
- state, lifecycle, persistence, permission, concurrency, or error semantics change;
- a caller, entrypoint, adapter, or runtime is added;
- an existing responsibility may be duplicated;
- the task cites or depends on an ADR, spec, or architecture issue.

Set `Impact: not-applicable` only after recording a lightweight check showing why none applies. Uncertainty is `required` with an unresolved question, not `not-applicable`.

## Decision record

For every relevant source, record one entry in `prd.md`:

```md
- ID: D1
  Source: .rope/adr/NNNN-slug.md or .rope/specs/area/topic.md
  Decision status: active | superseded | deprecated | provisional | unknown
  Scope: <behavior and boundary covered>
  Decision disposition: inherit | extend | supersede | exception | not-applicable
  Inherited invariants:
    - <behavior or dependency invariant>
  Affected public interfaces: <seams or none>
  Forbidden shortcuts:
    - <lazy path that could pass shallow tests but violate the decision>
  Required evidence: <test, integration check, review judgment, or doc>
  Applies to: issue | Slice N | e2e | verify
  Documentation update: pending-finish | updated-existing | added-new | no-new-decision | exception-recorded
  Unresolved conflicts: <none or sources and affected behavior>
```

`Decision status` describes the source. `Decision disposition` describes this issue. Keep them separate. An `unknown` source status blocks only when the uncertainty could change the applicable rule or disposition; otherwise carry the uncertainty explicitly.

Use dispositions this way:

- `inherit`: preserve the decision and its invariants.
- `extend`: preserve the core invariants while expanding scope or compatibility.
- `supersede`: replace the source decision with an explicitly accepted alternative.
- `exception`: violate a named invariant only within a bounded, documented scope.
- `not-applicable`: the source has no bearing on this issue's behavior.

If two sources conflict and no source explicitly supersedes the other, list both, explain the affected behavior, and block shape until the conflict is resolved. A leaf never resolves it silently.

When triggers apply but targeted lookup finds no source, write:

```md
- Relevant decisions: none found
- New decision candidate:
  - Scope: <new boundary or responsibility>
  - Risk: low | high
  - Decision needed: <parent/user decision or explicit no-new-decision rationale>
```

High-risk candidates (hard to reverse, public-contract changing, or involving a real tradeoff) block shape. A low-risk candidate may proceed only with an explicit parent conclusion.

For an older package without Architecture Impact, perform the targeted check and fill the applicable mappings before go dispatches affected slices. Record `legacy package` and the assessment; missing history is not permission to execute without constraints. Do not bulk-migrate unrelated packages.

## Constraint Bundle

`prd.md` is the canonical full bundle. Include:

- decision sources and source statuses;
- scope;
- invariants;
- public seams;
- forbidden shortcuts;
- acceptance evidence;
- open conflicts and new candidates.

Map every decision and invariant to `issue`, one or more slices, `e2e`, or `verify`, and name the evidence that proves it. `tasks.md` references these IDs and records slice applicability; it does not copy the full bundle.

The parent keeps the full bundle. Every slice has a nonempty `Constraint IDs:` field and `Required reading:` paths with section headings. Include issue-wide invariants as well as slice-specific IDs. Select the smallest source sections sufficient to establish responsibility ownership, the public seam, and forbidden shortcuts; include their status/scope/replacement context. A bundle summary does not replace reading the effective source.

For checked non-applicability, use `Constraint IDs: none — <trigger-check reason>` and `Required reading: none — <reason>`. Docs-only work is not automatically non-applicable: changing a specification can affect an architecture decision.

The parent reads the applicable sources **before slicing**, then derives these mappings. Leaves read only their mapped sections, not the entire `.rope/` tree. An implementer records an **Architecture landing** before writing code: at most three lines naming the existing responsibility reused, the public seam used, and the ownership/dependency direction that must remain unchanged. Return the actual source-reading record references and this statement as evidence, not merely a list of paths claimed read. This is not a new approval round or a speculative file-by-file plan.

Effective specifications take precedence over slice-local implementation convenience. A source/bundle mismatch or a need to change a disposition stops the affected slice and returns to the parent for source-status resolution, re-shaping, and user confirmation of changes/exceptions where required. Independent slices may continue.

## Package readiness gate

Shape checks these conditions before declaring the package ready; go checks them again before dispatch. Missing or placeholder-only fields return to shape, not to an implementer to invent:

- Every issue has an Impact result and trigger-check reason. `required` has a nonempty bundle, decision records with concrete source file paths and applicable sections, resolved dispositions, and no applicable open conflict.
- If targeted lookup found no existing source, retain `Relevant decisions: none found`; assign the resolved new candidate an ID, rationale, invariant, public seam, evidence, and scope in the bundle. Its issue-local path/section is the reading source until a canonical document exists. An unresolved candidate is not a substitute for a bundle; never fabricate a spec reference.
- Every slice maps its Constraint IDs to actual bundle records, carries required source reading and architecture evidence, and includes global applicable IDs. A justified `none` must agree with the trigger check, not merely with the slice's label.
- Testing Decisions identifies architecture guard commands/coverage and exception-list paths (or explicitly records their absence and the manual invariant review needed). Slices carry affected guard evidence; full architecture guard coverage is issue-level evidence. Execution and integration mechanics: [architecture gates](../../rope-go/references/architecture-gates.md).

Package completeness is a dispatch gate, not proof that the constraints were obeyed.

## Continuity checks

The end-of-issue reviewer judges behavior, invariants, dependency direction, responsibility ownership, public compatibility, and exception bounds against the effective sources. Verify checks the recorded mappings, evidence, review, and documentation outcomes only; it never re-judges code. Neither requires an internal implementation shape absent from the source contract.

For `not-applicable`, record the lightweight trigger check. For `inherit`, every invariant needs evidence. For `extend`, `supersede`, or `exception`, evidence must cover the changed boundary and the documentation outcome. Confirmed documentation that is still unwritten is `pending-finish`, not a code finding.

Finish changes `pending-finish` to one terminal outcome:

- `updated-existing`
- `added-new`
- `no-new-decision`
- `exception-recorded`

If finish discovers an unconfirmed architecture change, pause for a disposition decision. Do not invent an exception or close with a documentation todo.
