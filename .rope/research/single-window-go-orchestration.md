<a id="single-window-go-orchestration"></a>
# 单窗口 Go 编排

本文件保留单窗口工作流形成时的研究、用户选择及候选方案；文中的“当前”指研究当时，最终规则以生效 ADR 和技能正文为准。旧 verify 技能、逐片审查和固定两轮预算等已继续演进。

<a id="question"></a>
## 问题

Rope 是否应从人工双窗口交接（计划窗口 grill/shape/verify ↔ 实现窗口 go）转为单 issue 窗口：父会话 grill → shape → 派 go 子代理 → 父审查 / 验证？收益、成本、参考流程和产品未决点是什么，尤其逐切片审查是否仍必需？

<a id="verified-facts"></a>
## 已核验事实

### rope-current-window-split

Fact: 当时 CONTEXT / ADR 明确计划窗口 A 与实现窗口 B。A 负责 grill、shape、issue verify、最终接受 / 拒绝；B 负责 go 的切片 TDD、逐片审查、E2E。verify 只读代码，修复提示交回实现窗口，逐片审查归 go。
Source: `.rope/CONTEXT.md` 的 Planner Window / Implementer Window / Per-Slice Review / Issue-Level Verify；`.rope/adr/0001-issue-level-verify-separated-from-go.md`；当时 `skills/rope-verify/SKILL.md`、`skills/rope-go/SKILL.md`；README 典型流程 4–5。
Verified by: 直接读仓库文档 / 技能 / ADR。
Stability: high。
Implication: 用户双窗口实践比 grill/shape 的默认同会话措辞更符合当时设计。

### rope-skill-handoff-tension

Fact: grill/shape 当时已说默认内联 / 同会话，仅用户切窗口才出复制提示；go 最后仍让用户回计划窗口跑 verify，README / ADR 仍描述跨窗口修复路由。
Source: grill/shape 交接节、go Overall Verification 第 6 步、README。
Verified by: 直接阅读。
Stability: medium，已有部分漂移。
Implication: 产品意图已向单窗口迈一半，剩余硬分界是 go 模型路由与 issue 验证分离，不是永远两个窗口。

### adr-why-verify-not-self-fix

Fact: ADR 0001 拒绝 issue verify 采用 Trellis 自修：强模型 token 买判断而非编辑循环；单一写代码面让 git / 历史集中；升级检查由模型判断。触发证据是静默 review_degraded 及失败 E2E 被当完成。
Source: `.rope/adr/0001-issue-level-verify-separated-from-go.md`。
Verified by: 直接阅读。
Stability: high。
Implication: go 移子代理不自动废除 verify；应保留实现 / 验收角色分离，不一定保留两个人工窗口。

### anthropic-orchestrator-worker

Fact: Anthropic Research 用主代理加独立上下文并行子代理。内部调研评估 Opus 主 + Sonnet 工作者较单 Opus 提升 **90.2%**；多代理约聊天 **15 倍** token，普通代理约 **4 倍**。文中明确广度调研比多数编码更适合多代理，编码实时协调仍弱。
Source: https://www.anthropic.com/engineering/multi-agent-research-system
Verified by: 抓取一手工程文章。
Stability: medium，数字为内部评估。
Implication: 独立探索 / 浓缩有支持，并行多写者较弱。shape 后单 go 工作者是串行编排，更接近 Claude Code，而非 Research。

### anthropic-workflow-patterns

Fact: Anthropic 模式含带检查的提示链、路由、并行、orchestrator-workers、evaluator-optimizer。编码可用测试客观反馈，广泛系统适配仍需人工审；先简单，仅实测有益才加复杂度。
Source: https://www.anthropic.com/engineering/building-effective-agents
Verified by: 抓取一手工程文章。
Stability: high。
Implication: Rope 已像带门槛的 grill→shape→go→verify 链；verify↔fix 对应评价优化，父派 go 对应编排工作者。

### anthropic-endstate-and-artifacts

Fact: 对有状态多轮代理，Anthropic 建议终态评价而非逐轮过程判断，用文件系统让子代理落盘并返轻引用，减少协调者传话丢失。
Source: 同一多代理文章附录。
Verified by: 抓取。
Stability: high。
Implication: `prd.md` / `tasks.md` / `e2e.md` 加 git 已是正确交接介质；父用产物和 diff，不只信 go 散文摘要。

