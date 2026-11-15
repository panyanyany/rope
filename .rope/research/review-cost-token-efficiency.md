<a id="review-cost--token-efficiency-in-agent-workflow-systems"></a>
# 代理工作流的审查成本与 token 效率

<a id="question"></a>
## 问题

Anthropic/Claude Code、Cognition/Devin、Trellis、OpenAI Codex、GitHub Copilot 等系统，如何处理多代理编码的审查成本和频率？重点是逐工作单元还是批量 / 例外审查、review 与 verify 重复验证、父编排器上下文节省。作为 Rope 决定逐切片审查频率、go 总审与 rope-verify 重叠、审查模型路由的输入。以下保留研究时建议，不替代现行 ADR / 技能。

<a id="verified-facts"></a>
## 已核验事实

### anthropic-token-economics

Fact: Anthropic 报告代理比聊天约多用 4 倍 token，多代理约 15 倍；仅 token 用量可解释 BrowseComp 表现差异的 80%。多代理更适合并行搜索调研，编码通常可真正并行的任务较少；任务价值须足以支撑成本。
Source: https://www.anthropic.com/engineering/multi-agent-research-system
Verified by: 内容抓取与段落检索，2026-07。
Stability: high。
Implication: 每多一轮代理，例如逐切片审查，都会增加 token 开销；上游将代理成本视为需论证的投入，而非默认配置。

### anthropic-end-state-evaluation

Fact: Anthropic 有状态代理附录建议评价最终状态，而非逐轮分析；复杂流程拆为应发生明确状态变化的检查点，不验证所有中间步骤。
Source: 同文附录 “End-state evaluation of agents that mutate state over many turns”。
Verified by: 抓取并提取原句。
Stability: high。
Implication: 不支持用 LLM 逐个验证中间切片；可用确定性检查点加一次终态判断。

### anthropic-filesystem-artifacts

Fact: Anthropic 附录建议子代理将工作写外部系统，仅传轻引用给协调者，减少大输出穿越聊天历史的 token；完成阶段摘要进入外部记忆，子代理为主代理浓缩重要信息。
Source: 同文 “Subagent output to a filesystem …” / “Long-horizon conversation management”；已固定在 `.rope/research/single-window-go-orchestration.md` 的 `anthropic-endstate-and-artifacts`。
Verified by: 抓取原句与本地固定调研。
Stability: high。
Implication: 父按引用读产物 / diff / 摘要，不内联叶子轨迹；Rope issue 包已符合。

### claude-code-adversarial-review-step

Fact: Claude Code 最佳实践建议无人值守工作**结束**时做一次独立对抗审查；独立代理只看 diff 与给定标准。内置 `/code-review` 用全新子代理审当前 diff。另有作者 / 审查者双会话模式，全新上下文减少对刚写代码的偏见；要求展示测试等证据，而非口头声称成功。
Source: https://code.claude.com/docs/en/best-practices
Verified by: 内容抓取与段落检索，2026-07。
Stability: medium，持续更新文档。
Implication: 频率随无人值守时长 / 风险变化，不按单元数；一手模式是全新上下文 diff 审查加证据展示。

### claude-code-subagent-cost-control

Fact: 官方说明上下文是根本约束，子代理用独立窗口并返回摘要；支持较廉价 `model` 覆盖；auto 模式把逐命令风险审查交给独立分类模型，仅阻塞风险动作，是低成本例外审查。固定 GitHub issue 说明模型覆盖可能静默失效。
Source: https://code.claude.com/docs/en/best-practices 及 https://code.claude.com/docs/en/sub-agents ；固定在 `single-window-go-orchestration.md` 的 `claude-code-subagent-capabilities`、`claude-code-model-override-fragility`。
Verified by: 内容抓取与本地固定调研。
Stability: medium。
Implication: 廉价模型做机械扫描，强模型做判断；记录每叶子实际生效模型。

### cognition-context-fragmentation

Fact: Cognition 的 “Don't Build Multi-Agents” 指出上下文碎片化导致协作失败：原则 1 要共享上下文和完整轨迹；原则 2 指动作含隐式决策，多个决策者易分歧。其文所述 2025-06 Claude Code 子代理只答问题，不并行写代码，收益是调查过程不必留在主代理历史。
Source: https://cognition.com/blog/dont-build-multi-agents
Verified by: 内容抓取与段落检索，2026-07。
Stability: medium，有立场但广受引用。
Implication: 只读审查代理贡献判断、不改状态，风险较低；每个需重建上下文的代理都付 token 并增加误沟通可能。

### cognition-clean-context-reviewer

Fact: Cognition 的 “Multi-Agents: What's Actually Working” 称 Devin Review 每 PR 平均发现 2 个 bug，约 58% 严重；编码与审查代理事先不共享上下文时效果最佳。审查者只看 diff、自己发现所需背景，短上下文提高细微问题检测；编码者用更完整背景过滤发现，形成沟通桥以防循环。原则是写入保持单线程，其他代理贡献判断。
Source: https://cognition.com/blog/multi-agents-working
Verified by: 内容抓取与段落检索，2026-07。
Stability: medium。
Implication: 对交付单位 PR 审到通过；最小干净审查上下文既便宜又有效，不需实现记录。

### trellis-single-check-self-fix

Fact: Trellis 每任务实现后只有一次 check 阶段（`trellis-check`）：读 `prd.md`、可选 `design.md` / `implement.md`、窄 `check.jsonl` 上下文清单、变化文件；跑本地 test/lint/type-check，可直接修发现并重查。通过后主会话最终验证及更新长期规范。小任务可只有 PRD；`check.jsonl` 仅窄范围引用规范 / 调研，不放修改文件。
Source: https://docs.trytrellis.app/start/how-it-works 第 5–10 步；仓库事实见 `.rope/research/upstream-inspiration-sources.md`，AGPL-3.0，仅提取思路。
Verified by: 2026-07 抓取与本地固定调研。
Stability: medium。
Implication: 不逐子单元派审查者；确定性命令与一次读修循环之后，做证据 / 终态检查。审查按清单引用加载。

