<a id="0003-dynamic-workflow-mode"></a>
# 0003 Dynamic 工作流模式

> **状态：由 [0007](0007-graph-driven-go-single-review.md)替代图与检查规则，机制部分由 [0014](0014-workflow-execution-mode.md)替代。**mode 字段退役，文件不相交、禁嵌套不变量延续。以下保留原决策。

原设计为 shape 手动选择的每 issue dynamic 模式：契约优先、不相交文件归属，go 对无重叠片派廉价实现叶子并发，保片审及 issue 验证，关闭 / 缺省时串行不变。

<a id="context"></a>
## 背景

code-change-session-repo-management 的七串行片约六小时，核心服务被 5/8 片触碰，其中一片约 7000 行。原可选并行前沿少用，因为按功能逻辑切会向同核心文件追加，物理并行不可行或冲突多。用户希望手动模式将工作切成小而独占文件的片，廉价模型并行再组装，参考契约优先、文件不相交、worktree、子代理先例，见 dynamic-workflow-mode 调研。

<a id="decision"></a>
## 决策

- shape 询问，选择后强制三段切片并写 mode: dynamic；不选不变。
- prd 的 mode: serial | dynamic，缺省 / serial 保串行。
- 三段：先串行 contract，只定接口 / 数据 / 调用边界；再按不相交文件实现，共享核心归属是 shape 缺陷；每片默认约 400 diff 行 / 4 文件，尾部 integration 组装并验证契约。
- dynamic 前沿为无未解阻塞片，不相交并发廉价实现，重叠串行，片审、提交、父只读 verify 均保留。
- 模型复用 harness-presets，父可按风险覆盖，不加模型机制。

<a id="why-this-split"></a>
## 理由

代理并行能力较弱，所以只在不相交、独立可验证时安全。契约和归属是关键护栏。实现 / 验收分离不变；父是唯一编排者，叶子不派生。冻结公共边界让前后端并行。

<a id="consequences"></a>
## 后果

契约 → 并行实现 → 轻集成；重叠和头尾串行。宿主不能并发则降级串行、tasks 记理由。完全手动可选，不影响普通 issue。

<a id="considered-options"></a>
## 考虑过的方案

自动检测违用户手动要求；go 才开关无法事先不相交切片；直接用 pi-dynamic-workflows 当时是原型、缺隔离 / 授权 / 并发控制且冲突现有检查；无差别并行违安全条件。均拒绝，工具可单独用于只读扇出。
