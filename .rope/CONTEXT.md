# Context

## Language
**Parent Orchestrator**:
The main issue session that owns grill, shape, the slice loop, leaf-worker dispatch, issue-level verify, and finish handoff. It is the only agent allowed to spawn workers for an issue. Judgment-primary and context-protective: it decides, talks to the human, writes durable artifacts, and re-briefs/steers leaves — it does not bulk-load exploratory noise or run long implement/fix loops in its own context, because compaction discards earlier discussion. Course correction is done by rewriting the brief and re-spawning a leaf, not by the parent absorbing the full failure trace and fixing in-place.
_Avoid_: main session (ambiguous), god agent, multi-agent swarm, pure router, parent self-implements everything
_Historical alias_: Planner Window / Window A (optional deployment mode, not the architecture)

**Leaf Worker**:
A subagent (or equivalent host worker) that receives a self-contained brief, does one job, and returns a summary plus artifact paths. Implementer, reviewer, and explore are leaf roles. Leaves also execute course-correction work after the parent rewrites the brief. A leaf worker must not spawn other workers.
_Avoid_: nested subagent, child orchestrator
_Historical alias_: Implementer Window / Window B when the host cannot spawn code-writing workers (degraded top-level session)

**Human Escalation Stop**:
When leaf fix loops fail twice on the same problem, or the parent judges the failure is a design/requirements/contract issue rather than an implementation miss, the parent stops automated repair and presents a short precise problem statement to the user for a decision. It does not keep re-spawning leaves hoping the third try works.
_Avoid_: infinite fix loop, silent retry, bury the design conflict in more patches

**Harness Profile / Role Preset**:
A binding of Rope leaf roles (implementer, reviewer, explore) onto **harness-native** subagent/agent preset templates. Generated **discovery-based**: the running model identifies the host, probes its agent registry and model catalog at run time, and writes the host's native format (pi Markdown+frontmatter, codex TOML, …) — no hardcoded per-host adapter branches in the skill. Default write target is the host's **user-level** agents directory (machine-local model churn). Plus a thin **user-global** Rope manifest (not project `.rope/`) that maps role → preset name/model and generation metadata. Refresh is **manual only** (no TTL/stale timer). The host preset is the source of spawn configuration; Rope does not keep a second full prompt/tool database as primary. The explore preset carries an **unrestricted tool surface** — mode discipline (read-only default; research briefs write `.rope/research/**` only) lives in the preset body, never in tool restriction.
_Avoid_: hard-coded model list in skills, provider lock-in, Rope-only shadow agent runtime, default project-committed model ids, project-committed private model catalogs, automatic preset refresh, per-host adapter branches in skill text

**Issue-Level Verify**:
The thin paperwork gate between go and finish (ADR 0007): the end-of-issue
review really ran (verdict + identity + fix rounds recorded), every E2E item
is terminal with drift hunted, per-slice commits present, tree clean,
architecture documentation outcomes routed. Read-only on everything; never
re-judges code or product truth — that verdict belongs to the end-of-issue
reviewer.
_Avoid_: second code review, replaying green tests, trusting verdict claims
without identity

**End-of-Issue Review**:
The single code-review gate after all slices (ADR 0007, mechanics refined by
0010, product-run scope split by 0015): **two parallel read-only leaves with
new eyes**, spawned in one message against a frozen clean HEAD (every slice
merged, tree clean, no leaf running), fix loop ≤2 rounds with delta
re-review. The **Standards scanner**
(explore-class preset, cheap model) runs lint/typecheck first, then
judgement-call-scans the assembled diff for repo conventions, TDD
anti-patterns, the smell baseline, and inline global invariants — never runs
the product. The **Behavior reviewer** (`rope-reviewer`, strong model) reads
the assembled diff against the Behavior Matrix and gives high-risk
boundaries the deepest look. The reviewer is
code-only: starting the product, walking the real entrypoint, and running
e2e items belong to the **E2E acceptance stage** that follows an `approve`
(ADR 0015). Aggregation is mechanical — verdict = worst of axis verdicts, no
rerank. Findings are `blocking | note` with path:line + one-sentence fix;
only blocking enters the one fix brief (≤2 rounds, then Human Escalation
Stop); post-fix re-review is delta-only. Per-slice review no longer exists.
_Avoid_: review (wrong level), per-slice verdict bookkeeping, silent
self-check degradation, fixture-only acceptance, parent re-ranking axes,
scanner running the product, the reviewer re-walking journeys the E2E
Runner already proved

