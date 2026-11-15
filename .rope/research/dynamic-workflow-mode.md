<a id="dynamic-workflow-mode-parallel-multi-writer-opt-in"></a>
# 动态工作流模式（并行多写者，显式开启）

历史 grill 研究：本模式后续已演进并随动态内核退役；下文保留当时证据、确认选择和未决问题，不是当前操作规则。

<a id="question"></a>
## 问题

Rope 能否增加**手动切换的动态工作流模式**：开启后先按契约与不相交文件归属切片，再用廉价子代理并行实现，最后轻集成接线？如何与单窗口、禁止嵌套派生、Cognition 警告相容？

<a id="verified-facts"></a>
## 已核验事实

### external-harness-parallel-slices

Fact: 研究当时将“先冻结共享契约 → 不相交文件片 → 每代理隔离 worktree → 并行 → 合并审查”归为 2026 代理 CLI 常见模式，见 Claude Code、Cursor 3、Roo Code、Cline、OpenHands、Codex、编排工具。

- Claude Code：`Workflow` 的 `parallel()` / `pipeline()` / `agent()`，共享任务表 / 邮箱的 Agent Teams，`--worktree`。限制：当时 Agent Teams 全员同模型 Opus 4.6，角色选模型只是社区需求。
- Cursor 3：内置 `/worktree`，最多 8 隔离并行代理。
- Roo Code：Orchestrator/Boomerang、逐模式 Sticky Models、`file_access` 读写 glob，接近廉价写者 / 角色模型 / 文件归属组合。2026 年中停服传闻未核验，不能当事实。
- Cline：只读并行子代理及 Web 看板，隔离 worktree、自动提交。
- OpenHands：服务式派发、并行重构。
- Codex：云沙箱并行任务，任务间不协调，是并发而非编排。

Source: 2026-08 网络研究，多个供应方摘要。
Verified by: 网络搜索综合。
Stability: medium，产品变化快。
Implication: 当时研究认为不相交片并行有外部支持，不属纯实验；证据强度仍限于上述摘要。

### dedicated-slice-planner-tools

Fact: 有专门在执行前按不相交文件边界切任务的工具：

- **batuta-mcp：**将想法拆为 2–5 个 `fileBoundaries` 不重叠计划，自动纠正一次，逐计划建 worktree 和可粘贴提示。
- **parallel-implementation 技能：**要求各片输入 / 输出独立，共文件、数据结构或运行中共享状态则合并 / 串行。
- **Claim Plane：**arXiv 2607.21909，正式化写前准入；声明版本化 ChangeIntents，同文件仅声明过的不相交区域可并行，歧义时拒绝。

Source: 2026-08 网络研究。
Verified by: 搜索综合。
Stability: medium。
Implication: 当时以文件不相交为安全护栏，类比 shape 已有 Blocked by / Scope / 前沿，并计划在动态模式强制。后续 worktree 边分类已演进，以现行规则为准。

### per-role-model-support-varies

Fact: 各并行写者分配不同廉价模型的支持不均：Roo 原生逐模式；multi-agent-orchestrator-skill 可用 CLI 模板固定；当时 Claude Code Agent Teams 不支持。pi / Rope 由角色模板 `rope-implementer` / `rope-reviewer` / `rope-explore` / 当时的 `rope-verify-inspector` 路由，父可逐派覆盖；现场全部配 `deepseek-v4-flash`。
Source: 2026-08 网络与本地 harness-presets。
Verified by: 搜索与仓库阅读。
Stability: medium。
Implication: 用户决定复用已有预设，不加模型机制或强模型要求。

### anthropic-cognition-warning-still-holds

Fact: Cognition 警告多写者上下文不完整共享、动作隐含决策而分歧；Anthropic 指广度调研更适合多代理，编码实时协调较弱。原研究将独立验证、3–5 人与显式共享接口契约作为保守指导；其中人数表述属于历史研究推断，不能替代后续关于“无通用最佳数量”的核验。
Source: Cognition “Don't Build Multi-Agents”、Anthropic 工程文章，另见 `single-window-go-orchestration.md`。
Verified by: 先前研究与网络。
Stability: high。
Implication: 不无条件并行；当时安全方案为契约先串行、不相交归属、逐片验证、保留 review/verify，共核心文件仍串行。

