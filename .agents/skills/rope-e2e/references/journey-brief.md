# Journey Brief Template

One self-contained brief per E2E runner leaf. Content ≤60 lines (paths and
command blocks excluded) — same budget discipline as rope-go's leaf briefs.

```md
# E2E Journey <id> — <issue slug>

Issue: .rope/issues/<slug>/          Base commit: <HEAD>
Stack: already running, started by the parent — entrypoints below.
NEVER restart/rebuild services; readiness problems are blocker reports.

## Items (from e2e.md)
- <E#> <mechanism> — pass criteria: <observable condition>
- <E#> … (a journey may prove several items of one mechanism)

## Entrypoint (project-declared)
- <URL / CLI command / real channel + how to reach it>

## Steps (walk them as the user would)
1. Given <state>, When <action>, Then <observable>
2. …

## Browser session
- Use session name `<journey-id>` (isolated); never touch other sessions.

## Evidence (save under .rope/issues/<slug>/evidence/e2e/)
- per item: the tool/command used + artifact path (screenshot, log, output)
- failed step: what you did, what you observed, which criterion broke

## Bounds
- Read-only on code. No file edits in the repo. No spawning agents.
- Real entrypoint only — internal seams (injection, fixtures) are not a
  substitute; an unreachable entry is a `blocked` report, not a workaround.

## Return (structured, nothing else)
- journey: <id>
- items: [{id, verdict: pass|fail|blocked, evidence: <tool/cmd + path>}]
- steps executed: one line each
- blockers: [{class: stack|entrypoint|credential|flake, detail}]
- notes: ≤5 lines
```