**Standards Scanner**:
The cheap read-only leaf of the end-of-issue review (ADR 0010): runs the
briefed lint/typecheck/build commands first (skips what tooling enforces),
then fast-scans the assembled diff against repo standards, TDD
anti-patterns, the fixed Fowler smell baseline, and the inline global
invariants — every hit a judgement call, never a violation, with
repo-documented standards overriding the baseline. Spawned from the
explore preset with the baseline pasted in the brief; returns `clean` or
≤200 words of `{severity, path:line, issue, fix}` findings. Never starts
the product; ports and processes belong to the E2E acceptance stage — the
parent-owned stack + E2E Runner leaves (ADR 0015).
_Avoid_: deep judgment in the scanner, hard-violation framing, moving
architecture-continuity judgment out of the Behavior reviewer

**Graph-Driven Execution**:
The post-0007/0008/0009 execution model. Shape slices tracer-bullet style
(blocking edges + fresh-context fit are the hard rules; component and
prefactor slices legal; vertical path-per-slice is a habit, not a rule). Shape reads the slice graph after
slicing — initial ready count, level widths and the longest gating chain
derived from the edges — and asks one execution question with those numbers. Go's default intent is maximum concurrency in either mode (every ready
slice gets a background leaf; serialization needs a recorded reason;
startup declares planned vs max parallelism). It picks a mode from host
capability: **worktree mode**
(slice-ready scheduling, ADR 0008/0012 — ready = seam-required blockers
merged (file-overlap edges are merge-order preferences under this mode), one worktree
per leaf, serial merge queue, repo-declared `worktree-setup:` contract in
`routes.md`, parent owns `map.md` updates) or **shared mode** (waves,
disjoint owned files per wave, leaves maintain the map; the parent serializes
to one leaf at a time because there is one index and one checkout). No `mode:` or
`review:` frontmatter; legacy packages that carry them are ignored.
Re-cutting that bends the requirement goes back to grill.
_Avoid_: wave barriers in worktree mode, asking serial-or-parallel before
the graph exists, merging in parallel, per-merge test rituals, leaves
writing the shared map concurrently

**Delivery Branch**:
The predeclared branch a worktree leaf points at its own final commit as
the last write before returning — commit everything, leave
`git status --porcelain` empty, then `git branch -f <delivery branch> HEAD`.
Stated in the brief because the host's own `pi-agent-<id>` cleanup branch is
not a name the merge queue can route on. The parent establishes the SHA
from git, so a leaf's claimed SHA is never trusted. This replaces parsing
branch names out of agent text.
_Avoid_: reading a branch name from a leaf's prose, trusting a claimed SHA,
routing on the host's `pi-agent-*` cleanup branch

**E2E Runner**:
The read-only product-driving leaf of the E2E acceptance stage
(ADR 0015), dispatched only after the two-axis code review returns
`approve`. One runner drives **one journey** through the project-declared
real entrypoint (browser, real message channel, CLI, API — the project
declares, Rope prescribes no tool); internal seams (submitter injection,
fixtures) are integration evidence and never substitute. The **parent owns
one shared test stack** — project-declared start command, readiness probe,
teardown; runners never build their own. Resource-disjoint journeys run as
parallel leaves with isolated browser sessions; journeys sharing an account
or mutable state serialize. A runner never edits code, never spawns, and
returns structured evidence (steps, tool/command, artifacts, per-item
pass/fail). Every required `e2e.md` item carries success evidence —
`agent_passed` (runner) or `user_confirmed` (user ran it) — or an explicit
per-item user waiver recorded as a waiver, never as a pass; otherwise the
issue stays blocked. After an E2E fix merges:
delta code re-review, stack re-deploys on the new HEAD, affected journeys +
shared-entry smoke re-run, reused evidence annotated with its commit.
_Avoid_: implementer signing acceptance, reviewer re-walking proved
journeys, per-runner stacks, headless injection recorded as entrypoint
truth, waivers absorbed silently

