<a id="architecture-decision-continuity-contract"></a>
# 架构决策连续性契约

<a id="scope"></a>
## 范围

适用于新 shape 的 Rope 包、进入执行的旧包，以及 Rope 管理的整线 / 集成合并。

<a id="contract"></a>
## 契约

- 新 prd.md 均有 Architecture Impact、`Impact: required | not-applicable` 及触发项检查理由。
- 每项相关来源决策均有来源路径、状态、issue 处置、范围、不变量、公共边界、禁止捷径、证据、适用映射、文档结果、冲突状态。
- 来源状态与 issue 处置分开。未核状态、范围、替代关系的历史不是活动约束。
- 文档维护按[现行文档契约](../../../skills/rope-clear/references/current-docs.md)，清理批准按 [rope-clear](../../../skills/rope-clear/SKILL.md)，此处不重复流程。
- prd.md 持有唯一完整约束包；tasks.md 引用决策 / 约束 ID，并映射切片证据。
- shape 切片前读适用生效章节。就绪需要真实映射、来源路径 / 章节、架构证据、已定处置。无来源候选要显式解决，不伪造 spec 路径。
- 简报必有包路径、约束 ID、必读来源和短内联全局不变量。已核验 none 必须明写；缺字段 / 占位阻塞派发。
- 实现者编辑产品 / 测试前读限定来源，记录 ≤3 行架构落点：复用职责、公共边界、保留归属 / 方向。返回阅读章节和编辑前记录引用。遗漏需真实补救证据，不能倒填。
- 生效规范优先于切片便利。冲突停相关片，由父编排器解决，必要变更 / 例外交用户确认。
- 返回检查机械核架构证据；审查者先读来源，再判断不变量、归属、方向、兼容、例外。verify 只查记录 / 文档路由，不判代码 / 产品。
- 完整声明架构检查是 issue 级证据，不是全产品套件，也不逐片 / 逐合并运行。逐项审例外变化和规则削弱；新增 / 扩大例外、批量冻结实现前需已确认处置。
- 整线合并在候选上核当前目标约束，目标推进前记录协调、检查、审查。
- 操作归属：[整包就绪](../../../skills/rope-shape/references/architecture-continuity.md#package-readiness-gate)与[执行检查](../../../skills/rope-go/references/architecture-gates.md)。由代理执行，不引入宿主拦截器。
- verify 时已确认文档可 pending-finish，finish 改 updated-existing / added-new / no-new-decision / exception-recorded。
- finish 发现未确认架构变化必须暂停。

<a id="tests-required"></a>
## 必需验证

- 通读包模板，确认架构影响与约束包字段。
- 通读切片模板，确认必填 ID、限定来源阅读、独立于矩阵的架构证据映射。
- 通读简报，确认编辑前阅读 / 落点、冲突停止、机械证据返回和预算。
- 通读审查 / 集成流程，确认当前来源、完整检查、逐项例外、推进目标前验收。
- verify 区分待写文档与代码发现；finish 包含四种文档终态及未确认变化暂停。
- 安装冒烟确认技能和参考完整，保留 settings。

<a id="wrong-vs-correct"></a>
## 错误与正确示例

<a id="wrong"></a>
### 错误

```text
实现切片 2，遵循 ADR，补测试。
```

这会迫使叶子猜适用决策、不变量及证明方式。

<a id="correct"></a>
### 正确

```text
切片 2 约束：
- Bundle path: .rope/issues/<issue>/prd.md 的 Constraint Bundle
- Constraint IDs: D1
- Required reading: .rope/specs/<area>/<topic>.md 的 Ownership、Public seam，
  以及状态 / 范围上下文
- Global invariants: <适用来源不变量的短列表>
编辑前读 D1 及生效章节，记录 Architecture landing：复用 <归属者>，
调用 <公共边界>，生命周期仍归 <归属者>，不复制到新入口。
返回阅读及编辑前记录引用、D1 证据。冲突停片交父编排器。
```