### github-tiered-risk-based-review

Fact: GitHub 对代理 PR 的一手指引是自动检查先处理机械层，人工集中判断；先将任务分为窄或复杂，再定审查深度。过大无范围 PR 与代理放弃相关，应先要求拆分而非深入审。Copilot 代码审查已超过 6000 万次，不到一年增长 10 倍。
Source: https://github.blog/ai-and-ml/generative-ai/agent-pull-requests-are-everywhere-heres-how-to-review-them/
Verified by: 内容抓取与段落检索，2026-07。
Stability: high。
Implication: 明确机械 / 自动与判断两层，按风险定深度，不统一审查频率。

### openai-codex-review-rules

Fact: Codex Code Review 按 PR 或按需 `@codex review` 运行，是额外审查者；测试、分支保护、必需批准仍提供硬约束。`AGENTS.md` 保存精简、限定范围的审查指引，按引用应用并在发现中引用。规则指引恢复 98% 必需自定义发现，对照基线 58.3%。
Source: https://developers.openai.com/blog/custom-code-review-rules-for-codex
Verified by: 2026-07 内容抓取并提取原句。
Stability: high。
Implication: LLM 补充确定性验证，不重复它；质量来自引用长期规则，不是加大审查上下文。

### local-thrifty-and-pinned-sources

Fact: `thrifty` 固定于 `single-window-go-orchestration.md` 的 `thrifty-tiered-delegation`：强模型写契约，廉价模型执行并按独立重跑检查自修；强模型只处理失败 / 需判断标准，小样本下同等检查质量约便宜 64%，保留了限制说明。同文件有 Aider Architect/Editor 与 Depot `/orc` 结构化构建后审查。已固定 mattpocock/skills 的 `source.md`、`correspondence.md` 未规定审查频率、批量或 token 预算；`tdd` 对应 rope-go 切片纪律，`handoff`（watch）对应已吸收的叶子简报。Trellis 仅历史灵感，见 U1。
Source: `.rope/research/single-window-go-orchestration.md` 的 `thrifty-tiered-delegation`、`industry-supplement-clean-review`；`.rope/upstream/mattpocock-skills/source.md`、`correspondence.md`；`.rope/research/upstream-inspiration-sources.md`；https://github.com/2389-research/thrifty
Verified by: 先前经克隆 / 阅读核验的本地固定研究，及 2026-07 直接阅读。
Stability: medium。
Implication: 检查优先，仅失败时用 LLM 判断，是接近 Rope 成本分工的实测类比；Matt 上游没有要求增加审查频率。

<a id="answers-to-the-three-key-questions"></a>
## 三个关键问题的答案

1. **逐单元还是批量 / 例外审查：**调查到的一手系统没有为每个内部工作单元派全新 LLM 审查者。审查附于 PR 或无人值守工作结束：Devin 按 PR 循环，Codex 按 PR / 按需，Copilot 是 PR 的机械首层，Claude Code 完成前一次独立检查，Trellis 每任务 check + 自修，thrifty 检查绿时不派。风险 / diff 分类决定深度。
2. **重复验证：**上游保留确定性检查权威，LLM 留给终态判断。没有对同一组装 diff 连做两次同范围 LLM 阅读。Trellis 的 check 修复与 finish 最终验证顺序不同、职责不同。go 总审加同形状 rope-verify 正是应避免的重复。
3. **父编排器 token：**文件产物加轻引用，不复制大输出；子代理返摘要，父读 diff 而非轨迹；用窄引用清单；干净最小审查上下文既省又好；廉价模型做机械扫描 / 执行，强模型只处理判断 / 失败。

<a id="implications-for-rope"></a>
## 对 Rope 的启示

(a) **逐切片频率：**逐片 LLM 审查高于所有调查默认值。证据支持当时的 thin 选项：默认确定性测试 / 矩阵 / E2E，仅 shape 标 `Review: required` 的风险片或检查失败时派审查者。既保留高风险边界早发现，也省常规 token。这是决策输入；当前采用何种频率以生效 ADR 为准。

(b) **go 总审与 rope-verify 重复：**两个强模型对全 diff 连读重复终态判断。可合并为唯一终态检查，或拆成廉价机械证据收集与判断验收；无论哪种，verify 应用已有证据，不重审发现。

(c) **模型 / 思考路由：**廉价低 / 无思考模型做机械扫描和证据汇集，强模型处理失败判断和最终验收。简报只含 diff、验收标准、引用路径，不含实现记录；记录实际模型 / 思考等级，因覆盖可能失效。

<a id="sources"></a>
## 来源

本地固定资料：

- `.rope/upstream/mattpocock-skills/source.md`
- `.rope/upstream/mattpocock-skills/correspondence.md`
- `.rope/research/upstream-inspiration-sources.md`
- `.rope/research/single-window-go-orchestration.md`

网络一手资料，2026-07 已抓取：

- https://www.anthropic.com/engineering/multi-agent-research-system
- https://code.claude.com/docs/en/best-practices
- https://code.claude.com/docs/en/sub-agents
- https://cognition.com/blog/dont-build-multi-agents
- https://cognition.com/blog/multi-agents-working
- https://docs.trytrellis.app/start/how-it-works
- https://github.blog/ai-and-ml/generative-ai/agent-pull-requests-are-everywhere-heres-how-to-review-them/
- https://developers.openai.com/blog/custom-code-review-rules-for-codex
- https://github.com/2389-research/thrifty
