<a id="research-gsd-and-trellis-subagent-dispatch-precedents"></a>
# GSD 与 Trellis 子代理派发先例调研

<a id="question"></a>
## 问题

确认“gsd”和“trellis”指哪些项目，并核验与 Rope 派发契约相关的一手证据：简报形态 / 输出、恢复、上下文保护、模型并行分配和网络调研。

<a id="identity"></a>
## 项目身份

- **GSD：**当前项目为 [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core)，名称为 GSD Core / Git. Ship. Done，是多运行时的上下文工程与规范驱动开发框架。README 明确说重调研、计划和执行交给全新上下文子代理，以减少上下文退化。同名的 [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) 是前身 / 已归档仓库，其 README 将开发引向 open-gsd/gsd-core。不以第三方 SkillsLLM 描述作主要身份依据。当前维护方 / 作者署名为 open-gsd；旧 README 称系统由 TÂCHES 编写。
- **Trellis：**[mindfold-ai/Trellis](https://github.com/mindfold-ai/Trellis)，开箱即用的 AI 编码工程框架。README 描述持久规范、任务与工作区记忆、多平台支持、四阶段工作流及 research/implement/check 子代理。README 本身确认项目身份，作者 / 组织为 mindfold-ai。

<a id="verified-facts"></a>
## 已核验事实

<a id="identity--lifecycle"></a>
### 项目身份与生命周期

- GSD 前身 README 声明不再活跃，指向 GSD Core：[旧仓库 README](https://github.com/gsd-build/get-shit-done)。
- GSD Core README 列支持的编码运行时，并说明用全新上下文子代理控制上下文退化：[当前 README](https://github.com/open-gsd/gsd-core) 的 “What is GSD Core” 和 “How it works”。
- Trellis README 称其为工程框架，列持久化 `.trellis/spec/`、`.trellis/tasks/` 和工作区日志：[README](https://github.com/mindfold-ai/Trellis)。

<a id="gsd-dispatch"></a>
### GSD 派发

- 计划就是执行提示：目标、引用上下文、任务、验证、成功标准，以及结构化 frontmatter（`wave`、`depends_on`、`files_modified`、`requirements`、`must_haves`）。来源：[前身 planner 规范](https://github.com/gsd-build/get-shit-done/blob/main/agents/gsd-planner.md) 的 “Plans Are Prompts” / “PLAN.md Structure”。这是前身的一手材料；当前 GSD Core 的沿袭关系由 README 跳转确认，当前路径是否对应尚未核验。
- GSD Core 说明计划按波次并行，每个执行者有全新上下文（README 的 “How it works”）。当前 GSD Core `execute-phase` 的搜索结果提到配额失败分类、受 `max_escalations` 和 provider 阶梯约束的模型重新解析 / 升级、遵守 Retry-After，最后给人工恢复提示而非静默重复最后模型：[搜索结果指向 next 分支 docs/CONFIGURATION.md 与 docs/ARCHITECTURE.md](https://github.com/open-gsd/gsd-core/blob/next/docs/CONFIGURATION.md)。未独立抓取，只视为已核验的搜索摘要。
- GSD planner 任务类型明确含 `auto`、`checkpoint:human-verify`、`checkpoint:decision`、`checkpoint:human-action`；任务结构要求准确文件、操作、自动验证、完成标准。来源：前身 `agents/gsd-planner.md` 的 “Task Types” / “Task Anatomy”。
- GSD 计划写入 `PLAN.md`；前身证据说执行者产出计划 `SUMMARY.md`（当前归档仓库 `execute-phase.md` 的网络搜索结果）。GSD Core README 也列出持久 `STATE.md` 和 `CONTEXT.md`。当前派发中会话返回与产物的准确协议仍未核验。
- 调研按深度分级：0 级跳过；1 级用 Context7 快速核验；2 级按发现工作流标准调研，产出 `DISCOVERY.md`；3 级深挖，也产出 `DISCOVERY.md`。来源：前身 `agents/gsd-planner.md` 的 “Discovery Levels”。
- 模型并行分配策略：已获取的一手摘录不足以确认。没有证据支持强制廉价模型或固定子代理数量。

<a id="trellis-dispatch"></a>
### Trellis 派发

- README 工作流：brainstorm 写 `prd.md`；重调研交给 `trellis-research`；精选规范 / 调研由 `implement.jsonl` / `check.jsonl` 引用；implement、check 分属不同子代理；check 能修则自修。来源：[README](https://github.com/mindfold-ai/Trellis) 的 “How It Works”。
- research 代理契约：发现、解释、持久化；每项发现必须写 `{TASK_DIR}/research/<topic>.md`；只返回路径和一行摘要，不返全文。区分内部 / 外部 / 混合调研；外部含文档、API、实践；独立查询可并行。来源：[`.claude/agents/trellis-research.md`](https://github.com/mindfold-ai/Trellis/blob/main/.claude/agents/trellis-research.md) 的 “Core Principle” / “Workflow” / “Report Format”。
- 没有活动任务时不猜输出位置，通过 `task.py current --source` 解析。只能写任务调研文件，禁止改代码 / 规范 / 配置及 git 操作。来源：同文件 “Step 1” / “Scope Limits”。
- implement 代理有递归保护：已派发 implement/check 不得再派生，只有主会话可派这些角色。需要更多并行时报告建议。有 hook 注入上下文时使用；回退时明确读取清单所列文件和任务产物。来源：[`.claude/agents/trellis-implement.md`](https://github.com/mindfold-ai/Trellis/blob/main/.claude/agents/trellis-implement.md) 的 “Recursion Guard” / “Context Loading”。
- implement 返回紧凑结构化状态，含改动文件、摘要、验证。来源：同一 implement 文件的 “Report Format”。
- README 说明 check 对照规范审查，并运行 lint/typecheck/tests，能修则自修。一手 [`.claude/agents/trellis-check.md`](https://github.com/mindfold-ai/Trellis/blob/main/.claude/agents/trellis-check.md) 曾被抓取，但本记录未保留完整正文。
- 规划产物明确：`prd.md` 放需求 / 验收，`design.md` 放技术架构 / 契约 / 风险，`implement.md` 放有序清单 / 验证 / 回滚。子代理工作流启动前，两份清单都须有真实条目。来源：[`.claude/skills/trellis-brainstorm/SKILL.md`](https://github.com/mindfold-ai/Trellis/blob/main/.claude/skills/trellis-brainstorm/SKILL.md) 的 “Artifact Rules”。
- brainstorm 强制计划 / 批准门槛；用户所属决策未解时停止派发，最终批准须在最终计划摘要之后。来源：同技能的 “Non-Negotiable Planning Contract” / “Planning Flow”。
- 搜索找到定义 worker card 的一手参考：[`.agents/skills/trellis-channel/references/workers.md`](https://github.com/mindfold-ai/Trellis/blob/main/.agents/skills/trellis-channel/references/workers.md)。本次未获取正文，卡片细节和模型策略仍未决。
- 已获取的一手来源均未证明强制廉价模型、固定并行数量或通用子代理重试策略。check 自修与 GSD 配额升级范围较窄，不是通用重试规则。

<a id="assumptions"></a>
## 假设

- “gsd”指 Get Shit Done / 当前 GSD Core，而非其他 GSD 缩写项目；准确身份线索和前身显式跳转支持此判断。
- “trellis”指 mindfold-ai/Trellis，而非其他同名代理项目；其规范 / 任务为中心的工作流与线索吻合，并有一手子代理角色文件。
- GSD 前身 planner 契约可作历史先例，但可能与当前 GSD Core 不同；当前 README 仅确认沿袭关系，不确认所有实现细节。

<a id="implications"></a>
## 启示

- 将 Rope 派发简报视为有类型、可执行契约：角色 / 类型、目标、准确范围 / 文件、输入 / 上下文、输出产物 / schema、验证、完成标准。
- 持久发现与返回摘要分开。Trellis 的上下文保护模式很明确：完整调研落入限定范围的任务产物，仅返回路径和简短摘要。
- 递归保护与权限边界防止嵌套派发和范围膨胀；工作超出角色时提供向父代理升级 / 建议的渠道。
- 区分恢复类型：工具 / provider 故障，与结果不全 / 质量不足。GSD 搜索证据支持有界 provider 升级，不支持无限重试。
- 模型等级策略和最大并行度需要 Rope 自己决策；这些来源不能证明通用廉价模型要求。
- 外部调研应声明输出位置、要求有来源的发现并报告保留意见；Trellis 将网络调研视为正式 research 职责。

<a id="open-questions"></a>
## 未决问题

- 未获取当前 GSD Core 准确的 executor 提示 / 模板、结果返回契约及计划 / 执行文档；测试过的原始路径返回 404。搜索摘要和前身材料弱于完整当前源码。
- 需直接检查 Trellis worker card 定义与 `trellis-check` 准确报告 / 恢复规则。
- 两项目已获取来源均未确定廉价模型默认、最大并行数、所有失败类型是否重试。
- 已获取的 Trellis research 契约未明确外网调研的来源质量 / 引用门槛。