**Self-Fix Loop**:
A check/verify pattern (from Trellis) where the verifying model finds a problem and fixes it directly, then reruns checks, looping until green. Not used at issue-level verify in Rope, because verify must not edit code (cross-role separation of implement vs accept).
_Avoid_: auto-fix, retry (too generic)

**Escalation**:
The act of the verify model deciding on its own that a finding needs deeper inspection — either by reading more itself or by dispatching a read-only leaf (`explore`). Driven by the model's judgment, not by mechanical trigger rules.
_Avoid_: upgrade, promote (mechanical connotation)

**Upstream Harvest**:
A maintenance workflow for this Rope repository that compares pinned external inspiration sources (initially Matt Pocock skills, optionally Trellis) against the last reviewed revision, produces a human-facing review brief of idea/reference changes, and only after human accept/adapt/ignore decisions lands changes into Rope-native skills or `.rope/` docs. Not a product skill shipped by `rope add`, and not automatic vendor merge.
_Avoid_: sync (ambiguous with file copy), submodule update (mechanism only), one-time migration bridge (retired)

**Acceptance Behavior**:
The user- or caller-visible outcome a ticket or issue must make true. Layered (ADR 0009): **ticket-TDD** — each ticket's units proved by red→green at a shape-confirmed seam; **issue-BDD** — the Behavior Matrix is the issue's behavior spec (no slice pointers), walked at the real entrypoint by the end-of-issue reviewer; e2e.md carries real-environment behaviors only (`covered_by_slice` is deleted — anything that would earn it does not belong in e2e.md).
_Avoid_: TDD as “write many unit tests then code”, acceptance test as synonym for issue-level verify only, re-running every green unit test at verify by default

**Architecture Impact**:
The conditional shape-stage record of whether an issue touches an existing architecture decision, public seam, dependency direction, lifecycle, state, persistence, permission, concurrency, error semantics, adapter, runtime entrypoint, or duplicated responsibility. A `not-applicable` result is still an explicit lightweight check; an uncertain result is treated as requiring resolution.
_Avoid_: full architecture review for every task, inference from filenames or diff alone, architecture impact as an automatic ADR request

**Decision Disposition**:
The per-decision statement of how an issue handles a relevant existing architecture decision: `inherit`, `extend`, `supersede`, `exception`, or `not-applicable`. It is distinct from the source decision's status, which describes whether that source is active, superseded, deprecated, provisional, or unknown.
_Avoid_: one issue-level disposition for several decisions, silently choosing a disposition during implementation, treating exception as an undocumented shortcut

**Constraint Bundle**:
The portable architecture constraint set derived from effective sources before slicing: decision sources/statuses, scope, invariants, public seams, forbidden shortcuts, evidence, and conflicts. The parent keeps the full bundle; each slice/brief requires applicable global + slice IDs and source sections to read. A justified `none` is explicit. Effective sources take precedence over slice-local convenience; conflicts return to the parent.
_Avoid_: a bare instruction to “follow the ADR”, IDs without source reading, leaf-local reinterpretation, or a second canonical architecture document

**Architecture Landing**:
The implementer's pre-edit statement after reading mapped source sections: at most three lines naming the existing responsibility reused, public seam used, and ownership/dependency direction preserved. Returned with source sections read and the pre-edit record reference; checked mechanically, judged by the end-of-issue reviewer. No separate approval round.
_Avoid_: a copy of the spec, a file-by-file plan, retrospective evidence claimed as pre-edit reading

