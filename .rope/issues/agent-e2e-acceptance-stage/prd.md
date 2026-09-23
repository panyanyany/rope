# Agent 模式 E2E 验收阶段：独立角色、共享测试栈、必需旅程门

## Problem Statement

Agent 模式完整 issue 的真实入口验收现状不可靠：ADR 0010 把"启动产品、走
Matrix、跑 e2e"全部压在 Behavior reviewer 一个叶子上，reviewer 兼做代码
审查与产品操作。近一周 agent-workbench 实测（见
`.rope/research/e2e-real-sessions-2026-09.md`）：验收执行者漂移（主窗口 /
reviewer / quick 内联 / headless 注入各不相同）；`/clear` 修复以
headless submitter 注入记 E2E PASS，从未经过真实钉钉入口；legal-finance
的 E4 real Admin probe 被 readiness 阻塞后 issue 照常结束。代码绿与审查
通过都不能证明真实用户入口可用。

## Solution

为 agent 模式完整 issue 增加**独立 E2E 验收阶段**：两轴代码审查通过后，
父窗口启动**一套**项目声明的测试栈并确认就绪，派多个**只读 E2E runner
叶子**各走一条真实用户旅程（互不争用并行，共享账号/可变状态串行）；
`e2e.md` 所有必需旅程拿到成功证据（`agent_passed`/`user_confirmed`）才
通过，否则阻塞交付，只有用户对该项明确豁免才可带"未验证"结案。E2E
缺陷走有界修复：合入后代码增量复审、栈更新到新提交、重跑受影响旅程
与共享入口检查。

落地位置（2026-09-23 用户纠正后）：整合进 rope-go 的 execution-rules
（E2E Acceptance Stage 段）与 SKILL.md Final review 流，不另做独立
skill；harness-presets 新增 `rope-e2e-runner` 第四角色
（role-schema/agent-templates/manifest-schema）并同步收窄
rope-reviewer 为 code-only；ADR 0015/CONTEXT/routes 同步。

## Contract Note

- 完整 issue（agent 模式）在代码审查通过后，`e2e.md` 每个必需旅程都由独立 E2E runner 在真实用户入口执行并留证，才能进入 verify。
- 真实入口与测试栈由项目声明（routes / issue Testing Decisions）；Rope 不写死浏览器或钉钉；内部注入只算集成证据，不冒充真实入口。
- 父窗口独占测试栈生命周期：一套共享栈、就绪探测、结束回收；runner 叶子互不争用并行，共享账号或可变状态的旅程串行。
- 必需旅程失败或环境不可用即阻塞交付；只有用户对该项明确豁免才可带着"未验证"状态结案，记录永不伪装成通过。
- E2E 缺陷修复合入后：代码增量复审、栈更新到新提交、重跑受影响旅程与共享入口检查；旧证据标注其对应提交。

## Goals

- agent 模式完整 issue 的验收与代码审查分离：reviewer 只审代码，E2E runner 只执行验收。
- 父窗口共享一栈 + 并行 runner 叶子的调度、证据、豁免、修复回环规则成文于 rope-go execution-rules。
- harness-presets 定义 `rope-e2e-runner` 角色并收窄 rope-reviewer 为 code-only。

## Non-goals

- 不改 `rope-quick`（quick 的真实入口要求后续单独决定）。
- 不改 dynamic workflow / kernel（已定全量退役，仅作历史背景）。
- 不改 rope-verify / rope-finish 规则（2026-09-23 用户裁定：交付门在 go；verify 只做文书与漂移检查；仅修一处过时引用）。
- 不自动安装全局（skill/preset 安装需用户确认，仓库 AGENTS 约定）。

## Public Interface / Behavior

- `.rope/adr/0015-agent-mode-e2e-acceptance-stage.md`：阶段顺序、角色分工、栈所有权、豁免与修复回环的权威决策。
- `skills/rope-go/references/execution-rules.md`：E2E Acceptance Stage 段 + E2E 状态门收紧 + Handoff Checklist 前置。
- `skills/rope-go/SKILL.md`：Final review 步骤 1（reviewer code-only）与新增步骤 4（E2E 阶段）。
- `skills/rope-harness-presets/references/role-schema.md` + `agent-templates.md` + `manifest-schema.md`：`runner`/`rope-e2e-runner` 第四角色；reviewer 职责收窄。
- `.rope/CONTEXT.md`：`End-of-Issue Review` 词条改为代码两轴；新增 `E2E Runner` 词条；`Real-Environment Walk` 标注 dynamic 专属。
- `.rope/routes.md`：E2E 阶段路由（指向 ADR + execution-rules + role-schema）。

