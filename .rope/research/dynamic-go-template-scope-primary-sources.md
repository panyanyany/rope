<a id="dynamic-go-small-fixed-skeleton-issue-filled-task-data"></a>
# 动态 Go：小型固定骨架与 issue 填充的任务数据

日期：2026-09-11。保留动态内核退役前的历史设计研究，不作为当前执行规则。

父综合见 `dynamic-go-template-and-parallelism.md`，补充更直接的 Anthropic 动态工作流文档与迁移工具包。**固定控制层指经测试的正确性机制，不禁止按任务动态选择拓扑 / 模式。**Claude Code 发布规模建议 `small <5`、`medium <15`、`large <50`、`unrestricted`，不是已证明的最佳数量；官方博客推荐随技能分发可改造模板。

<a id="executive-findings"></a>
## 主要发现

1. 共同模式是**代码编排控制 + 结构化任务数据**。OpenAI Agents SDK 说代码编排对速度、成本、性能更确定 / 可预测，列链、评价循环、独立并行代理。[O1]
2. OpenAI 示例支持小控制层：循环、依赖 / 决策函数、结构化输出、独立工作并行，不规定通用任务 / 代理 / 叶子数。[O1]
3. LangGraph 子图有显式输入 / 输出 schema，适合固定 Rope 骨架加 issue 任务记录；父子状态须明确映射或共享 schema。[L1]
4. LangGraph 区分逐调用持久化、逐线程状态、无状态；逐调用使子代理状态独立且全新，适合多数独立请求。Rope 叶子通常全新，只持久紧凑台账与返回产物。[L1]
5. Temporal 借鉴的是语义，不是建议引入服务。重试可能多次执行，写须幂等；活动粒度在重试隔离与历史增长间取舍。[T1]
6. Continue-As-New 用最小状态前传并重置历史，适合长期 / 无界流程，不适合少于 1,000 事件的短流程或自然结束的一次批次。借历史有界原则，不加持久运行时。[T2]
7. 没有一手证据支持通用任务 / 工作流数，应由范围、关键路径、上下文预算、活动叶子上限、宿主限制、证据检查推导。

<a id="recommended-vocabulary-and-sizing"></a>
## 建议术语与规模

- **Issue 范围：**固定行为契约 / 矩阵与允许验收证据，决定必须成立的结果，不决定任务数。
- **任务总数：**含被阻塞下游的全部计划记录；每项终态为集成、带原因阻塞或停止。运行集耗尽不是完成。
- **同时活动叶子：**依赖与归属允许派发的就绪项，受宿主 / 扇出上限限制，是资源设置，不是目标配额。
- **叶子上下文：**一条演示路径、相关约束、边界、测试、返回 schema；超全新窗口或边界可独立消费时拆，不为凑数量拆。
- **关键路径：**实现、集成、检查、E2E、审查、有界修复的最长依赖链。减少串行阶段通常比增加派发数有价值。
- **历史 / 预算：**pi 沙箱上下文与日志有限，保持紧凑，只在持久转换后检查点；本研究没有 Temporal 那样的服务级历史保证，仍需测量。

<a id="fixed-control-plane-mature-reusable-skeleton"></a>
## 固定控制层（成熟可复用骨架）

模板负责确定性机制：

1. 加载 / 校验 issue 任务数据，计算 ID、依赖、拥有文件、测试命令、验收证据。
2. 维护 `planned -> ready -> running -> returned -> integrated` 状态机，其他终态 `blocked|stopped|failed`。
3. 按依赖状态 / 边类型准入，把阻塞显式传播给消费者。
4. 有界并行派就绪叶子，叶子不派工作者。
5. 经核验适配契约规范化返回；当下优先核验提交身份。未来宿主可给清理分支元数据，schema 不能凭空生成、散文页脚不是稳定接口。
6. 要求持久身份 `sliceId`、`status`、提交 / 分支、证据行、路径、命令、错误；畸形返回不算完成。
7. 专用机械适配 / 代理串行集成，逐任务记结果提交 / HEAD 和输入分支。
8. 每次集成重算前沿；仅所有必需记录已集成才成功。已对账 blocked/stopped 连同消费者如实报告非成功终态，不批准。
9. L2 同时要求全部预期输入集成与受影响测试通过；未合并树上的绿不算 L2。
10. L3 要求真实组装入口与一条事件 / 结果路径。
11. 全部必需记录集成、检查绿、树干净、无运行叶子才冻结。
12. 冻结后做行为 E2E 与规范 / 行为审查，结构化发现，最多两轮修复与差量复审；这是当时研究建议。
13. 有意义转换点保存紧凑状态 / 证据，按宿主真实恢复语义执行。pi 是前缀缓存调用重放，不是任意调度 / 副作用恢复引擎。幂等核对提交证据，不声称 exactly-once，不编恢复 API。

