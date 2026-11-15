# 派发契约规则修订（dispatch contract）

## Problem Statement

最近三个真实 session 的审计（`.rope/research/grill-research-coverage-regression-audit.md`）显示：grill 不再主动派生调研（ADR 0016 精简误删派生指令，调研行为退化为"用户喊了才做"）；调研简报形状不被遵守导致 cheap explore 叶交白卷；go/E2E 期间父会话亲自写码（两 session 各压缩 6 次）；E2E runner 叶零有效证据（死于 429 后父自驱取证）；grill 决议隔四天才落盘；切片切超窗没被拦住。

## Solution

按四家成熟 harness 先例（`.rope/research/dispatch-precedents/`）修订 rope 的派发契约：调研门槛分级（涉新机制/外部集成/产品设计判断必派，纯内部记豁免）；简报即契约（父派调研必须写明输出契约，preset 按简报切换默认返回）；所有派生规则强调"必须派生、能并行就并行"；父会话在 go/E2E 不得自写产品码；grill 决议每轮实时落盘；切片默认收窄（fresh-window 是上限不是目标）；explore preset thinking 升 medium。

## Contract Note

- grill 遇新机制、外部平台集成或"成熟产品怎么做"类设计判断时，决策轮开始前必有两路调研简报派发（仓库先例 + 外部产品横评），纯内部小改动在票面记 `research: not-needed` + 一句理由。
- 每份调研简报写明研究问题、一手来源规则、输出路径与必备小节；explore 叶按简报声明返回（findings 简报 = 路径 + ≤300 字摘要 + 置信度），unknowns 必附试过什么。
- grill 每轮决议当轮写入 `.rope/`（票面/tickets），不再等全部问完；失败可见：Ready checklist 未过不得进 shape。
- shape 拒绝开写既无 research 引用也无 not-needed 记录的 PRD；切片以"独立可验证的最小行为"为单位，文件不重叠即并行。
- go/E2E 期间父会话不产出产品/测试代码——凡写码走叶子简报；E2E 旅程必须派 runner 叶且能并行则并行派。

## Goals

- 恢复并强化"先例先查"纪律（ponytail 阶梯），未验证的行业断言不得作为决议依据。
- cheap explore 多派生可用：简报质量决定返回质量，preset 契约消除模式歧义。
- 父会话上下文保持干净：实现与取证留在叶侧。

## Non-goals

- 不拆第四角色 preset（ADR 0011 维持三角色 + explore 兼 research）。
- 不设死叶/瞬态故障的机械重派协议，不设质量类恢复协议（用户裁定：靠父裁量 + 强调必须派生）。
- 不动修复轮上限计数、不设证据有效性作废规则。
- 不改 rope-e2e-runner 模型档位（保持 glm-5.3-flash）。
- 不做全局 skill 安装（~/.agents/skills 装载另行请示）。

## Public Interface / Behavior

- `skills/rope-grill/`（SKILL.md step 2、grilling.md、checklist）、`skills/rope-shape/`（SKILL.md、gates-and-vocab.md）、`skills/rope-go/`（SKILL.md、execution-rules.md）、`skills/rope-harness-presets/`（role-schema.md、ranking.md、agent-templates.md、explore-research-mode.md）的规则文本。
- 生成的本机 preset `~/.pi/agent/agents/rope-explore.md`（thinking: medium + 新输出契约）与 manifest。
- 新增 `.rope/adr/0017-dispatch-contract.md`；修订 ADR 0011 item 8 措辞；`.rope/CONTEXT.md` 增补术语。

## Testing Decisions

- Good test: 结构冒烟 + 真实安装路径 + preset 工件检查（本仓库为规则文本仓库，无应用测试面）。
- Seams under test: `node --test tests/*.test.mjs`（frontmatter/引用/CLI 安装）；`bin/rope.js` 安装产物内容；preset 文件 frontmatter 与正文。
- Prior art: tests/smoke.test.mjs 已覆盖 CLI 安装到临时目录的模式。
- Test scope: 仅本仓库；无外部依赖。
- Contract sweep: 本 issue 改写 explore-research-mode.md 的 mode 触发措辞（"the brief asks for a findings file"→ 简报即契约），全仓 grep "brief-selected"/"research mode" 迁移所有引用点（含 role-schema.md、agent-templates.md、ADR 0011 正文修订）。
- Broader-suite trigger: none（冒烟即全量）。
- Repo suite policy: fast-iteration（quick=full=冒烟）。

## Behavior Contract

