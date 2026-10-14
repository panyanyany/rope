# Architecture Execution Gates

Read for every issue at startup and dispatch; the integration section also
applies when Rope is asked to land a long-lived or assembled feature branch.
The [package readiness gate](../../rope-shape/references/architecture-continuity.md#package-readiness-gate)
owns constraint completeness. These are agent-executed gates, not a harness
interceptor: record their evidence rather than claiming automatic enforcement.

## Dispatch and source reading

Before implementer/review dispatch, the parent checks package readiness and brief completeness:
`Constraint IDs:`, `Required reading:`, bundle path, short global invariants,
and architecture Required-evidence IDs. IDs resolve to the bundle; paths and
sections resolve to effective sources. Missing, empty, or placeholder-only
fields block dispatch. Use a justified `none` only as defined by package
readiness. Reuse the slice mapping in correction briefs; new architecture
requirements return to shape rather than appearing only in a fix brief.

The implementer reads the mapped source sections **before any product/test
edit**, including status/scope/replacement context, then records the
Architecture landing in its work log or first progress message. Return that
record (path or message reference), source-reading tool/command record
references keyed to the sections, and a one-line confirmation per applicable
ID. A path list or `read: yes` claim alone is not reading evidence; reference
the actual read record, not an inline transcript/source dump. Keep references
accessible after worker cleanup (preserve a compact read-record extract if the
host does not retain them). Read each relevant section once per fresh
leaf context; changed sources require a reread. Do not dump source prose into
briefs or return summaries. A source conflict or missing source stops the
affected slice; the parent resolves it before re-dispatch, with user
confirmation for changes/exceptions where required.

If edits began without source reading, record the omission and stop; a late
statement cannot prove a pre-edit step. Re-brief source-based rework or
revalidation of the affected changes, with the omission/correction evidence
passed to the end-of-issue reviewer. Never backdate or fabricate a record.

On landing, the Return Gate checks these records and the declared affected
guard/exception evidence mechanically. Missing evidence bounces exactly its
IDs; a reported architecture conflict blocks landing for resolution, not
another attempt at implementing the same conflicting brief. The parent does
not review code or rerun tests to fill gaps. Independent ready work continues.

## Guards and exception deltas

Shape declares commands and exception-list paths in Testing Decisions. Slice
evidence includes guards the slice can affect and an exception delta against
its declared base (explicit `none` when unchanged). Existing exception entries
are not authorization to add another. New/widened exceptions, weakened guard
rules, or bulk freezing of old assertions need a bounded decision disposition
confirmed by the user **before** implementation; a failing guard is not itself
a reason to change its whitelist. Otherwise fix the implementation or report
the conflict to the parent.

At frozen assembled HEAD, the Standards scanner runs **all declared applicable
architecture guards over their full architecture scope**, alongside the
impact-selected lint/typecheck/build. This is not the full product test suite
and not a per-merge ritual. Reuse green evidence only for the same HEAD and
relevant environment; record command, coverage, exit status, output path, and
commit. No guard exists: record that absence and require manual invariant
review, never label it a guard pass. A missing guard declaration returns to
shape. A later fix affecting guard inputs invalidates that evidence.

The reviewer reads the applicable bundle records and effective source sections
upfront, then checks the assembled architecture against them: responsibility
ownership, public seam usage, dependency direction, lifecycle/state ownership,
and forbidden shortcuts. It also examines **every added, removed, or modified
exception entry** against the issue base: entry/path, reason, Constraint ID,
disposition/confirmation, and expiry or invalidating condition for retained
exceptions. Include changes to guard rules/coverage themselves. Report an
explicit `none` if there is no delta. A green guard with a widened whitelist
is not architecture acceptance.

Review returns include source-reading references, guard output pointers (scanner),
and exception-delta findings/coverage (reviewer) outside the short findings
summary. Preserve the scanner's ≤200-word summary budget; evidence paths are
not a second prose report. Neither diff exclusions nor generated-file filters
may hide declared guard rules or exception-list changes.

Record source-reading/landing evidence pointers, guard evidence, exception
delta + review outcome, and resolved conflicts in `tasks.md`. Verify checks
these records only; semantic judgment remains with the one reviewer gate.

## Whole-line / integration merge

This branch applies to a long-lived feature line or integration branch, not
ordinary slice branches covered by the issue's merge queue. Even without an
existing issue package, create a scoped integration record under
`.rope/issues/<slug>/`: target and incoming SHAs, current-target Architecture
Impact/Constraint Bundle, required source sections, reconciliation decisions,
guard commands, exception deltas, and evidence/review records. Reuse existing
issue records by reference; do not reslice already completed work.

1. Read the **current target's** effective specifications; incoming branch
   summaries or old constraints do not supersede them. Record each architecture
   mismatch as `re-home to current ownership/seam` or `retain with confirmed
   bounded exception/supersession`, with reason and evidence. Unresolved
   mismatches block landing.
2. Build a candidate merge in an isolated checkout or temporary branch without
   moving the target. Conflict repair rides a brief with these current-target
   constraints. Check the entire incoming/candidate delta against the target,
   not just conflict-resolution hunks.
3. Run the declared full architecture guard coverage on the clean candidate
   and the same two-axis review over target→candidate, including per-entry
   exception deltas. Reference the underlying issue behavior/evidence and
   review existing-behavior compatibility; missing acceptance obligations
   remain explicit blockers, not invented passes. Reuse matching candidate evidence; do not duplicate a
   review that already covered this exact candidate and target. No automatic
   full product-suite requirement is introduced.
4. Advance the target only after guard evidence, confirmed reconciliation,
   and review approval are recorded, and only when the user requested landing.
   A changed target or candidate invalidates the acceptance: rebuild and check
   the changed result. Remove disposable candidate resources after landing or
   preserve their refs explicitly if blocked. Product acceptance/E2E obligations
   of the underlying issues still apply; architecture approval does not replace
   them.
