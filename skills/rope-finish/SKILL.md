---
name: rope-finish
description: go 之后验证并关闭 .rope issue：检查审查记录、E2E 终态、干净工作树、架构连续性，再收尾并安排文档更新。用户要求关闭 issue 时按名称调用。
disable-model-invocation: true
---

<a id="rope-finish"></a>
# Rope Finish：验证与收尾

核验交付记录，并关闭满足条件的 Rope issue 包。代码判断由 go 的 issue 结束审查负责，真实产品行为由随后的 E2E 验收证明。finish 依据这些记录核查完成条件。

结论规则及 verify.md 格式：[验证规则](references/verify-rules.md)。
最终状态检查与经验归档：[收尾清单](references/finish-checklist.md)。
架构连续性字段：[架构连续性](../rope-shape/references/architecture-continuity.md)。

写入说明、简报或记录时，遵守[中文文档写作规则](../rope-grill/references/content-design.md)。

<a id="preconditions"></a>
## 前提

- 已存在 `.rope/issues/<issue>/prd.md`、`tasks.md`、`e2e.md`。

<a id="stage-1--verify-paperwork-gate-read-only"></a>
## 第一阶段：Verify（文书检查，只读）

依次检查以下五项。如果 verify.md 已有 `Verdict: PASS` 轮次，且此后状态没有变化，可以跳过本阶段：

1. 确认结束审查已执行。记录必须包含结论行、运行或代理身份及修复轮次。如果存在 `review_degraded`，还必须有原因。
2. 确认每个 E2E 项都有终态记录：`agent_passed`、`user_confirmed`、`waived`、`blocked_on_gate`、`blocked_on_user` 或 `not_run_with_reason`。如果 `agent_failed` 或 `pending` 未经复验就被算作完成，退回 go 重跑或保持阻塞。如果条目标为 user，但宿主工具已支持其验证机制，退回 agent 执行。终态不等于通过；关闭条件仍按验证规则检查。
3. 核对每个切片的提交，并确认没有无关未提交文件。
4. 按[架构检查](../rope-go/references/architecture-gates.md)核对架构记录，不重新审查代码。确认包已就绪，每片都有约束 ID、必读章节、实际来源阅读记录和编辑前架构落点证据；不适用时必须说明理由。如果遗漏了编辑前步骤，必须如实记录遗漏、补救及审查者接受结果，不得补写成已经提前完成。继续核对接受代码状态上的完整声明架构检查证据、逐项例外差异理由、审查结果和已确认的变更处置。集成合并还需有候选提交、目标提交和协调记录。
5. 抽查行为矩阵行引用的证据。只核对已有记录，不重新运行验证。

可把已有已核验证据直接补链到缺失文书字段，记入 Document Fixes Applied。禁止编造来源阅读、检查通过、例外批准或审查记录。

按[验证规则](references/verify-rules.md)记录本轮结论：

- `PASS`：进入第二阶段。
- `CHANGES_REQUESTED`：返回 go 修复。如果 must-fix 集合不变，停止自动修复并交给用户决定；如果缺少约束，返回 shape。
- `BLOCKED`：停止并报告阻塞。

已有 `PASS` 且此后状态不变的旧包无需新增轮次。

<a id="stage-2--closeout"></a>
## 第二阶段：收尾

1. 读取 issue 包及引用的 `.rope/` 文档。
2. 确认不需要新开发。
3. 检查 git 状态和最近提交。
4. 只有缺最终状态、E2E 结果、提交摘要或架构影响文档结果时才改 issue 文档。
5. 已确认 `pending-finish` 直接按已有 `.rope/` 归属更新规范文档，不重新询问。替换为 `updated-existing`、`added-new`、`no-new-decision`、`exception-recorded` 之一，记录路径 / 理由。旧包关闭前记录兼容标记。
6. 最终行为暴露 shape 或后续父编排器未确认的架构变化时，写入 / 关闭前暂停，请人工 / 父编排器决定处置，不自行发明例外。
7. 长期文档更新前读[现行文档契约](../rope-clear/references/current-docs.md)，原位修改当前归属。实现契约 / 易踩坑进 `.rope/specs/`，外部事实进 `.rope/research/`，稳定术语进 `.rope/GLOSSARY.md`，难逆转决策进 `.rope/adr/`。
8. 有最终文档更新则提交。
9. 报告最终状态、文档终态及剩余阻塞 / 仅人工验证项。

<a id="guardrails"></a>
<a id="护栏"></a>
## 执行限制

- 不通过读 diff 再判断代码质量，这是审查者工作。
- 不编造 PASS；缺结论行是真问题，不是形式。
- 不重跑已通过 E2E，只核查证据。
- 用户未明确要求，不归档、删除、push、merge、rebase 或清理 worktree。
- 不编造成功 E2E 结果。
- 必需 E2E 都可由 agent 执行且已通过时，不强迫用户验证。