## Testing Decisions

- Good test: observe external behavior at agreed seams — not implementation details
- Seams under test: 文档/技能文件的静态结构（frontmatter、行数上限、词条存在与互指）；无代码 seam。
- Test scope: `node --test tests/*.test.mjs` 回归（本轮触及 `skills/` 文档树）；契约文本用 file-inspect + 交叉引用核对。
- Broader-suite trigger: none（纯文档 + 本地 skill 草稿）。
- Repo suite policy: fast-iteration（routes 声明）。

## Behavior Contract

- System under test: agent 模式完整 issue 的 E2E 验收阶段契约（ADR 0015 + CONTEXT 词条 + rope-e2e skill 文本）
- Trigger/input: 两轴代码审查 approve 且 `e2e.md` 存在待验收项；或用户/父窗口调用 rope-e2e
- Collaborators: rope-go 父窗口、`e2e.md`、routes 的项目声明、宿主 Agent 派发、browser/CLI/API 工具面
- Observable result: `e2e.md` 每项到达终态并附 runner 证据（命令/工具/工件路径 + 提交范围）；父窗口记录栈启动/就绪/回收；未全绿不进 verify
- Failure visibility: `agent_failed`/`blocked_on_*` 带失败报告；两轮修复后 Human Escalation Stop；豁免记录点名用户决定
- Forbidden shortcuts: implementer 给自己的实现签验收；内部注入记成真实入口通过；reviewer 串行重跑全部旅程；父窗口凭空发明项目入口；blocked 项被静默吸收为完成

## Architecture Impact

- Impact: required
- Trigger check: 改变现有 ADR 0007/0010 的 review+E2E 职责边界（运行时角色契约）；新增 E2E Runner 角色；issue 生命周期阶段顺序变化。
- Relevant decisions:
  - ID: D1
    Source: `.rope/adr/0010-parallel-two-leaf-end-of-issue-review.md`
    Decision status: active
    Scope: 末尾审查两叶并行、仅 reviewer 可启动产品、机械聚合、delta 复审
    Decision disposition: supersede（部分）：规则 2"只有 Behavior reviewer 可启动产品/跑 e2e"在 agent 模式由 ADR 0015 取代——reviewer 只审代码，E2E 阶段由 runner 叶子执行；规则 1/3/4/5（两叶并行、机械聚合、binary 严重度、delta 复审）原样继承
    Inherited invariants:
      - 一个审查 gate、机械聚合、父窗口不重排
      - blocking|note 二值；fix ≤2 轮后 Human Escalation Stop
      - delta-only 复审
    Affected public interfaces: skills/rope-go 最终审查段（后续轮）、rope-reviewer preset 职责描述（后续轮）
    Forbidden shortcuts: 借 ADR 0015 恢复 per-slice 审查或第二 gate
    Required evidence: ADR 0015 文本明确取代范围；CONTEXT 词条一致
    Applies to: issue | Slice 1
    Documentation update: pending-finish
    Unresolved conflicts: none
  - ID: D2
    Source: `.rope/adr/0007-graph-driven-go-single-review.md`
    Decision status: active（0010 细化其审查机制）
    Scope: 单末尾 gate、真实入口 probe 归入 reviewer
    Decision disposition: extend：单 gate 不变；agent 模式下"真实入口 probe"从 reviewer 移到其后独立的 E2E 阶段（review→E2E→verify 顺序）；dynamic 模式语义不动
    Inherited invariants:
      - 一个末尾审查 gate、new eyes、真实入口必被走到
      - verify 是薄文书 gate
    Affected public interfaces: go→verify 交接前置条件（E2E 阶段插入）
    Forbidden shortcuts: 把 E2E 阶段折叠回审查 gate 内
    Required evidence: ADR 0015 顺序条款；CONTEXT `End-of-Issue Review`/`E2E Runner` 词条
    Applies to: issue | Slice 1
    Documentation update: pending-finish
    Unresolved conflicts: none
  - ID: D3
    Source: `.rope/CONTEXT.md`（词条：End-of-Issue Review、Standards Scanner、Real-Environment Walk）
    Decision status: active
    Scope: 三词条当前把产品运行/e2e 绑在 reviewer 上
    Decision disposition: extend：End-of-Issue Review 收窄为代码两轴（agent 模式）；新增 E2E Runner 词条；Real-Environment Walk 标注 dynamic 专属不受本轮影响
    Inherited invariants: 词条单作者、避免同义漂移
    Affected public interfaces: CONTEXT 词汇表
    Forbidden shortcuts: 新旧词条并存互相矛盾
    Required evidence: 词条 diff 互指一致
    Applies to: Slice 1
    Documentation update: pending-finish
    Unresolved conflicts: none
  - ID: D4
    Source: `.rope/adr/0006-quick-fix-path.md`
    Decision status: active
    Scope: quick 单会话轻路径
    Decision disposition: not-applicable（明确不改 quick）
    Inherited invariants: —
    Affected public interfaces: none
    Forbidden shortcuts: —
    Required evidence: PRD Non-goals 记录
    Applies to: issue
    Documentation update: no-new-decision
    Unresolved conflicts: none
  - ID: D5
    Source: `.rope/adr/0014-workflow-execution-mode.md`
    Decision status: active
    Scope: dynamic/kernel 执行形态
    Decision disposition: not-applicable（dynamic 全量退役中，本轮不触）
    Inherited invariants: —
    Affected public interfaces: none
    Forbidden shortcuts: —
    Required evidence: PRD Non-goals 记录
    Applies to: issue
    Documentation update: no-new-decision
    Unresolved conflicts: none
