# Review-Cost Optimization — Spec

Cost contract for the end-of-issue review. Source of truth:
`.rope/adr/0010-parallel-two-leaf-end-of-issue-review.md` (gate semantics:
ADR 0007; Matrix-as-spec: ADR 0009; product-run scope split: ADR 0015).
Supersedes the ADR 0004 `review:` frontmatter regime, which no longer
exists.

## Shape (two parallel leaves, one gate)

- Scanner leaf (`rope-explore` + Standards brief) and Behavior reviewer
  (`rope-reviewer`) are spawned **in one message**; first response =
  max(leaf times), not their sum.
- Only the E2E acceptance stage touches a live product (ADR 0015): under
  agent dispatch both review leaves are code-only; ports and processes
  belong to the parent-owned stack and its runner leaves after `approve`.
- Aggregation is mechanical: verdict = worst of axis verdicts
  (`approve` < `changes_requested` < `blocked`); no rerank, no merge, no
  parent re-judgment.

## Scanner budget

- Brief: diff command (excludes applied) + commit list + standards-source
  paths + inline global invariants + pasted smell baseline (~35 lines).
- Runs lint/typecheck/build first; skips what tooling enforces.
- Returns `clean` or ≤200 words of `{severity, path:line, issue, fix}`.

## Reviewer budget

- Brief: diff command (same excludes) + commit list + Matrix rows + e2e
  path (high-risk reading only) + inline invariants. No map; bundle path
  only on suspected conflict.
- Code-only (ADR 0015): reads the assembled diff against the Matrix and
  high-risk boundaries; never boots the product.

## E2E stage budget (ADR 0015)

- One parent-owned stack per issue (boot once, readiness-probe, teardown);
  runner leaves are cheap read-only workers, one journey per leaf.
- Parallel when resource-disjoint (isolated browser sessions); serialized
  on shared accounts or mutable state. After a fix: delta re-review +
  affected journeys only, on the new HEAD — evidence cites its commit.

## Diff hygiene

```md
git diff <base>...HEAD -- . ':(exclude)*lock*' ':(exclude)*.snap' ':(exclude)dist/'
```

Extended per repo (vendor/, build output, generated files). Lockfile and
snapshot noise is 20–50 % of a web project's assembled diff — both leaves
pay for every included line.

## Fix protocol

- Severity is binary: `blocking | note`. Notes are recorded in
  `tasks.md`, never fixed by a round.
- Every finding: `path:line` + one-sentence fix. The fix brief transcribes
  blocking findings verbatim — zero exploration.
- ≤2 automated rounds, then Human Escalation Stop (ADR 0007).
- Post-fix re-review is delta-only: scanner on the fix-commit diff;
  reviewer re-probes affected paths only. Full re-review never repeats.

## Forbidden shortcuts

- Scanner running the product (port/process exclusivity lives with the
  E2E acceptance stage, ADR 0015 — and with it the parent, not any leaf).
- Parent re-ranking or merging axis findings (second-reviewer emergence).
- `note` findings entering a fix brief.
- Full re-review after a fix round.
- Map path or upfront bundle deep-read in the reviewer brief.
- Per-slice review in any form (ADR 0007).
