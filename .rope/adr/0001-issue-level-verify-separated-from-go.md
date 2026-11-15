<a id="0001-issue-level-verify-separated-from-go"></a>
# 0001 从 Go 分离 issue 级验证

Rope 在 go 与 finish 之间引入 rope-verify，由**父编排器**这一强判断角色负责，检查完成状态是否满足 PRD、行为矩阵、E2E。它不改代码，只产出发现，必要时写修复简报，由父编排器派**实现叶子**执行。

<a id="context"></a>
## 背景

agent-workbench 实验显示两个缺口：

1. go 的逐片审查静默降级。deepen-core-modules 各片均记录 review_degraded: no_subagent_tool_available，只读审查从未实际运行。
2. 失败 E2E 流入完成状态。human-intake-tool-loop-guard 的 E5/E6 是 agent_failed，切片审查仍 pending E6 real repro，却无复验便标 completed 并趋向 finish。

多数 issue 在 go 后停止，没有结构化检查确认满足 PRD。

<a id="decision"></a>
## 决策

引入独立验证阶段，**跨角色分离实现与验收**：

- 父编排器拥有完成状态接受 / 拒绝结论。
- verify 不改代码。CHANGES_REQUESTED 产出修复简报，由实现叶子执行；实现叶子或降级顶层实现会话仍是唯一代码写入面。
- verify 只可改 tasks/e2e/prd 状态等 issue 文档元数据，避免为修正旧状态多一次往返。
- 升级检查由模型判断，自主决定阅读及是否派只读 verify-inspector / explore；鼓励叶子节省上下文，不设机械触发。

<a id="amendment-roles-not-windows"></a>
### 修订：角色而非窗口

长期属性是实现 / 验收角色分离，不是两个用户窗口。父编排器判断 grill/shape/verify 并派发，实现者写代码提交，reviewer/explore/verify-inspector 只读或受工具边界限制。宿主不能派写代码叶子时，可选 Planner Window A / Implementer Window B 部署；窗口不是架构。见 CONTEXT 及 single-window-go-orchestration 调研的决定 1–16。

<a id="why-this-split"></a>
## 理由

- 强模型预算用于可信度判断，不用于编辑循环。Trellis 单模型自修复不面对 Rope 的跨角色成本取舍。
- 单一代码写入面让 git 历史与工作上下文共处；验证者改代码会使后续实现者不知变更归属。
- 用户拒绝机械升级，保留模型判断，沿用“不猜测而升级检查”，扩展为跨角色派发。

<a id="consequences"></a>
## 后果

- 验证失败走父验证 → 修复简报 → 派实现者 → 复验；verify.md 每次追加，不覆盖。
- 原规则为同问题两轮失败或设计 / 需求 / 契约缺陷后人工升级停止；后续无进展规则见 ADR 0007。
- finish 需 verify.md 的 Verdict: PASS，或明确用户豁免。
- 原 go 交接 issue 级 verify，不直接 finish；下述合并修订更新用户入口。

<a id="considered-options"></a>
## 考虑过的方案

<a id="amendment-2026-10-verify-merged-into-finish"></a>
### 修订：2026-10，verify 并入 finish

当前用户流程为 rope-grill → rope-shape → rope-go → rope-finish。verify 与 finish 实际总是连续执行，因此删除独立技能，由 finish 第一阶段执行同样的薄文书检查、追加 verify.md 后再关闭。跨角色分离、简报、升级、轮次记录保持，旧 verify.md 仍有效。

- Trellis 式验证自修复：拒绝，消耗强模型编辑预算并破坏单一写入面。
- 机械升级，廉价粗筛后只对标记项用强模型：用户拒绝，过于僵硬。
- 强模型每次读完整 diff：拒绝，低风险成本不能缩放。
- 窗口作为长期架构：被角色语言替代，窗口只是可选部署。