**Contract Note**:
A shape-time, user-facing projection of the issue's Behavior Contract: 3–5 one-sentence bullets answering “when this issue is done, what can you observe?”, plus failure visibility where relevant. Written into `prd.md` as `## Contract Note`; step 11 of `rope-shape` asks the user to confirm the note instead of reading the full PRD. Confirming the note confirms the Behavior Contract because the note is a direct projection of it — not a separate wish list. Verify still accepts against the Behavior Contract, matrix, and E2E.
_Avoid_: a second contract that can drift from the PRD, asking the user to read the full PRD by default, treating the note as an acceptance artifact

**Minimal Leaf Brief**:
The hard budget for implementer/reviewer briefs: a content allowlist (slice Public behavior one sentence; Behavior Contract 6 fields at their thinnest; mandatory Constraint Bundle path + global/slice Constraint IDs + short global invariants; test seam + one prior-art path) plus a required operational contract (source files/sections to read before editing and Architecture landing evidence; relevant artifact paths including the investigation map;
TDD red/green commands + red signal, expected return shape, no-nested-spawn
and commit rules). Everything else loads by reference; brief body ≤ 60 lines (paths and command blocks excluded). More enforceable than “be concise” because it can be checked before dispatch.
_Avoid_: full inline PRD paragraphs, inline bundle detail, speculative file-by-file plans, dropping TDD commands or return shape to save tokens

**Investigation Map**:
`<issue>/map.md` — one fact per line, each with a file path and a date.
Seeded at shape from exploration. Shared mode: implementers update the
lines their work falsifies before committing. Worktree mode: leaves report
falsified / needed lines in their summaries; the parent writes them after
each merge — concurrent leaves never share the file. Entries that stop
earning their line are deleted.
_Avoid_: dumping transcripts into the map, uncommented stale facts, inlining
the map into briefs

**Quick Fix Path**:
The lightweight solo entry (`rope-quick`) for small tasks that fit **one fresh context window** — already-diagnosed fixes **and** small features. One model runs **grill-lite** (fact self-check against the tree + one round of decision questions, Q&A recorded into quick.md), changes red→green / test-first at the nearest seam, commits locally, and syncs `.rope/` docs inline. No issue package, no leaf dispatch, no issue-level verify; the human is the accept gate, assisted by the closing report's risk-focus section. Four stop lines (new architecture decision, change failed twice, scope sprawl, schema/destructive/production) abort to the full pipeline with `status: stopped` in `quick.md` — the solo-session replacement for "leaf conflict returns to the parent".
_Avoid_: treating quick as a replacement for the full pipeline on any issue, silent absorption of newly discovered architecture decisions, tests-green-only claims without red evidence, entry-gating what counts as quick, needing a second question round instead of stopping

**Plan Artifact Reader Layering**:
The rule that plan artifacts name their reader: humans read the grill recap (3–6 bullets) and the Contract Note (3–5 bullets); machines read the Behavior Contract, Behavior Matrix, Constraint Bundle, and tasks records by reference. Unresolved questions are resolved at the grill gate before shape; a conflict discovered by a leaf during go is re-briefed back to the parent for disposition, never silently absorbed. This replaces the older “concise plan + list unresolved questions at the end” rule.
_Avoid_: one artifact trying to serve both readers with one format, unresolved questions shipped to execution, silent absorption of leaf conflicts

**Edge Classification**:
The shape-time labeling of every `Blocked by` edge as `file-overlap`,
`seam-required`, or `methodology-order`. `seam-required` always blocks
dispatch; `file-overlap` blocks in shared mode and, under shape-verified
`Execution mode: worktree` (ADR 0012), is demoted to a merge-order
preference — concurrent dispatch from the same merged base, serial merge
queue orders landing, one conflict re-dispatch resolved on the unmerged
branch. `methodology-order` (no owned-file overlap, no seam consumption —
pure "reads better if done first") never blocks dispatch. This refines
ADR 0008's ready-set definition.
_Avoid_: treating "feels safer sequential" as a dependency, wave thinking
reintroduced through unclassified edges, edge labels without owned-files
facts, demoting a seam-required edge (a seam that does not exist yet is
unavailability, not conflict)

