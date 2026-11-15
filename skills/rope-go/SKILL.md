---
name: rope-go
description: 执行 .rope issue 包：TDD 切片、架构继承、一次 issue 结束审查，再运行 E2E。用于 rope-shape 之后，或需要架构协调的长期功能 / 集成分支落地。
---

<a id="rope-go"></a>
# Rope Go：执行交付

父编排器负责一个 `.rope/issues/<slug>/` 包。它派发就绪切片，按顺序合并交付分支，再组织规范和行为两个维度的结束审查及 E2E 验收。叶子工作者不得再派生工作者；父编排器读取摘要和产物路径，不批量加载完整执行轨迹。

所有产品代码和测试编辑必须通过简报交给实现者。需要纠正实现时，父编排器修改简报并重新派发，不自行接管代码修改。这样可以保持角色边界，并减少父会话的上下文占用。

执行规则、简报、测试范围及故障手册：[执行规则](references/execution-rules.md)。
实现者必读、父编排器启动时无需读：[TDD 手册](references/tdd.md)。按简报契约传递核实后的绝对路径，不复制正文。
架构约束、检查 / 例外证据及合并门槛：[架构检查](references/architecture-gates.md)。

写入说明、简报或记录时，遵守[中文文档写作规则](../rope-grill/references/content-design.md)。

<a id="startup"></a>
## 启动

1. 读取行为契约、切片状态、E2E 计划和约束包。检查 git 状态，处理无关未提交工作。派发前，确认整包满足就绪条件。需要集成合并时，按[架构检查](references/architecture-gates.md)使用候选合并分支。
2. 确定基线。已有通过证据只有同时满足以下条件才可复用：来自同一 HEAD、距今不超过 24 小时、覆盖所选范围。否则，按[交接契约](../rope-harness-presets/references/role-schema.md#exploration-and-validation-handoff)委派工作者运行已声明的 quick 层或受影响检查。父编排器决定检查范围和失败处置，并将范围、命令、理由和返回证据记入 Testing Decisions。不得无差别运行整套测试。
3. 读取 shape 记录的 `Execution mode:`（worktree | shared），复核宿主隔离能力。如果实际能力不符，降级到 shared 并记录原因。使用 worktree 时，必须在派发前提交 issue 包。
4. 报告初始就绪数、图最大宽度、计划并行度及串行理由。

<a id="slice-loop"></a>
## 切片循环

- 使用 worktree 时，切片所需的 `seam-required` 阻塞项合并后即可派发。以最新已合并 HEAD 为基线，不必等待整个波次。`file-overlap` 只约束合并顺序。
- 使用 shared 时，按波次执行，同波次切片的拥有文件不得相交。`file-overlap` 会阻塞派发。共享目录只有一个索引和检出状态，因此必须按顺序收集提交。
- 按[执行规则](references/execution-rules.md#leaf-brief-contract-hard-budget)编写不超过 60 行正文的实现简报。简报必须包含契约、约束 ID、来源章节、map 路径、聚焦 TDD 命令、已核实的 TDD 手册路径、架构证据要求，以及作为第 0 步的 worktree 准备。叶子工作者在编辑前读取手册和来源，并记录架构落点。发现冲突时，暂停对应切片。
- 叶子返回后，逐项核对 Required evidence 与实际输出或产物路径。如果缺少证据，只退回缺失项；如果缺少测试，修改简报后重新派发；如果需要改变验收要求，返回 shape。
- 需要修复时，修改对应简报并派发新的叶子工作者。如果新叶子仍返回相同失败特征，或发现设计缺陷，停止该修复并交给用户决定。其余独立且就绪的切片继续执行。
- 遇到新症状或原因不明的失败时，在长时间诊断前，将实际观察、期望结果、复现入口及相关契约交给 explore。父编排器依据调查结论确定修复边界。已经诊断且范围明确的缺陷可以直接交给实现者，见上述交接契约。
- 按落地顺序逐个合并。遇到冲突时，在未合并分支上重新派发一次，简报必须保留两边的行为要求。如果仍未解决，保持阻塞。每次合并后更新 map 证据，并重新确定就绪切片。

<a id="investigation-map"></a>
## 调查图

shape 初始化 `<issue>/map.md`，每行记录一个当前事实，并附路径和日期。使用 shared 时，叶子工作者在各自不相交的范围内修正被证伪条目。使用 worktree 时，叶子返回修正内容，由父编排器在合并后写入。

<a id="end-of-issue-review"></a>
## issue 结束审查

所有切片合并后，冻结干净工作树，并确认没有活动叶子。按[架构检查](references/architecture-gates.md)准备完整的架构检查覆盖证据，以及逐项例外差异证据。

在同一消息中派发两个未参与实现的只读叶子工作者：

- **规范扫描器**使用 explore 预设，执行受影响的 lint、typecheck 和 build 检查，不运行产品。
- **行为审查者**使用 `rope-reviewer`，只读检查行为矩阵、架构来源、组装 diff 和高风险边界。

父编排器按固定规则汇总结论，以较差结论为准。阻塞发现原样放入一份修复简报；复审只检查修复差量。首个未缩小阻塞集合的轮次必须停止自动修复，并交给用户决定。

<a id="e2e-acceptance-stage"></a>
## E2E 验收阶段

审查批准后，父编排器启动项目声明的一套共享服务栈，并派发 `rope-e2e-runner`。每个 runner 只读代码，通过真实入口执行一条用户旅程。资源不相交且会话隔离时，并行执行；父编排器不得代替 runner。

每个必需 E2E 项必须有通过证据，或有用户逐项明确豁免。验证失败时，按有界修复循环处理，并在新 HEAD 上重跑受影响旅程。完整规则见[执行规则](references/execution-rules.md#e2e-acceptance-stage-after-review-approve)。

<a id="stop--report"></a>
## 停止与报告

缺少证据、检查失败、环境缺失、契约未定或等待人工授权时，明确记录阻塞状态。报告切片、提交、并行度、红绿测试证据或豁免、审查及修复历史、E2E 状态，以及哪些工作暂停、哪些工作继续。审查和 E2E 满足交付条件后，交给 `rope-finish`。