这对应 `diagnosis.md` 中的页脚解析、阻塞根后漏消费者、假 L2、过早 E2E 等失败。

<a id="issue-filled-task-specification"></a>
## 由 issue 填充的任务规格

编译执行输入，不为每 issue 新造 JavaScript 控制流。任务 / 验收取批准的 `tasks.md`，宿主能力 / 预算另从会话配置解析，不提议把宿主字段放规范 issue 包或另建手工台账：

- 稳定任务 ID 与 `implement|integrate|gate|e2e|review|fix` 类型。
- 一句演示路径与验收证据 ID。
- 依赖及 `seam-required|file-overlap|methodology-order` 分类。
- 拥有路径 / 边界、预期分支 / 提交封装。
- 准确 red/green/L1/L2/L3 命令或产物路径。
- 简报路径、约束 ID、返回 schema 版本。
- 重试 / 修复预算与终态策略。
- 必需宿主能力：worktree、合并、浏览器 / CLI、恢复。

编译器校验数据并复用已测调度 / 集成 / 终止内核。批准契约内的并行度、诊断分区、可选候选策略可变，不让模型每次重造关键正确性机制。任务记录不授权修复中新加验收。

<a id="host-adapter-boundary"></a>
## 宿主适配边界

pi 行为留窄适配层：派生 / 恢复、结构化返回校验、已核验提交身份、合并调用、文件 / 产物路径、E2E 能力探测。不把散文 / 页脚规范化当分支权威接口。控制层消费规范事件；宿主缺必需操作时返回有类型的环境 / 宿主停止，不当产品失败。

<a id="checkpoint-and-split-policy"></a>
## 检查点与拆分策略

叶子超实测全新上下文、拥有无关演示路径、边界可独立交付消费、重试会重复无关副作用、关键路径不必要串行时拆分。单一演示路径、单归属、单窗口可保持一任务。

未来模板在接受返回、合并提交、检查结果、审查结果等持久边界保存证据，不按任意思考保存。重启遵守安装 runner，外部输入变化须显式失效 / 版本化缓存。最小状态为任务状态、前沿、提交身份、证据引用、有界发现。只有实测历史接近上限才考虑类似 Continue-As-New 重置。

<a id="provenreusable-vs-unsuitable-overhead"></a>
## 可复用内容与不适合的开销

**当前可复用：**OpenAI 代码编排、结构化输出、独立并行、评价循环；LangGraph 显式接口与逐调用全新状态；Temporal 幂等、持久身份、重试边界、历史预算原则。

**不适合分发 MVP：**通用图运行时、分布式持久服务、任意 LLM 控制流、子 workflow 生命周期策略、事件溯源重放、通用自动拆分。没有证据证明 pi 需要，却增加运行 / 运维面。

<a id="evidence-limits-and-measurements-still-needed"></a>
## 证据限制与待测量项

来源证明原则 / API，不证明 Rope 最优数字，不能据此称 2/3/5 叶子、某 token 上限或任务数最佳。代表 issue 需测返回 / 合并失败率、截断、关键路径时间、吞吐、检查点大小、重复重试、真实 E2E 漏失。离线样例覆盖畸形页脚、阻塞根 / 消费者、部分合并但测试绿、检查点后恢复、提前执行检查。

<a id="primary-sources-accessed-2026-09-11"></a>
## 一手来源（2026-09-11 访问）

- [O1] OpenAI Agents SDK “Multi-agent orchestration”：https://openai.github.io/openai-agents-python/multi_agent/ ，代码编排与链 / 循环 / 并行。
- [L1] LangChain “Subgraphs”：https://docs.langchain.com/oss/python/langgraph/use-subgraphs ，schema、持久模式、命名空间、逐调用建议。
- [L2] LangChain “Persistence”：https://docs.langchain.com/oss/python/langgraph/persistence ，检查点、线程、恢复限制、保留 / 清理。
- [T1] Temporal “Activity Definition”：https://docs.temporal.io/activity-definition ，幂等、重复执行、粒度 / 历史取舍。
- [T2] Temporal “Continue-As-New Pattern”：https://docs.temporal.io/design-patterns/continue-as-new ，最小状态、历史重置、51,200 事件上限与适用边界。

<a id="local-context-consulted"></a>
## 查阅的本地上下文

- `.rope/CONTEXT.md`
- 当时 `skills/rope-go/references/dynamic-workflow.md`
- `.rope/issues/dynamic-go-session-audit/diagnosis.md`

未知：本调查有意未检查 pi 准确 SubagentWorkflow API、宿主页脚保证、实测上下文 / 历史限制，由其他调查者负责。