### claude-code-subagent-capabilities

Fact: 当时 Claude Code 子代理有独立上下文，支持 `model` 覆盖、工具允许 / 禁止、预加载 `skills`、`maxTurns`、前后台、最多 5 层嵌套、`isolation: worktree`。官方建议保护主上下文 / 控成本，噪声工作交子代理；多阶段共享大量迭代上下文、频繁用户往返则主会话更合适。
Source: https://code.claude.com/docs/en/sub-agents
Verified by: 文档抓取。
Stability: medium，产品快变，已有模型覆盖缺陷报告。
Implication: 父派廉价 go 是成熟宿主支持的模式，但须在实际 pi / Claude Code 版本验证模型覆盖。

### claude-code-model-override-fragility

Fact: 社区 / issue 报告 `model` frontmatter 或 Agent 参数可能静默无效，被 `CLAUDE_CODE_SUBAGENT_MODEL` 覆盖，或延续边界后丢失。
Source:

- https://github.com/anthropics/claude-code/issues/54448
- https://github.com/anthropics/claude-code/issues/57718
- https://github.com/anthropics/claude-code/issues/68147

Verified by: GitHub issue 搜索摘要。
Stability: low，可能特定版本。
Implication: 成本收益依赖可观察的实际模型；tasks / go 报告记实际模型与思考，不只请求值。

### cognition-dont-build-multi-agents

Fact: Cognition 指多代理编码易因上下文不全共享、动作隐含决策而分歧。原则为尽量共享完整轨迹、避免冲突决策者。2025-06 文中 Claude Code 子代理主要答题 / 调研，不并行写代码，也不与主同时写；偏向单线程加压缩 / 记忆。
Source: https://cognition.com/blog/dont-build-multi-agents
Verified by: 博客抓取。
Stability: medium，一家实验室的强立场但广受引用。
Implication: 无更强契约不应大量并行写片；单实现者执行固定包更像可接受子任务，不是多编码者共识。

### discrete-phase-separation

Fact: 设计资料建议调研 / 计划 / 执行用分离会话，只传浓缩产物；单上下文内分节仍会关注噪声，隔离也便于强计划 / 廉价执行的阶段模型路由。
Source: https://agentpatterns.ai/agent-design/discrete-phase-separation/
Verified by: 抓取。
Stability: high，模式层。
Implication: 父 grill/shape、子 go 符合隔离；同父内联 go 会污染计划 / 验证上下文。

### context-pollution-coding-loops

Fact: 长混合角色线程把任务、搜索、失败方案、日志、审查挤进非结构化窗口，产生上下文退化。Depot `/orc` 等用独立计划 / 澄清 / 构建 / 审查代理，仅传结构包。
Source:

- https://depot.dev/blog/context-isolation-in-coding-agent-loops
- https://ar5iv.labs.arxiv.org/html/2601.14914 ，CodeDelegator 的角色分离缓解调试轨迹污染。

Verified by: 抓取 / arXiv HTML。
Stability: medium。
Implication: 优化一个人工交互面，不把 grill+go+verify 都塞一个模型上下文。

### thrifty-tiered-delegation

Fact: `thrifty` 强模型写契约 / sprint，廉价模型执行并按独立重跑检查自修，强模型只针对剩余失败做限定补丁。7 个多单元任务报告同检查质量较单 Opus 约便宜 **64%**，n=1、本地成本估算，限制已记录。关键是固定跨 sprint 歧义、复用缓存廉价代理而非许多冷派发、不开放强模型无限修、先检查再让强模型处理失败 / 判断项。
Source: https://github.com/2389-research/thrifty ，README 与 eval/RESULTS.md。
Verified by: 克隆 / 阅读。
Stability: medium，限制明确。
Implication: 接近 Rope 成本分工；issue 包 / 矩阵已是契约，未决是中途审查由强模型还是测试检查承担。

### pi-stock-vs-runtime-subagents

