# Behavior Matrix Guide

Use a Behavior Matrix when shaping or implementing an issue so required cases
are explicit and each has an assigned verification path.

## Purpose

- Force explicit yes/no decisions for common behavior classes.
- Bind each applicable row to a real test, smoke check, or explicit waiver.
- Prevent "happy path only" slices from being marked complete.

## Default Rows

| Row | Ask |
| --- | --- |
| Primary path | Does the main success path work end to end? |
| Alternate input or entrypoint | Are other valid entrypoints covered? |
| Empty or missing input | What happens when required input is absent? |
| Invalid or malformed input | Are bad inputs rejected visibly? |
| Unavailable or not-ready dependency | How does missing/unavailable dependency fail? |
| Duplicate or idempotent case | Is replay/duplicate safe or correctly rejected? |
| Boundary or limit case | Are edges and limits handled? |
| Existing behavior compatibility | Did adjacent behavior stay intact? |
| Real entrypoint or integration path | Was the real entrypoint exercised, not only a unit seam? |

## Rules

- Mark rows `yes` only when they apply to the issue.
- Every `yes` row needs verification: test, smoke, or explicit waiver with reason.
- Claims in `tasks.md` are not evidence; verification must exist in code or recorded run output.
- Test-interface proof scope is declared in [Testing Decisions and slice tests](../../../skills/rope-shape/references/issue-package.md); the existing [behavior review](../../../skills/rope-go/references/execution-rules.md#reviewer-brief) judges whether those tests prove the slice promises. [E2E fixes](../../../skills/rope-go/references/execution-rules.md#e2e-acceptance-stage-after-review-approve) distinguish code regressions from environment/deployment validation.
- Issue-level verify checks recorded review/E2E evidence after `rope-go`, not code or product truth; it does not accept per-slice self-report alone.
