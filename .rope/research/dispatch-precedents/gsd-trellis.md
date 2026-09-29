# Research: GSD and Trellis subagent dispatch precedents

## Question
Identify the projects called “gsd” and “trellis” and verify first-party evidence about parent-session delegation relevant to Rope’s dispatch contract: brief shape/output, recovery, context protection, model fan-out, and web research.

## Identity
- **GSD:** Current project is [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core), “GSD Core / Git. Ship. Done,” a multi-runtime context-engineering and spec-driven development framework. Its README explicitly says heavy research, planning, and execution run in fresh-context subagents to reduce context rot. The similarly named [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) is the predecessor/archived repository; its README redirects development to open-gsd/gsd-core. Do not use third-party SkillsLLM descriptions as primary identity evidence. Current maintainer/author is presented as open-gsd; the older README calls the system “by TÂCHES.”
- **Trellis:** [mindfold-ai/Trellis](https://github.com/mindfold-ai/Trellis), an out-of-the-box engineering framework for AI coding. Its README describes persisted specs, tasks, and workspace memory; multi-platform support; a four-phase workflow; and research/implement/check subagents. README itself identifies project; author/org is mindfold-ai.

## Verified Facts

### Identity / lifecycle
- GSD predecessor README states it is no longer active and directs users to GSD Core: https://github.com/gsd-build/get-shit-done (README.md).
- GSD Core README names supported coding runtimes and explains fresh-context subagents as the context-rot control: https://github.com/open-gsd/gsd-core (README.md; “What is GSD Core”, “How it works”).
- Trellis README calls it an engineering framework and lists persisted `.trellis/spec/`, `.trellis/tasks/`, and workspace journals: https://github.com/mindfold-ai/Trellis (README.md).

### GSD dispatch
- Plans are execution prompts: objective, referenced context, tasks, verification, success criteria, plus structured frontmatter (`wave`, `depends_on`, `files_modified`, `requirements`, `must_haves`): [predecessor planner agent spec](https://github.com/gsd-build/get-shit-done/blob/main/agents/gsd-planner.md), sections “Plans Are Prompts” / “PLAN.md Structure”. This is first-party predecessor material; current GSD Core continuity is established by its README redirect, but current path parity was not verified.
- GSD Core describes plans running in parallel waves, with each executor fresh-context (README “How it works”). Retrieved search result for current GSD Core `execute-phase` reports quota failure classification, model re-resolution/escalation bounded by `max_escalations` and provider ladder, honoring Retry-After, then manual recovery prompt rather than silently repeating last model: [search result links to docs/CONFIGURATION.md and docs/ARCHITECTURE.md, next branch](https://github.com/open-gsd/gsd-core/blob/next/docs/CONFIGURATION.md). Not independently fetched; treat as verified search snippet only.
- GSD planner task types explicitly include `auto`, `checkpoint:human-verify`, `checkpoint:decision`, and `checkpoint:human-action`; task anatomy requires exact files/action/automated verify/done: predecessor `agents/gsd-planner.md`, “Task Types” and “Task Anatomy”.
- GSD plan output is written to `PLAN.md`; predecessor evidence says executors produce plan `SUMMARY.md` (web search result for `execute-phase.md`, current archived repo). GSD Core README also identifies persistent `STATE.md` and `CONTEXT.md` artifacts. Exact current dispatch response-vs-artifact protocol remains unverified.
- Research is staged by depth: Level 0 skip; Level 1 quick verification via Context7; Level 2 standard research via discovery workflow producing `DISCOVERY.md`; Level 3 deep dive with `DISCOVERY.md`. Predecessor `agents/gsd-planner.md`, “Discovery Levels”.
- Model fan-out policy: not established from retrieved first-party excerpts. No evidence supports mandatory cheap-model delegation or fixed subagent count.

### Trellis dispatch
- README workflow: brainstorm writes `prd.md`; research-heavy items go to `trellis-research`; curated specs/research are referenced from `implement.jsonl`/`check.jsonl`; implement and check are separate subagents; check self-fixes where able: [README](https://github.com/mindfold-ai/Trellis) “How It Works”.
- Research agent’s contract: find/explain/persist; every finding must be `{TASK_DIR}/research/<topic>.md`; report only paths and one-line summaries, not full content. It classifies internal/external/mixed research; external includes docs, APIs, practices; independent searches may be parallel. [`.claude/agents/trellis-research.md`](https://github.com/mindfold-ai/Trellis/blob/main/.claude/agents/trellis-research.md), “Core Principle”, “Workflow”, “Report Format”.
- Research agent refuses to guess output location without active task; resolves path using `task.py current --source`. It may write only task research files; code/spec/config and git operations forbidden. Same file, “Step 1” / “Scope Limits”.
- Implement agent carries a recursion guard: dispatched implement/check agent must not spawn another; only main session dispatches those roles. If more parallel work is needed, report a recommendation. It uses hook-injected context when present; fallback explicitly reads manifest-listed files and task artifacts. [`.claude/agents/trellis-implement.md`](https://github.com/mindfold-ai/Trellis/blob/main/.claude/agents/trellis-implement.md), “Recursion Guard” / “Context Loading”.
- Implement report is compact structured status with files modified, summary, verification. Same implement agent file, “Report Format”.
- Check agent is described in README as reviewing against specs and running lint/typecheck/tests, self-fixing where it can. First-party [`.claude/agents/trellis-check.md`](https://github.com/mindfold-ai/Trellis/blob/main/.claude/agents/trellis-check.md) was fetched; exact full body not retained in this note.
- Trellis planning artifacts are explicit: `prd.md` requirements/acceptance, `design.md` technical architecture/contracts/risks, `implement.md` ordered checklist/validation/rollback; subagent workflows require real entries in both manifests before start. [`.claude/skills/trellis-brainstorm/SKILL.md`](https://github.com/mindfold-ai/Trellis/blob/main/.claude/skills/trellis-brainstorm/SKILL.md), “Artifact Rules”.
- Trellis brainstorm enforces a planning/approval gate; unresolved user-owned decisions stop dispatch, and final approval must follow the final planning summary. Same skill, “Non-Negotiable Planning Contract” / “Planning Flow”.
- Trellis search found a first-party workers reference defining worker cards: [`.agents/skills/trellis-channel/references/workers.md`](https://github.com/mindfold-ai/Trellis/blob/main/.agents/skills/trellis-channel/references/workers.md); its content was not retrieved in this run, so worker-card details and model policy are open.
- No retrieved first-party source establishes mandatory cheap-model selection, fixed fan-out count, or generic subagent retry policy. Check self-fixing and GSD quota escalation are narrower, not general retry rules.

## Assumptions
- “gsd” means Get Shit Done / current GSD Core, not another project abbreviated GSD. This is supported by exact suggested identity cue and explicit predecessor redirect.
- “trellis” means mindfold-ai/Trellis, not another Trellis agent project. It uniquely matches the spec/task-centered workflow clues and has first-party subagent role files.
- GSD predecessor planner-contract details are useful historical precedent but may differ from current GSD Core; current README confirms lineage, not every implementation detail.

## Implications
- Consider Rope dispatch briefs as typed, executable contracts: role/type, objective, exact scope/files, inputs/context, output artifact/schema, verification, and completion criteria.
- Separate durable findings from return summaries. Trellis gives a strong context-protection pattern: persist full research in scoped task artifacts, return paths plus concise summaries.
- Explicit recursion guard and authority boundaries prevent nested fan-out and accidental scope expansion; provide a parent escalation/recommendation channel when work exceeds role.
- Distinguish recovery classes (tool/provider failure vs incomplete/low-quality result). GSD search evidence supports bounded provider escalation, but does not justify unbounded agent retries.
- Model-tier policy and maximum parallelism need explicit Rope decisions; these sources do not establish a universal cheap-model mandate.
- External research should name output location, require sourced findings, and report caveats; Trellis treats web research as a first-class research-agent responsibility.

## Open Questions
- Current GSD Core exact executor prompt/template, result-return contract, and planning/execution docs were not fetched; GSD Core raw paths tested returned 404. Search snippets and predecessor evidence are weaker than full current source.
- Trellis worker-card definition and `trellis-check` exact report/recovery rules need direct inspection of those files.
- Neither project’s retrieved sources settle cheap-model defaults, maximum fan-out, or whether all failure classes trigger retries.
- External web research source-quality/citation threshold is not explicit in the retrieved Trellis research-agent contract.