Fact: pi 原版不内置子代理 / 计划模式，示例扩展用隔离 `pi` 子进程与 scout/planner/reviewer/worker、implement/implement-and-review 链。现场 Agent 来自 `@tintinweb/pi-subagents`，支持 `model`、`thinking`、`run_in_background`、worktree、`inherit_context`、resume/steer。
Source: pi README 理念节、`examples/extensions/subagent/README.md`、已安装扩展与工具接口。
Verified by: 本地包阅读与只读调查。
Stability: medium，宿主相关。
Implication: 技能写通用能力契约；宿主不能模型路由或派可写叶子时，保留跨窗口出口。

### pi-subagents-no-nested-agent

Fact: 该版 pi 子会话不继承 `Agent` / `get_subagent_result` / `steer_subagent`，go 作为叶子不能再派审查者。廉价模型覆盖、编辑 / bash / 提交、后台 / steer / resume、worktree 可用，嵌套图不可用。
Source: 已安装 runner 的工具排除列表。
Verified by: 本地只读 explore。
Stability: 对此版本 high；Claude Code 的嵌套能力不自动可移植。
Implication: 直接派完整 go 会复现 ADR 0001 捕获的 review_degraded。可行方案为顶层廉价 go 会话、父拥有循环并分别派实现 / 审查、或叶子 go 只做确定性中途检查，LLM 审查移父 / 精简。

### industry-supplement-clean-review

Fact: Cognition 后续认为额外代理适合审查 / 建议，干净上下文收益高；Aider Architect/Editor 显示强推理 + 廉价编辑可优于单模型。实践文章发现代理完成声称常漏大量项，须重跑真实信号；Devin 类系统外置结构化计划。
Source: 调研摘要引用 Cognition multi-agents-working、Aider architect、Loadsys completion-proof。
Verified by: 网络研究子代理综合。
Stability: medium。
Implication: issue 包作总线、issue verify 必需；确定性检查足够时中途 LLM 审查可精简。

<a id="assumptions"></a>
## 假设

- 一 issue 一窗口指一个人工会话面，不是所有角色共模型上下文。
- go 廉价、grill/shape/verify 强模型仍有价值。
- shape 完整包是主要交接，不需全部 grill 聊天。
- 宿主需能派不同模型可写叶子，否则保留人工窗口 B。

<a id="crystallized-product-direction-grill-2026-07-16"></a>
## 已确认产品方向（grill，2026-07-16）

当时用户决策，尚未 shape：

1. **跨宿主：**技能写通用编排，模型 ID、代理类型、派生 API 由宿主运行时解析。
2. **父唯一编排：**主会话拥有 grill、shape、切片、审查派发、issue verify，子代理只作叶子。
3. **政策禁止嵌套：**宿主即使支持也不让工作者再派工作者，便于可移植和调试。
4. **新增模型目录 / 角色预设技能：**发现可用模型，查相对能力，排序写角色预设；共享角色 schema，输出宿主原生绑定。
5. **拒绝完整 go 叶子：**旧 go 内派审查职责上移父，不在任何宿主依赖嵌套。
6. **当时叶子角色：**implementer、reviewer、explore、verify-inspector；父是会话角色，不是预设行。
7. **保护父上下文：**纠偏改简报再派，避免压缩丢 grill；决策在 grill 中即写 `.rope/` / issue 包。
8. **预设存储：**用宿主原生代理目录，Rope 仅薄映射 / 生成信息。
9. **默认用户级：**如 pi `~/.pi/agent/agents/`；项目共享提示以后可选，模型目录随机器变，不默认项目级。
10. **清单用户全局：**如 `~/.config/rope/harness/<host>.json` 或 `~/.rope/harness/<host>.json`，不放项目 / 技能本地，不存第二份提示库。
11. **手动刷新：**无 stale_after / TTL，缺预设可提醒用户，不自动刷新正常配置。
12. **缺预设软降级：**用宿主通用工作者，不强制模型，记 preset_missing 后继续，提示手动运行，不硬阻塞 / 自动生成。
13. **拆两 issue：**W2 先做目录 / 原生预设 / 全局清单；W1 后做父工作流与技能措辞。W1 可软用 W2，不硬依赖。
14. **思考等级：**默认在原生角色预设，父按风险可逐次覆盖；宿主不支持则忽略，不让叶子自选作主策略。
15. **W2 退役 verify settings pin：**移除 skill 本地 settings.json / settings.example.json 与 README 指引，唯一配置为原生 rope-* 预设 + 全局清单，无需双读；发现旧文件可给一次迁移提示。