- System under test: rope 工作流规则文本与 harness preset 生成物。
- Trigger/input: 父会话运行 grill（遇外部集成/新机制/产品设计判断）、shape（开写前兜底检查、切片）、go（派发、修码、E2E）。
- Collaborators: rope-explore/rope-implementer/rope-e2e-runner preset、`.rope/research/**`、issue 包。
- Observable result: Contract Note 五条全部可在下一个真实 session 中观察到。
- Failure visibility: Ready checklist 未过 → 不进 shape；shape 兜底拒绝无豁免 PRD；review Scanner 扫描规则文本一致性。
- Forbidden shortcuts: 只在 chat 里声称"调研过了"不落盘；把父自写改叫"简报修正"绕开派生；名义上收窄切片实际仍超窗；用未验证记忆断言替代调研。

## Architecture Impact

- Impact: required
- Trigger check: 修订工作流契约并部分改写 ADR 0011 item 8（研究模式触发措辞），新增 ADR 0017。
- Relevant decisions:
  - ID: D1
    Source: `.rope/adr/0011-edge-classification-and-acceptance-gates.md`
    Decision status: active
    Scope: 切片粒度硬规则（item 6）与研究模式（item 8）。
    Decision disposition: extend（item 8 措辞改为简报即契约并标注部分被 0017 取代；item 6 增收窄默认）
    Inherited invariants: 三核心角色不变；research 写入仅限 `.rope/research/**`；无第四 agent 名。
    Affected public interfaces: explore preset 正文与输出契约。
    Forbidden shortcuts: 以"新增角色"替代模式契约修订。
    Required evidence: 文本 diff + 冒烟 + preset 重生成产物。
    Applies to: issue
    Documentation update: updated-existing
    Unresolved conflicts: none
  - ID: D2
    Source: `.rope/adr/0015-agent-mode-e2e-acceptance-stage.md`
    Decision status: active
    Scope: E2E 旅程由 runner 叶驱动。
    Decision disposition: inherit（强调"必须派生+并行派"，不改机制）
    Required evidence: rope-go 文本 diff。
    Applies to: Slice 4
    Documentation update: no-new-decision
  - ID: D3
    Source: `.rope/adr/0016-single-execution-form-agent-dispatch.md`
    Decision status: active
    Scope: 单一执行形态（父 LLM 直接跑切片循环）。
    Decision disposition: inherit（0017 恢复调研地板但不重建 dynamic 机械；父不自写是 Parent Orchestrator 契约的重申）
    Required evidence: ADR 0017 说明与 0016 的关系。
    Applies to: Slice 5
    Documentation update: added-new
- New decision candidate: ADR 0017（本 issue 主体，风险低——文本规则，可逆；但满足"需上下文+真权衡"）。
- Constraint Bundle:
  - Decision sources: D1 (.rope/adr/0011)、D2 (.rope/adr/0015)、D3 (.rope/adr/0016)
  - Decision statuses: active ×3
  - Scope: issue-wide；S1 触 D1；S4 触 D2；S5 触 D1/D3
  - Invariants: research 写入仅限 `.rope/research/**`；三角色不变；quick tier 为冒烟；父纠偏=重写简报重派
  - Public seams: preset 文件、issue 包、规则文本
  - Forbidden shortcuts: 见 Behavior Contract
  - Acceptance evidence: 冒烟绿 + CLI 安装产物含新文本 + preset 工件 thinking: medium
  - Open conflicts: none

## References

- Research: `.rope/research/dispatch-precedents/superpowers.md`、`gsd-trellis.md`、`mattpocock-skills.md`、`.rope/research/ponytail-prior-art-ladder.md`、`.rope/research/grill-research-coverage-regression-audit.md`
- ADR: `.rope/adr/0011-edge-classification-and-acceptance-gates.md`、`0015-agent-mode-e2e-acceptance-stage.md`、`0016-single-execution-form-agent-dispatch.md`

## Open Questions / Human Gates

- Gate: 本机 preset 重生成（写 ~/.pi/agent/agents/rope-explore.md 与 manifest）
- Decision: approved（2026-09-29 用户在落地决策中确认"重生成只落本地"）
- Approved action: 重生成 rope-explore preset（thinking medium + 新正文），不触碰非 rope-* 文件。
- Scope: 用户级 pi agents 目录 + ~/.config/rope/harness/pi.json。
- Risk: 覆盖用户本机 preset（幂等覆写是既有机制）。
- Pass criteria: preset frontmatter thinking: medium，正文含新输出契约。
- Failure report: partial_write 路径清单。
- Forbidden out-of-scope actions: 全局 skill 安装（~/.agents/skills）——完成后单独请示。

## Gate Decisions

- Gate: 本机 preset 重生成
- Decision: approved（见 Open Questions，同一条）
- Approved action: 同上
- Scope: 同上
- Risk: 同上
- Pass criteria: 同上
- Failure report: 同上
- Forbidden out-of-scope actions: 同上
