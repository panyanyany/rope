---
name: rope-quick
description: 适合一个全新上下文窗口内完成的小任务，包括已诊断修复和小功能。单人会话先做 grill-lite（事实自检及一轮决策），在最近边界 red→green / 测试先行，本地提交并同步 .rope 文档。用户按名称调用，或交入准备好的简报时使用，常在 worktree 中执行。
disable-model-invocation: true
---

<a id="rope-quick"></a>
# Rope Quick：小任务快速路径

单人会话完成能装进**一个全新上下文窗口**的小任务：已诊断修复或小功能。由同一个代理依次完成 grill-lite 澄清、测试与实现、本地提交，以及 `.rope/` 文档同步。不建完整 issue 包、不派叶子、不做 issue 级 verify；用户负责验收。

边界在于上下文容量，而非工作种类。需要并行切片、新架构决策或超出一窗口的上下文，就触发下方停止线，返回完整流程。

写入说明、简报或记录时，遵守[中文文档写作规则](../rope-grill/references/content-design.md)。

<a id="startup"></a>
## 启动

1. 输入为简报文件，如仓库 / worktree 根目录的 `*-BRIEFING.md`，或直接问题描述。简报是待核验线索，不是结论。
2. 加载 `.rope/GLOSSARY.md`（旧文档查找见[现行文档契约](../rope-clear/references/current-docs.md#project-language)）、`.rope/routes.md`、routes / 简报指向的 specs、adr、research，遵守 `AGENTS.md` / `CLAUDE.md`。
3. worktree 中链接的共享资源，如 `.env.local`、`node_modules`、虚拟环境，只读，不能修改。
4. 不另设入口门槛：用户声明 quick 即为入口决定。

<a id="grill-lite-direction"></a>
## Grill-lite（明确方向）

改代码前，依次执行以下步骤：

1. **事实自检：**打开指定文件，对照仓库核验简报关键事实及所述行为。简报只是线索；核验不符先告诉用户，之后才可改代码。
2. **一轮决策：**只询问会改变实施方向的决定。每题提供推荐答案、具体例子和代价，优先使用结构化提问。需要第二轮决策时，应检查是否已经超出 quick 范围。
3. **记录：**把已确认事实和问答（问题 → 所选答案）写入 `quick.md`，作为本会话需求对齐及下次会话首读输入。同时确认方向可触及的文件和层级范围。

<a id="stop-lines"></a>
## 停止线

出现以下任一情况时，停止快速路径并返回完整 grill/shape 流程：

1. 需要**新架构决策**；修改已有 ADR 可以，但处置需用户确认。
2. 同一修复失败两次。
3. 改动跨层扩散，超出已定范围。
4. schema、破坏性或生产操作。

触发停止条件后，停止修改代码。在 quick.md 中记录根因、证据和待定决定，并标记 `status: stopped`。说明需要进入完整流程，不得自行接受尚未确认的新决定。

<a id="fix-loop"></a>
## 修复循环

1. **修 bug 必须 red→green：**在最近边界写复现症状的失败测试，先运行聚焦命令确认 red。UI 按角色 / 可访问名称 / label，回退 `data-testid`，不依赖 CSS 或 DOM。**小功能测试先行：**先在最近边界写新行为测试再实现；全新行为可不强制 red，但测试与改动一起交付。
2. 最小改动到 green，再跑聚焦套件。纯配置 / 文档可附理由豁免 red；纯样式 UI（颜色、间距、布局，不改行为承诺）也可豁免，用截图或人工查看并说明理由。
3. 按仓库提交纪律提交；仓库使用 Conventional Commit 时遵守，提交保持在已定范围。

<a id="doc-sync-four-homes"></a>
## 文档同步（四处归属）

修改长期文字前读[现行文档契约](../rope-clear/references/current-docs.md)，修改当前归属文档，不追加矛盾。

逐个变更文件对照 `.rope/specs/`、`.rope/adr/`、`.rope/research/`、`.rope/GLOSSARY.md`：更新或明确说明跳过理由。被证伪的 research 结论在本会话修正，不推迟到 rope-summary。

<a id="record-and-closing-report"></a>
## 记录与收尾报告

1. 写 `.rope/issues/<slug>/quick.md`，约 30 行：问题、根因 / 功能要求、grill-lite 事实及问答、所选方向和用户决定、红绿命令 / 结果、文档更新或跳过理由、部署 / 通知等人工余项，及 `status: done | stopped`。
2. 收尾说明 diff 和提交、红绿证据、文档更新、人工余项。涉及认证 / 密钥 / schema / adapter 等风险边界时，必须有**风险焦点**：指出 diff 中至多三个最值得人工检查的具体位置和原因，不能泛泛说“请审查”。

<a id="guardrails"></a>
<a id="护栏"></a>
## 执行限制

- 单人会话，不派叶子 / 子代理，不依赖预设。
- bug 修复没有 red 证据或明确豁免，不能只声称测试通过。
- 人工授权要求不变：生产部署、破坏性操作、schema。
- 不在会话中途把 quick 升格为完整 issue；停止并交回。