**Two-stage Contract Slice**:
The required shape of any `Kind: contract` slice that carries deep durability,
concurrency, or protocol semantics: a **thin-interface** slice (public seam +
minimal working operations; consumers may block on it) plus a separate
**hardening** slice (crash-recovery, concurrency protocols, sanitization depth;
consumers must NOT block on it). Persistence/schema migration ownership is
unique — exactly one slice owns a migration file.
_Avoid_: one storage state-machine ticket packing interface and hardening,
hardening rework sitting on the consumer critical path, two slices owning one
migration file

**Mechanical Return Gate**:
The join-time reconciliation between a leaf's return summary and its slice's
Required evidence, including mapped source reading/Architecture landing,
affected guards, and exception deltas: every item maps to recorded output or
an artifact/message reference; missing items bounce exactly those IDs, reported
architecture conflicts hold the affected landing for resolution. It
is **evidence reconciliation, not code review** (ADR 0007 boundary): no
implementation re-read, no test reruns, no second review point — the
end-of-issue review stays the only review gate.
_Avoid_: parent re-reading implementations at join, rerunning leaf tests,
using the gate to inject new acceptance requirements

**Defense Budget**:
The rule that a correction brief may not introduce acceptance requirements
absent from the shaped Behavior Matrix/Constraint Bundle — new acceptance
lines = 0; architecture obligations are declared at shape, not invented in fixes. A genuine
gap found during execution goes back to shape (re-cut as a new slice) or is
demoted to a recorded non-blocking note. Acceptance scope is fixed at shape;
fix rounds converge instead of escalating.
_Avoid_: mid-execution acceptance inflation, defensive requirements appearing
only in fix rounds, design constraints drifting between correction rounds

**Granularity Quiz**:
The shape-time challenge of slice granularity after the graph exists, folded
into the graph-confirmation step: is any slice too coarse (fits-no-window) or
too fine (trivial grouping lost)? Are the blocking edges real? Merge or split?
The user approves granularity, not just wave order. Backed by two hard rules:
every slice has a **demo path** (a demoable behavior, never a layer name), and
a change that fits one fresh context window should not become a multi-slice
issue at all (route `rope-quick`).
_Avoid_: quiz as a new serial Q&A round, demo path answered with a layer name,
splitting a one-window change to look rigorous

**Human Gate Panel**:
The batched presentation of multiple pending Human Escalation Stops / gate
approvals in one panel — each entry naming the affected slices, the exact
authorization requested, and the blast radius — instead of one-at-a-time
blocking. Non-gated lanes' continue-or-hold status is stated explicitly.
_Avoid_: sequential gate blocking idle lanes, vague gate descriptions that
require a follow-up question to understand

**Research Floor**:
The grill-stage dispatch floor (ADR 0017): a request involving a new
mechanism, an external platform/service integration, or a "how do mature
products solve this" design judgment requires parallel research dispatch
before the decision rounds — typically two briefs (repo precedent +
external product survey). Purely internal small changes record
`research: not-needed` + one-line reason instead. Shape backstops it: a
PRD citing neither research nor a waiver is refused. Backs the prior-art
ladder (need → repo precedent → stdlib/platform → installed deps → minimal
build) and bans unverified industry-practice claims as decision bases.
_Avoid_: "prefer to research when wide" as a license to skip, treating
model memory as prior art, floor turned into an excuse to skip quick-path
work that needs no research

**Dispatch Contract**:
The ADR 0017 contract family: the dispatch brief is executable (question,
sources, output path, return shape; leaf honors exactly what it declares;
unmet requirements return under `unknowns` with attempts); dispatch is the
mandated path wherever rules name a leaf (E2E journeys, research, fixes);
and the parent writes no product/test code during go/E2E — correction is
always rewrite-brief + re-dispatch, never parent self-editing or parent
takeover of a failed leaf's job.
_Avoid_: parent takeover framed as "brief correction", empty leaf returns
accepted as passes, silent shrinking of a brief's scope in the return