<a id="portable-orchestration-contract-draft"></a>
### 可移植编排契约（草案）

```text
父（强模型 / 会话模型）
  负责 grill、shape、切片循环、审查派发、issue verify、finish 交接
  可派：实现叶子（写 / 测试 / 提交一单元）
        审查叶子（只读批评已完成工作）
        探索 / 机械检查叶子（只读事实）
  不要求叶子再派叶子

叶子
  输入：自包含简报、产物路径、验收标准
  返回：摘要、路径、状态
  不编排其他代理

产物总线：.rope/issues/<id>/* + git
```

<a id="parent-executes-vs-delegates-draft-policy"></a>
### 父执行还是委派（策略草案）

父以判断和上下文保护为主。2026-07-16 用户决定：纠偏也由父改简报后交叶子，避免调查倾倒、长日志、多轮修复填满最稀缺的父上下文。

**父必做：**grill / shape / 授权 / issue 接受拒绝、与人交流、早写长期决策、决定叶子及纠偏简报、默认只读摘要与产物 diff 而非全轨迹。

**父不批量做：**大量探索 / 搜索 / 日志 / 测试输出吸收、实现与重实现、verify 后长精修、矩阵 / E2E 证据机械收集。

**纠偏模式：**

```text
叶子失败 / 漂移
  → 父按摘要和产物判断
  → 更窄简报，固定遗漏决策
  → 重派实现 / 审查叶子
  → 仅缺事实导致无法写简报时，先派 explore 再写
```

**当时保留的窄自执行例外：**grill/shape 编辑 issue / ADR / research / CONTEXT；极小一行文档修复；宿主完全不能派叶子的降级模式。

判断原则：父持决定，叶子持噪声；压缩后无需保留的工作交叶子，需跨压缩存活的决定立即落盘。

grill 及后续编排技能应明确提醒委派污染上下文的调查，并在压缩前沉淀已解决定。

<a id="mature-harness--skill-references-for-this-split"></a>
### 支持此分工的成熟参考

| 参考 | 编排者 | 工作者 | Rope 适配 |
| --- | --- | --- | --- |
| Claude Code | 多阶段判断、迭代、用户往返 | 噪声侧任务、廉价模型、限工具 | 父判断，叶子实现 / 审查 / 探索 |
| thrifty | 强模型契约 / sprint，仅剩余失败限定补丁 | 廉价模型按检查执行 | 成本分工接近，父精修是其模式 |
| architect-loop，DanMcInerney | 裁决、检查、合并，只判断 | worktree、测试先行 | 更严格，可借判断 / 构建语言 |
| Cognition | 单写入真值，升级获取判断 | 干净上下文审查 / 建议 | 支持审查叶子，警惕多写者 |
| Aider Architect/Editor | 强模型推理改动 | 廉价模型应用 | 实现内可选微分工，非完整生命周期 |
| Anthropic | 拆分 / 综合 / 调节精力 | 并行专门工作 | 调研适合，编码保守串行写 |
| 编排者从不写代码文章 | 纯派发 / 验证 | 全部修改 | 当时拒绝绝对规则，只作默认倾向 |

预设覆盖叶子，父用用户选的会话模型；何时自做是技能策略，不是模型预设行。以后可另选强模型 parent-fixer 叶子，但当时未增加。

<a id="harness-adapter-surface-draft-not-implemented"></a>
### 宿主适配面（草案，未实现）

运行时询问：能否派带模型覆盖的可写代理？有哪些类型？模型身份是 provider/modelId 还是别名？能否限工具 / 只读？是否支持后台 / steer / resume？不硬编码 pi。

不能派生 + 覆盖模型时，降为顶层廉价会话或人工交接，不假装嵌套可用。

<a id="role-preset-skill-draft-scope"></a>
### 角色预设技能（范围草案）

暂名 `rope-harness-presets` / `rope-model-presets`。

输入为宿主身份（pi / claude-code / codex 等）、宿主配置 / CLI 中可用模型、可选成本 / 本地偏好 / 排除 provider。

输出（2026-07-16 用户偏好）：

