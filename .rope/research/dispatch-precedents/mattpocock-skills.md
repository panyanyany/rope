# Matt Pocock skills: subagent dispatch precedents

## Question
How does Matt Pocock (`mattpocock/skills`) organize dispatching subagents for research/execution, including changes after pinned 6654f6b (2026-09-01) and public methodology?

## Verified Facts
- Research skill assigns work to a **background agent** so the caller can continue; it requires primary sources, claim-level citations, and one Markdown findings artifact saved in the repository’s existing notes convention. It does not define a structured prompt template, model tier, retry protocol, or return-summary format. Source: [snapshot `skills/engineering/research/SKILL.md`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/research/SKILL.md#L6-L12).
- Wayfinder tickets classify work as `research`, `prototype`, `grilling`, or `task`; research is AFK, documentation/API/local-resource fact-finding, resolved by a `/research` subagent when knowledge outside the current working directory is required. Ticket question is the brief; outcome is recorded on resolution and generated assets linked, not pasted. Source: [snapshot `skills/engineering/wayfinder/SKILL.md`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/wayfinder/SKILL.md#L55-L80).
- Wayfinder fans out each newly created research ticket in parallel, on throwaway `research/<name>` branches, carrying a context pointer from the ticket. The map loads at low resolution; ticket bodies are fetched on demand. Source: [same](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/wayfinder/SKILL.md#L103-L128).
- Code review gives two independent, parallel agents different axes and bounded prompts: full diff/commit list, relevant standards or spec, explicit reporting criteria and <400-word limit. Missing spec skips that agent; aggregation preserves axes rather than merging/reranking. No cheap-model requirement appears. Source: [snapshot `skills/engineering/code-review/SKILL.md`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/code-review/SKILL.md#L58-L80).
- Increment after pinned SHA: fetched `origin/main` at `c55ee46073ed923f86ce59a5eb3b6d895095d1b7`; changed files were PR skill/templates, `retro`, README, setup scripts, and metadata. No changed file adds/revises research/subagent dispatch guidance; `retro` did tighten deterministic-check advice (prefer mechanical guardrails over written standards). Source: [compare](https://github.com/mattpocock/skills/compare/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76...c55ee46073ed923f86ce59a5eb3b6d895095d1b7).
- An interview transcript summary describes Pocock’s “day shift/night shift” and splitting context to keep agents in their “smart zone”; it does not provide concrete dispatch/retry/model-tier rules. Source: [Pragmatic Engineer interview](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock) (episode transcript and timestamps; 45:02 smart-zone section).
- A secondary practitioner account of Pocock’s Sandcastle workflow recommends creating plan → pressure-test → PRD → issue files, checking issues are vertical slices, then assigning one issue per subagent with allowed files, acceptance criteria, and stop condition. It reports iteration-budget exhaustion and increasing delegation iteration/time limits, but this is the author's Hermes adaptation, not Pocock’s own requirement. Source: [Danny Shmueli’s workflow write-up](https://dannyshmueli.com/2026/04/29/Matt-Pocock-Skills-Hermes-Subagents-Feature-Work), especially “Run the issues through Hermes sub-agents” and “One config change that helped”.
- Public search surfaced no reliable first-party, substantive statement establishing cheap-model fan-out or parent-owned retry behavior. The public materials found support context partitioning and bounded issues, not a specific retry protocol. Search included interview, workshop, and X-specific subagent queries; YouTube fetch could not extract video content.

## Assumptions
- The requested baseline is the supplied 6654f6b pin; local cached repository itself reports an older HEAD, so conclusions about post-pin changes rely on fetched GitHub compare, not local HEAD.
- Public-source searches were discovery only; claims above distinguish repository-authored instructions from search-result summaries.

## Implications
- Rope can borrow clear work-type labels, a narrowly scoped question, explicit artifact location/citation rules, parallel independent axes, and context pointers.
- Avoid attributing to Pocock a universal retry/escalation rule, mandatory cheap models, or return-summary contract: inspected sources do not specify these. Rope should decide these explicitly if needed.
- His map pattern protects context through low-resolution index plus on-demand detail; persistent research artifacts are first-class outputs rather than relying on conversation history.

## Open Questions
- What is Pocock’s actual parent-agent recovery behavior after a subagent stalls or fails?
- Does he use cheap models for specific fan-out classes in private workflows or public talks not found by these searches?
- Can primary X/video/podcast transcripts verify any stronger public claims?
