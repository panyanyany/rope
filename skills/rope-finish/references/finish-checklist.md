<a id="rope-finish-checklist"></a>
# Rope Finish 收尾清单

<a id="required-checks"></a>
## 必需检查

- issue 目录存在，`prd.md`、`tasks.md`、`e2e.md` 齐全。
- `verify.md` 有 `Verdict: PASS`，由 finish 第一阶段或此前运行写入；或用户明确豁免 issue 级 verify。
- 所有切片已完成或明确豁免。
- 审查发现已解决或明确豁免。
- E2E 均有终态：`agent_passed`、`user_confirmed`、`waived`、`blocked_on_gate`、`blocked_on_user`、`not_run_with_reason`。
- 终态指带证据的**已记录结果**；finish 不重跑 go/verify 已记录通过的验证。

<a id="architecture-documentation-closure"></a>
## 架构文档闭环

读取 prd.md 的 Architecture Impact 与 Constraint Bundle。

- 已确认 `pending-finish` 是收尾工作，不是 verify 失败。
- 按已有归属安排更新：难逆转、意外且有取舍的决策进 ADR；稳定实现契约 / 易踩坑进 spec；领域术语进术语表；外部事实进 research。
- 已确认处置直接写入，保留来源状态、范围、不变量、例外边界、证据及失效条件。
- 每个 `pending-finish` 替换为 `updated-existing`、`added-new`、`no-new-decision`、`exception-recorded` 之一。
- 发现未确认架构变化则暂停请求处置，不编造例外，不带待办关闭。
- 最终报告写明文档终态与修改路径。

<a id="reusable-lesson-routing"></a>
## 可复用经验归属

- 稳定术语 → `.rope/GLOSSARY.md`。
- 外部 / 平台事实 → `.rope/research/`。
- 实现契约 / 易踩坑 → `.rope/specs/`。
- 长期架构取舍 → `.rope/adr/`。

<a id="final-report-shape"></a>
## 最终报告格式

保留字段名，填写内容用中文：

```md
## Final Status

- Issue:
- Verify verdict:
- Slice status:
- E2E status:
- Commits:
- Remaining gates:
- Docs updated:
- Architecture documentation outcome: updated-existing | added-new | no-new-decision | exception-recorded
```