1. **原生预设**写宿主普通目录，不另造模型库。pi 如 `~/.pi/agent/agents/` / `.pi/agents/`；Claude Code 如 `~/.claude/agents/` / `.claude/agents/`；其他按宿主。
2. **薄 Rope 清单**：角色 → 原生代理名、模型、generated_at、来源 / 置信度、过期提示，不复制整套提示 / 工具。

优于 Rope JSON 主存储的理由：派生用原生 `Agent({ subagent_type: "rope-implementer" })`；每次不用转换；各宿主已有模板；模型变化改原生配置，Rope 只刷新指针。

技能仍负责共享 implementer/reviewer/explore/verify-inspector schema、宿主写入适配、模型调研排序、清单更新与新鲜度。

当时已解：用户级目录、全局清单、只手动刷新、缺预设软降级、W2 先行、思考默认 / 覆盖、退役 verify settings；首个实现 pi，其他宿主占位。进一步确定技能名 `rope-harness-presets`，清单 `~/.config/rope/harness/<host>.json`，代理 `rope-implementer` / `rope-reviewer` / `rope-explore` / `rope-verify-inspector`，pi 用户 `rope-*.md`。

模板中等深度：角色契约、工具边界、返回格式，不嵌整份 go。离线 / 网络失败则本地启发式排序、confidence low，仍写预设，不硬失败。W2 可 shape，W1 后做。

16. **W1 人工升级停止：**当时确认同问题两轮修复失败，或父判断为设计 / 需求 / 契约缺陷，停止自动修，给简短准确说明并等决定，不无限静默第三轮。后续已改为无进展标准。

<a id="design-options-not-decided"></a>
## 设计选项（当时未决定）

<a id="option-a1--parent-spawns-full-rope-go-leaf-naive-single-window"></a>
### 选项 A1：父派完整 go 叶子（朴素单窗口）

```text
用户单窗口 / 强模型
  grill → shape → 提交包
  → 廉价模型完整 go 叶子
  → 父 rope-verify
```

优点是交互最简单；本宿主 go 无法嵌套审查，若不改职责会永久降级，不推荐原样使用。

<a id="option-a2--parent-owns-slice-loop-single-window-host-honest"></a>
### 选项 A2：父拥有切片循环（符合宿主能力的单窗口）

```text
用户单窗口 / 强模型
  grill → shape → 提交包
  → 每片派廉价可写实现者 → 确定性检查 → 可选只读审查叶子
  → 父 rope-verify
  → CHANGES_REQUESTED 时派修复叶子
```

优点：一个人工窗口，父有 Agent 可审，廉价模型承担实现，符合串行写 / 额外审查。代价：重写 go 归属，技能更复杂，中途授权 / 引导仍需策略。

<a id="option-a3--top-level-cheap-go-session-same-human-issue-room-ux"></a>
### 选项 A3：顶层廉价 go 会话，同一人工 issue 界面

shape 后打开 / 继续独立顶层廉价会话，可自动第二进程 / 窗口或人工切一次；其有 Agent 可审，计划会话之后 verify。优点是保留 go；代价是底层仍可能两会话，体验依赖启动器。

<a id="option-b--same-session-model-switch-no-subagent"></a>
### 选项 B：同会话切模型，不用子代理

```text
grill/shape 强模型 → /model cheap → go → /model strong → verify
```

机械最简单，但验证读自身实现噪声、破坏阶段隔离，通常质量较差。

<a id="option-c--artifact-dispatch-outside-chat-thrifty-dispatch-style"></a>
### 选项 C：聊天外产物派发（thrifty-dispatch 风格）

```text
shape 写包 → 确定性派发器运行廉价 go 会话 → 父只读清单并 verify
```

父上下文成本低、便宜；基础设施更多，中途交互弱，与当时纯技能 Rope 不自然。

<a id="option-d--hybrid-with-escape-hatch"></a>
### 选项 D：混合与回退出口

普通 issue 默认 A，巨大 / 长期 / 宿主受限时保留跨窗口 B。迁移务实，但要维护两模式；此处沿用当时选项字母称谓。

<a id="per-slice-review-keep-thin-or-drop"></a>
## 逐片审查：保留、精简还是删除

<a id="why-it-exists-today"></a>
### 当时为何存在

