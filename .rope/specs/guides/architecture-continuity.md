# Architecture Decision Continuity Contract

## Scope

This contract applies to newly shaped Rope issue packages, legacy packages
entering execution, and whole-line/integration merges managed through Rope.

## Contract

- Every new `prd.md` contains `Architecture Impact` with `Impact: required | not-applicable` and a trigger-check explanation.
- A relevant source decision has a source path, source status, issue disposition, scope, invariants, public seams, forbidden shortcuts, required evidence, applicability mapping, documentation outcome, and conflict state.
- Source status and issue disposition are separate fields. Retrieved history is not an active constraint until status, scope, and replacement are checked.
- Document maintenance follows the shipped [current documents contract](../../../skills/rope-clear/references/current-docs.md). Cleanup approval is defined by [rope-clear](../../../skills/rope-clear/SKILL.md); this spec does not duplicate its procedure.
- `prd.md` owns the complete Constraint Bundle. `tasks.md` references decision/constraint IDs and maps them to slice evidence.
- Shape reads applicable effective source sections before slicing. Package
  readiness requires actual bundle mappings, required source paths/sections,
  architecture evidence, and resolved dispositions. No-source candidates need
  an explicit resolved record, not a fabricated spec path.
- Implementer/reviewer briefs require bundle path, Constraint IDs, required
  source paths/sections, and short inline global invariants. A checked `none`
  is explicit; missing or placeholder fields block dispatch.
- Implementers read scoped sources before product/test edits and record an
  Architecture landing (≤3 lines: responsibility reused, public seam used,
  ownership/direction preserved). Return source sections read and the pre-edit
  record reference. Missed steps need honest correction evidence, not backdating.
- Effective specifications take precedence over slice-local convenience;
  applicable conflicts stop the affected slice for parent resolution and user
  confirmation of changes/exceptions where required.
- The Return Gate reconciles architecture evidence mechanically. The reviewer
  reads effective sources upfront and judges invariants, ownership, dependency
  direction, compatibility, and exception bounds. Verify checks only records
  and documentation routing, not code or product truth.
- Full declared architecture guard coverage is issue-level evidence, not the
  full product suite or a per-slice/per-merge ritual. Per-entry exception deltas
  and guard weakening are reviewed; new/widened exceptions and bulk freezes
  require a confirmed disposition before implementation.
- Whole-line merges check current-target constraints on a candidate merge and
  record reconciliation, guards, and review before moving the target.
- Operational owners: [package readiness](../../../skills/rope-shape/references/architecture-continuity.md#package-readiness-gate)
  and [execution gates](../../../skills/rope-go/references/architecture-gates.md).
  These are agent-executed rules; no harness interceptor is introduced.
- Confirmed documentation work may be `pending-finish` during verify. Finish changes it to `updated-existing`, `added-new`, `no-new-decision`, or `exception-recorded`.
- Finish pauses when it discovers an unconfirmed architecture change.

## Tests Required

- Package-template read-through confirms the Architecture Impact and Constraint Bundle fields.
- Slice-template read-through confirms mandatory IDs, scoped source reading,
  and architecture evidence mapping independently of matrix evidence.
- Leaf-brief read-through confirms pre-edit source reading/landing, conflict
  stop, mechanical evidence return, and the existing brief budget.
- Review/integration read-through confirms current sources, guard coverage,
  per-entry exception review, and candidate acceptance before target movement.
- Verify format includes an architecture continuity section and distinguishes pending documentation from code findings.
- Finish checklist includes all four terminal documentation outcomes and the unconfirmed-change pause.
- Installer smoke confirms bundled skills and references are installed to the target without overwriting settings.

## Wrong vs Correct

### Wrong

```text
Implement Slice 2. Follow the ADR. Add tests.
```

The leaf must infer which decision applies, what invariant matters, and what proves it.

### Correct

```text
Slice 2 constraints:
- Bundle path: .rope/issues/<issue>/prd.md (Constraint Bundle section)
- Constraint IDs: D1
- Required reading: .rope/specs/<area>/<topic>.md — Ownership, Public seam,
  plus status/scope context
- Global invariants (short, inline): <the applicable source invariants>

Before editing: read D1's bundle record and effective source sections.
Architecture landing: reuse <owner>; call <public seam>; keep <lifecycle>
owned by <owner>, not copied into the new entrypoint.
Return: source sections read + pre-edit record reference + D1 evidence.
Conflict: stop the affected slice and return it to the parent.
```
