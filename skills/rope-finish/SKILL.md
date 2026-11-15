---
name: rope-finish
description: go 之后验证并关闭 .rope issue：检查审查记录、E2E 终态、干净工作树、架构连续性，再收尾并安排文档更新。用户要求关闭 issue 时按名称调用。
disable-model-invocation: true
---

<a id="rope-finish"></a>
# Rope Finish：验证与收尾

验证并关闭 Rope issue 包，不实现新功能。产品真实性及组装 diff 判断已在 go 的**issue 结束审查**完成，finish 不重新判断代码。

结论规则及 verify.md 格式：[验证规则](references/verify-rules.md)。
最终状态检查与经验归档：[收尾清单](references/finish-checklist.md)。
架构连续性字段：[架构连续性](../rope-shape/references/architecture-continuity.md)。

<a id="preconditions"></a>
## 前提

- 已存在 `.rope/issues/<issue>/prd.md`、`tasks.md`、`e2e.md`。

<a id="stage-1--verify-paperwork-gate-read-only"></a>
## 第一阶段：Verify（文书检查，只读）

只做以下五项。只有 verify.md 已有 `Verdict: PASS` 轮次且此后无变化，才可跳过：

1. 结束审查确实执行：已记录结论行、运行 / 代理身份及修复轮次；`review_degraded` 带原因。
2. 每个 E2E 项有终态：`agent_passed`、`user_confirmed`、`waived`、`blocked_on_gate`、`blocked_on_user`、`not_run_with_reason`。查找漂移：`agent_failed` / `pending` 是否未经复验就被算完成；应重跑或阻塞，不能默默接受。标为 user 而机制已被宿主工具覆盖的项目是分类漂移，退回 agent 执行。
3. 各切片提交齐全，无无关未提交文件。
4. 架构文书齐全：包就绪，每片有约束 ID、必读章节、实际来源阅读 / 编辑前架构落点证据，或有理由的不适用。漏做编辑前步骤需如实遗漏 / 补救记录及审查者接受，不能事后声称早已执行。核查接受代码状态上的完整声明架构检查证据、逐项例外差异理由及审查结果、已确认变更处置；集成合并另有候选 / 目标 / 协调记录。按[架构检查](../rope-go/references/architecture-gates.md)查记录，不查代码。
5. 矩阵行指向已记录证据；抽查引用，不重跑。

可把已有已核验证据直接补链到缺失文书字段，记入 Document Fixes Applied。禁止编造来源阅读、检查通过、例外批准或审查记录。

按[验证规则](references/verify-rules.md)追加一轮：PASS 进入第二阶段；CHANGES_REQUESTED 回 go 修复循环，must-fix 集合不变则人工升级停止，缺约束回 shape；BLOCKED 停止并报告。旧包已有 PASS 且此后状态不变，无需新增轮次。

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
## 护栏

- 不通过读 diff 再判断代码质量，这是审查者工作。
- 不编造 PASS；缺结论行是真问题，不是形式。
- 不重跑已通过 E2E，只核查证据。
- 用户未明确要求，不归档、删除、push、merge、rebase 或清理 worktree。
- 不编造成功 E2E 结果。
- 必需 E2E 都可由 agent 执行且已通过时，不强迫用户验证。
