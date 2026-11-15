---
name: rope-go
description: 执行 .rope issue 包：TDD 切片、架构继承、一次 issue 结束审查，再运行 E2E。用于 rope-shape 之后，或需要架构协调的长期功能 / 集成分支落地。
---

<a id="rope-go"></a>
# Rope Go：执行交付

父编排器负责一个 `.rope/issues/<slug>/` 包：向叶子派发就绪切片、串行合并分支，再执行一次双轴审查和 E2E 验收。叶子不能派生叶子，父编排器不批量加载叶子执行噪声。

**父编排器不写代码：**所有产品 / 测试编辑通过实现者简报派发。纠偏方式是改写简报再派发；父编排器自行修改既越界，也会膨胀上下文。

执行规则、简报、测试范围及故障手册：[执行规则](references/execution-rules.md)。
实现者必读、父编排器启动时无需读：[TDD 手册](references/tdd.md)。按简报契约传递核实后的绝对路径，不复制正文。
架构约束、检查 / 例外证据及合并门槛：[架构检查](references/architecture-gates.md)。

<a id="startup"></a>
## 启动

1. 加载行为契约、切片状态、E2E 计划、约束包。检查 git 状态，处理无关未提交工作。派发前检查整包就绪；集成合并按 architecture-gates 使用候选合并分支。
2. 基线：复用同一 HEAD、≤24 小时、覆盖所选范围的通过证据；否则按[交接契约](../rope-harness-presets/references/role-schema.md#exploration-and-validation-handoff)委派已声明 quick 层或受影响检查。将范围、命令、理由、返回证据记入 Testing Decisions，不能无差别跑整套。父编排器决定范围及失败处置。
3. 使用 shape 的 `Execution mode:`（worktree | shared），复核宿主隔离能力。不符则降级 shared 并记录原因。worktree 派发前先提交包。
4. 报告初始就绪数、图最大宽度、计划并行度及串行理由。

<a id="slice-loop"></a>
## 切片循环

- worktree：`seam-required` 阻塞项合并后即就绪，从最新已合并 HEAD 立即派发；`file-overlap` 只约束合并顺序，无波次屏障。
- shared：按波次执行，拥有文件不相交；file-overlap 阻塞派发。只有一个索引和检出目录，串行收集提交。
- 按 execution-rules 的 ≤60 行预算简报实现者：契约、必填约束 ID 和来源章节、map 路径、聚焦 TDD 命令、核实后的 TDD 手册路径、架构证据及第 0 步 worktree 准备。叶子编辑前读手册和来源、记录架构落点；冲突则停片。
- 返回检查：逐项将 Required evidence 机械映射到返回输出或产物路径。缺证据退回补对应项；缺测试改简报；改变验收则回 shape。
- 修复轮次：每个问题改简报并派发新叶子；新叶子返回相同失败特征，或发现设计缺陷，停止并交人工。独立就绪切片继续。
- 新症状 / 未知失败：长时间诊断前，把观察、期望、复现入口及相关契约交给 explore。父编排器依据结论决定修复边界；已诊断且有界的缺陷直接派实现者。见上述交接契约。
- 按落地顺序串行合并。冲突在未合并分支重派一次，简报同时保留两边意图；未解决则保持阻塞。每次合并后更新 map 证据并补充就绪集合。

<a id="investigation-map"></a>
## 调查图

`<issue>/map.md` 由 shape 初始化，每行一个当前事实，含路径和日期。shared 由叶子修改其不相交范围内被证伪条目；worktree 由叶子返回修正，父编排器合并后写入。

<a id="end-of-issue-review"></a>
## issue 结束审查

冻结干净工作树，确保无活动叶子。按 architecture-gates 要求完整架构检查覆盖及逐项例外差异证据。同一消息派发两个全新只读叶子：**规范扫描器**（explore 预设；受影响 lint/typecheck/build；不运行产品）及**行为审查者**（`rope-reviewer`；走查矩阵、架构来源及高风险边界，只读代码）。机械汇总，以最差结论为准；阻塞发现原样并入一份修复简报，复审只看差量；首个未缩小阻塞集的轮次触发人工升级停止。

<a id="e2e-acceptance-stage"></a>
## E2E 验收阶段

审查批准后进入真实环境：启动项目声明的共享服务栈，派发只读 `rope-e2e-runner` 叶子，每叶子一条旅程，资源不相交则并行。父编排器不能代替 runner。所有必需 E2E 项均需带证据通过，或有用户明确豁免。失败进入有界修复循环，新 HEAD 重跑受影响旅程。完整契约见 execution-rules。

<a id="stop--report"></a>
## 停止与报告

缺证据、检查失败、缺环境、契约未定和待人工授权都保持显式阻塞。报告切片、提交、并行度、红 / 绿证据或豁免、审查 / 修复历史、E2E 状态，以及暂停和继续的工作。审查及 E2E 通过后交给 `rope-finish`。