- New decision candidate: ADR 0015 本身即本 issue 交付物（风险已由用户在需求确认中逐点拍板：角色分离、阻塞交付、共享一栈、项目声明入口、豁免边界、修复回环）。
- Constraint Bundle:
  - Decision sources: D1 `.rope/adr/0010-…`, D2 `.rope/adr/0007-…`, D3 `.rope/CONTEXT.md`
  - Decision statuses: active / active / active
  - Scope: issue 级（两切片共享）
  - Invariants: 单审查 gate；E2E 全必需项过或明确豁免；父窗口独占派发与栈；runner 只读不修码；no nested spawn
  - Public seams: ADR 0015 文本；CONTEXT 词条；`.agents/skills/rope-e2e/` skill
  - Forbidden shortcuts: 见 Behavior Contract
  - Acceptance evidence: file-inspect（词条/路由/skill 结构）+ 用户 judgment（skill 草稿确认）
  - Open conflicts: none

## References

- Research: `.rope/research/e2e-real-sessions-2026-09.md`（近一周真实会话抽样与角色漂移证据）
- Research: `.rope/research/matt-upstream-e2e-2026-09.md`（上游无独立 E2E 角色/共享栈先例；本设计为 Rope 自有决策）
- ADR: `.rope/adr/0007-graph-driven-go-single-review.md`
- ADR: `.rope/adr/0010-parallel-two-leaf-end-of-issue-review.md`
- Spec: `skills/rope-go/references/execution-rules.md`（现行 reviewer/E2E 执行规则，后续轮改）

## Open Questions / Human Gates

- none（四项边界 + 豁免 + 入口定义已由用户 2026-09-23 确认；skill 全局安装另轮请求确认）

## Gate Decisions

- Gate: 全局 skill/preset 安装
- Decision: passed（2026-09-23 用户下令提交+安装；已执行）
- Scope: `~/.agents/skills/`、`~/.pi/agent/agents/`、`~/.config/rope/harness/pi.json`
- Risk: 未经确认改全局违反仓库 AGENTS 约定
- Pass criteria: 用户对整合结果点头（已达成：E2 user_confirmed）
- Failure report: 无
- Forbidden Out-of-Scope Actions: 直接写全局目录（已解除，用户授权）
