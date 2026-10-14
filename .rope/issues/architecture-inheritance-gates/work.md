# Architecture inheritance gates

## Agreement

User-authorized local skill changes after discussion:
- Shape consumes effective product/architecture specifications before cutting slices; each slice names required source files and sections.
- Before writing code, implementer reads those sources and records at most three lines: existing responsibility reused, public seam used, and responsibility/direction that must remain unchanged. This is evidence, not another approval/review round.
- Existing effective specifications take precedence over slice-local convenience. Conflicts stop the affected slice and return to the parent; changing an architecture disposition requires explicit resolution and user confirmation where required.
- Include architecture guards and whitelist/exception deltas, without making every slice run the full product suite.
- Whole-line/integration merges are covered separately from ordinary slice merges.
- Keep briefs within the existing budget; use scoped reading by reference, mechanical Return Gate, one end-of-issue review, and paperwork-only verify.
- No global skill installation without user confirmation.

## Scope

Shipped shape/go/verify contracts and templates, harness role guidance, minimal canonical architecture-continuity spec/context corrections. No agent-workbench product edits, bulk migration of old issues, new execution kernel, or unrelated documentation cleanup.

## Acceptance

1. Shape rejects missing/empty constraint mappings and unresolved applicable conflicts; required impact carries concrete decision sources or an explicit resolved no-existing-source candidate.
2. Implementer brief requires Constraint IDs, Required reading paths/sections, and Architecture landing return evidence; code starts only after source reading and landing statement. Explicit justified `none` is allowed for checked non-applicability, not as a convenience escape.
3. Relevant effective sources are read by the reviewer; IDs alone and conditional-on-suspected-conflict bundle reads are insufficient.
4. Slice Return Gate checks the declared architecture evidence mechanically, with missing items bounced and conflicts stopped, not parent code review.
5. Declared architecture guard coverage and added/removed/modified exception entries are recorded at issue level and reviewed; new/widened exceptions and bulk freezes need confirmed dispositions.
6. Integration branches use a candidate merge with current-target constraints, full applicable architecture guard coverage, reconciliation record, and review before moving the target. Evidence is invalidated by target/candidate changes.
7. Verify checks complete records without rejudging code or rerunning green checks.
8. Existing offline smoke tests and skill portability checks pass. Tests establish structure/installability, not live model compliance.

## Static contract walkthrough

| Case | Required outcome / rule owner |
| --- | --- |
| Required impact, empty bundle | Return to shape before dispatch — package readiness |
| IDs present, source sections absent or only claimed read | Block dispatch / bounce missing evidence — package readiness + architecture execution gates |
| Effective spec assigns lifecycle to a shared domain, slice suggests duplicating it | Stop affected slice, resolve/re-shape; independent work continues — source precedence |
| No existing source found after targeted lookup | Resolved candidate ID/invariant/seam/evidence + issue-local reading source; do not fabricate a spec |
| Source reading was skipped before editing | Honest omission + scoped source-based correction + reviewer acceptance; no retroactive evidence |
| Whitelist widened to silence a failing guard | Confirmed bounded disposition before implementation, per-entry review; green guard alone insufficient |
| Old integration branch conflicts with current target ownership | Candidate merge + current-target sources + reconciliation + full architecture guard/review before target moves |
| Ordinary slice merge | Focused evidence return and serial merge; no per-merge full-suite ritual |

This is a manual document/contract walkthrough, not a live model compliance test.

## Efficiency choices

- Keep the ≤60-line brief budget; paths/sections and evidence references travel by reference.
- One scoped source read per fresh leaf context; no full `.rope/` scan and no inline source dumps.
- Architecture landing ≤3 lines, no new human approval or per-slice code-review round.
- Return Gate checks records; reviewer owns semantic judgment; verify checks paperwork.
- Full architecture guard scope once at frozen issue/candidate state, with matching evidence reuse; not the full product suite and not repeated on every merge.
- No execution kernel or harness interceptor; these are explicit agent-executed contracts with observable evidence requirements.

## Verification and status

Local modifications complete, performed directly by the parent after the user prohibited further subagents. The earlier exploration was read-only.

- Offline smoke: `node --test tests/*.test.mjs` — 3/3 passed (frontmatter, distributed references, CLI installation).
- `git diff --check` — passed.
- `grep -rn 'ADR [0-9]' skills/` — zero hits.
- No live issue/leaf compliance test, no agent-workbench product changes, no global skill/preset installation, no commit made.
- Initial unrelated untracked `.rope/upstream/mattpocock-skills/reviews/2026-10-08-f3fc563.md` preserved.
