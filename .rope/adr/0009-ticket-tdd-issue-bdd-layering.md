<a id="0009-ticket-tdd--issue-bdd-layering-and-tracer-bullet-slicing"></a>
# 0009 工单 TDD、issue BDD 分层与 Tracer-bullet 切片

**状态：**active，保留 0008 派发，替代“每片完整纵向路径”硬规则和 E2E 重复记账；测试成本由 [0013](0013-test-cost-tiering.md)补齐。

日期：2026-08-24。

<a id="decision"></a>
## 决策

1. 切片与 to-ticket 的 tracer-bullet 一致。硬约束是阻塞边、单窗口、shared 文件不相交，不是每片完整用户路径。组件片合法，简报引用用户故事矩阵行及自身接口 / 通过标准。shape 主动找前置重构，先让变化容易，再完成容易的变化，常能打开并行宽度。
2. 矩阵成为 issue 行为规范，适合时 Given/When/Then，不再指向切片。工单单元由叶子红绿证明；原始 issue BDD 由审查者真实入口走矩阵，后续运行归属见 0015。
3. e2e.md 只放模拟无法证明的真实外部系统 / 入口 / 数据；依赖真实 API 语义的假件单测行为也需真实验证。不重跑工单测试，删 covered_by_slice；能如此标记的本就不属 E2E。
4. go 主路径聚焦并发循环，降级放失败才读的故障手册。

<a id="context"></a>
## 背景

0008 后 agent-web-search-tool 首次现场串行唯一并行对：模式文字像“找理由降级”，完整纵向硬约束把宽度压在 2。E2E 又充满重复 TDD 的 covered_by_slice，是旧不信片验收的三重保险残留。上游显示阻塞边、后台并发、单次结束审查足够。

<a id="consequences"></a>
## 后果

图更宽，组件及前置重构喂给并发；契约轴明确 BDD；E2E 缩为每 issue 约 3–5 个真实场景；纵向路径是偏好而非铁律，能独立演示仍应演示。

<a id="alternatives-considered"></a>
## 考虑过的方案

保纵向硬规则和重复 E2E：压并发、增记账，拒绝。全盘换上游并删矩阵 / 摘要 / 包：失验收锚及架构连续性，拒绝，只对齐切片哲学。
