<a id="superpowers-dispatch-precedents"></a>
# Superpowers 派发先例

<a id="question"></a>
## 问题

obra/superpowers 如何组织主会话向子代理派发，尤其是简报、恢复、上下文保护、模型 / 成本分配和外部调研？

<a id="verified-facts"></a>
## 已核验事实

- SDD 为每个独立计划任务选择全新实现者，随后逐任务审查，最后做广泛的总审查；代理拿到隔离上下文，不继承父历史。来源：[`skills/subagent-driven-development/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/subagent-driven-development/SKILL.md)。
- SDD 有命名提示模板（`implementer-prompt.md`、`task-reviewer-prompt.md`、`re-review-prompt.md`），以及含台账、简报、报告、审查包的持久计划工作区。每份简报只覆盖一个任务；准确值放简报中，代理不应读完整计划。来源：同一 SDD 文件。
- 实现者报告名从简报名推导（`task-N-brief.md` → `task-N-report.md`）；完整报告落盘，会话仅返回状态、提交、一行测试摘要、顾虑。来源：同一 SDD 文件。
- 派发提示不含累积的前序任务摘要，只给当前任务、涉及接口、全局约束。文档记录某次真实派发达 4.2 万字符，99% 为粘贴历史，因此设此限制。来源：同一 SDD 文件。
- 恢复有界：第 1–3 轮继续原实现者；不支持实时消息时，用简报 / 报告 / 发现重新派发。第 4–5 轮换更强模型的全新实现者。第 5 轮后裁决 / 暂存剩余项，只有所有路径都成猜测时才停止。来源：同一 SDD 文件。
- 模型指引：每个角色用足够胜任的最低能力模型；机械性 1–2 文件工作用快速廉价模型，集成 / 调试用标准模型，架构 / 设计用最强模型。来源：同一 SDD 文件。
- 仅对无共享状态的独立领域并行派发；一领域一代理，在同一回复派出以并发。提示声明范围、目标、约束、预期输出。父代理审摘要、查冲突、跑全套。来源：[`skills/dispatching-parallel-agents/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/dispatching-parallel-agents/SKILL.md)。
- brainstorm 按探索试验 / 有界 / 架构复杂度分层；探索调查在保证正确性的前提下尽可能便宜，报告发现 / 建议，一次性工作须标注。未在这些文件中核验到子代理网络调研派发程序。来源：[`skills/brainstorming/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md)。

<a id="assumptions"></a>
## 假设

- 持续演进的 `main` 分支技能文件代表预期方法，不能证明每个宿主都强制执行提示规则。
- brainstorm 的调查指引可启发调研成本纪律，但不证明存在专门的外网调研协议。

<a id="implications"></a>
## 启示

- Rope 简报可以是小而持久的产物，配单独命名的报告、明确任务范围 / 接口 / 约束和简短返回契约。
- 父上下文只保留简短状态与产物路径，避免转发前序任务历史。
- 只并行独立工作线；按角色复杂度选模型，不统一固定等级。明确重试轮次和能力升级，保留尝试记录供全新代理接手。
- 此处没有核验到 Superpowers 关于“改变搜索路径前先刻画环境”或要求 unknowns 包含下一步的先例；应视为 Rope 自己的设计选择，待进一步查源。

<a id="open-questions"></a>
## 未决问题

- 其他 Superpowers 技能是否规定外部调研派发或标准发现产物？
- 哪些宿主集成实际传入模型选择并强制提示模板？