- 在后续切片依赖前抓高风险错误。
- 独立只读视角，不由实现者自检。
- ADR 证据表明实践已有静默降级。

<a id="reference-patterns"></a>
### 参考模式

| 模式 | 中途 | 结束 | 信任依据 |
| --- | --- | --- | --- |
| 当时 Rope | go 逐片审 | issue verify | 矩阵 + E2E + verify.md |
| thrifty | 检查绿通常无审 | 失败 / 判断项用强模型 | 独立重跑检查 |
| Depot `/orc` | 构建后多审查者 | 主综合 | 结构结论 |
| Anthropic 评价优化 | 达标准前循环 | 最终答案 | 明确量表 |
| Cognition 单线程 | 同上下文持续 | 人工 | 完整共享轨迹 |

<a id="candidate-policies-for-single-window-rope"></a>
### 单窗口 Rope 候选策略

1. **go 内原样保留：**迁移稳，成本 / 可行性依赖嵌套，仍需不同职责的 verify。
2. **精简：**高风险才 `Review: required`，默认测试 / 冒烟，强父最终 verify，接近 thrifty。
3. **删除，仅最终 verify：**中途最省，但问题晚发现，可能要求多片返工，与独立提交纪律有张力。

当时研究倾向，不是产品决策：不直接删除，优先精简 + 检查先行，保留 issue verify；宿主 / 预算允许再加只读审查。后续最终选择以 ADR 为准。

<a id="pros--cons-of-multi-window-human-handoff-vs-single-window-subagent-go"></a>
## 人工多窗口与单窗口子代理 Go 的利弊

<a id="multi-window-current-practiced"></a>
### 多窗口（当时实践）

优点：无需宿主特性就硬隔离模型 / 上下文，用户可看实现终端，写代码边界明确。
代价：复制 / 切换 / 重新同步占注意，交接易陈旧，易漏 verify / 修复状态，要照看两会话。

<a id="single-window-parent--go-subagent"></a>
### 单窗口父与 go 子代理

优点：一 issue 一个人工面，父保持计划 / 判断质量，自动交接，返回自然 verify，廉价模型承担实现。
代价：依赖子代理及模型路由真实性；长 go 可能阻塞，需后台引导；过程可见性较弱；授权 / 凭证 / UI 验证仍需路由；嵌套审查深度与成本需策略。

<a id="recommended-working-shape-research-recommendation-only"></a>
## 推荐形态（仅当时研究建议）

1. 保留 grill → shape → go → issue verify → finish。
2. issue 包 + git 为唯一必需交接。
3. 默认廉价隔离子代理执行 go。
4. 强父只读做 issue verify。
5. 精简逐片审，不直接删。
6. 宿主不支持则跨窗口。
7. 始终记实际模型、审查模式、review_degraded。
8. 验证看文件真值，不只散文。

这是计划 / 裁判下的分阶段单实现者，与 Anthropic、thrifty、Claude Code、Cognition 警告的交集。不能脱离前文 pi 不支持嵌套的限制直接套用。

<a id="open-questions"></a>
## 当时未决问题

- 痛点主要是切窗口、成本还是漏 verify？
- go 前台简单，还是后台释放父？
- 子代理保留中途人工授权，还是前移 shape / 父？
- 逐片审保留 / 精简 / 删除？
- CHANGES_REQUESTED 恢复同 go 还是全新修复叶子？
- 无可靠模型覆盖宿主需多大可移植性？
- ADR 0001 是否从窗口改角色语言，窗口只作部署形态？

<a id="sources"></a>
## 来源

- 本地 Rope ADR / CONTEXT / skills / README。
- https://www.anthropic.com/engineering/multi-agent-research-system
- https://www.anthropic.com/engineering/building-effective-agents
- https://code.claude.com/docs/en/sub-agents
- https://cognition.com/blog/dont-build-multi-agents
- https://agentpatterns.ai/agent-design/discrete-phase-separation/
- https://depot.dev/blog/context-isolation-in-coding-agent-loops
- https://ar5iv.labs.arxiv.org/html/2601.14914
- https://github.com/2389-research/thrifty
- https://www.langchain.com/blog/planning-agents
- pi 本地包文档与 `examples/extensions/subagent`。
