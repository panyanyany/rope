# Superpowers dispatch precedents

## Question
How does obra/superpowers organize parent-session delegation to subagents, particularly briefs, recovery, context protection, model/cost fan-out, and external research?

## Verified Facts
- SDD chooses a fresh implementer per independent plan task, then task reviewer after each and broad final reviewer; agents get isolated context rather than parent history. Source: `skills/subagent-driven-development/SKILL.md` (https://github.com/obra/superpowers/blob/main/skills/subagent-driven-development/SKILL.md).
- SDD has named prompt templates (`implementer-prompt.md`, `task-reviewer-prompt.md`, `re-review-prompt.md`), alongside a persistent plan workspace containing ledger, briefs, reports, review packages. Each brief is task-scoped; exact values belong in the brief; agents should not read the whole plan. Source: same SDD file.
- Implementer report filename derives from brief (`task-N-brief.md` → `task-N-report.md`); full report is persisted, while session response is only status, commits, one-line test summary, concerns. Source: same SDD file.
- Dispatch prompts should not include accumulated prior-task summaries; provide task, touched interfaces, global constraints. A documented real dispatch was 42k chars, 99% pasted history, motivating this restriction. Source: same SDD file.
- Recovery is bounded: rounds 1–3 resume implementer (or fresh dispatch with brief/report/findings if no live messaging); rounds 4–5 use fresh implementer on more capable model. After round 5 adjudicate/park residuals or stop only if all paths are guesses. Source: same SDD file.
- Model guidance: least powerful model per role; mechanical 1–2-file work fast/cheap, integration/debug standard, architecture/design most capable. Source: same SDD file.
- Parallel dispatch is only for independent domains without shared state; one agent per domain, dispatched in the same response for concurrency. Prompts specify scope, goal, constraints, expected output. Parent reviews summaries, checks conflicts, runs full suite. Source: `skills/dispatching-parallel-agents/SKILL.md` (https://github.com/obra/superpowers/blob/main/skills/dispatching-parallel-agents/SKILL.md).
- Brainstorming is staged by spike/bounded/architectural complexity; spike investigation should be as cheap as correctness permits, and report findings/recommendation (throwaway work labeled). No subagent web-research dispatch procedure was verified in these files. Source: `skills/brainstorming/SKILL.md` (https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md).

## Assumptions
- These evolving `main` branch skill files represent intended methodology; they do not prove every harness enforces the prompt rules.
- The cited brainstorming “investigate” guidance may inform research cost discipline but is not evidence of a dedicated external-web research protocol.

## Implications
- Rope briefs can be small durable artifacts with a separately named report, explicit task scope/interfaces/constraints, and short return contract.
- Keep parent context to concise status plus artifact path; avoid forwarding prior task history.
- Fan out only independent lanes; select model by role complexity, not a universal tier. Retry with explicit rounds and capability escalation; retain attempted-work record for fresh eyes.
- No verified Superpowers precedent here for “environment characterization before changing search route” or requiring unknowns to include next steps; treat as Rope-specific design choices pending more source review.

## Open Questions
- Does another Superpowers skill prescribe external research delegation or a standard research findings artifact?
- Which harness integrations actually pass model selection and enforce the prompt templates?