### relation-to-existing-single-window-research

Fact: `single-window-go-orchestration.md` 已确认方向 3 禁止嵌套派生、方向 13 W1 父编排器，以及计划 / 裁判下分阶段单实现者的推荐形态。动态模式是 W1 上显式开启的变体：不相交范围可并行实现，父仍唯一编排，拥有 review/verify。
Source: `.rope/research/single-window-go-orchestration.md`。
Verified by: 仓库阅读。
Stability: high。
Implication: 保留父唯一派生、叶子不派叶子、issue verify 父负责且只读、逐片审查由父派而非实现者自定。这是当时方案，不恢复已移除的逐片审查。

### pi-dynamic-workflows-extension

Fact: 原型 `pi-dynamic-workflows` 注册 `workflow` 工具，在 Node vm 沙箱以 `agent()` / `parallel()` / `pipeline()` 派内存 Pi 会话；无 worktree 隔离、并发上限、批准节点、重试 / 失败策略、持久化，明确标原型。
Source: 2026-08 仓库抓取。
Verified by: 内容抓取。
Stability: low。
Implication: 用户决定不作切片引擎，缺隔离且不适合 Rope 审查 / 提交 / 验证；仍可手动用于只读调研、多视角审查、前端原型候选，无需改 Rope。

<a id="crystallized-decisions-grill-current-session"></a>
## 当时 grill 已确认决策

以下为当时用户产品决策，尚未 shape：

1. **改 Rope：**替代此前零改动、手动用原型的选择，增加手动动态模式；手动只读派发仍允许且不需 Rope 改动。
2. **shape 开始问手动开关：**是则强制三件套、写 `mode: dynamic`，go 读字段派不相交片；否则常规串行与可选前沿并行。mode 是持久包字段，不只聊天备注。
3. **shape 三件套：**首片串行契约，仅接口 / 数据结构 / 调用边界；实现按不相交文件归属切，共核心文件属 shape 缺陷；逐片大小上限，避免 7,000 行大包。
4. **go 保留检查：**廉价实现者并行不相交片，每片审查；轻串行集成片接线验契约；issue verify 父负责只读，保留 ADR 0001 实现 / 验收分离。
5. **复用模型预设：**不加模型机制 / 强模型要求，当时均 `deepseek-v4-flash`，父按风险可覆盖。
6. **不嵌套：**父唯一派生，叶子不派叶子，符合方向 3 与 pi-subagents 限制。
7. **架构影响 required：**触及 shape、go / execution-rules、harness-presets（可能无 schema 改动）、单窗口研究 W1，以及 CONTEXT 新术语，可能写并行编排 ADR。

<a id="open-questions-for-shape"></a>
## 当时留给 shape 的问题

- 逐片大小上限的行数 / 文件数，硬规则还是审查警告。
- 契约片是否必须过类型 / schema 等确定性检查才并行。
- mode 位于 prd frontmatter 还是 tasks，准确 schema。
- 集成片单独审查还是合入 issue verify。
- 逐片审查保留强模型，还是确定性检查 + 廉价审查；当时延期，默认保留。

<a id="sources"></a>
## 来源

- 2026-08 外部宿主研究：Claude Code Workflow/Agent Teams/worktree、Cursor 3、Roo Code、Cline、OpenHands、Codex、batuta-mcp、parallel-implementation、Claim Plane、multi-agent-orchestrator-skill。
- Cognition “Don't Build Multi-Agents”；Anthropic 工程文章。
- pi-dynamic-workflows 仓库抓取。
- 本地 `.rope/CONTEXT.md`、`.rope/adr/0001`、`.rope/research/single-window-go-orchestration.md`、`skills/rope-go`、`skills/rope-shape`、`skills/rope-harness-presets`。
