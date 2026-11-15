<a id="upstream-inspiration-sources"></a>
# 上游灵感来源

<a id="question"></a>
## 问题

当前哪些外部项目启发了 Rope 工作流？为未来需人工把关的采收技能，核实其仓库与许可证事实。

<a id="verified-facts"></a>
## 已核验事实

### mattpocock/skills

Fact: Matt Pocock 代理技能的主要公开来源是 `https://github.com/mattpocock/skills`（MIT）。本机常用 `npx skills add mattpocock/skills` 安装到 `~/.agents/skills` 等代理技能目录。本机已安装不少相关技能，如 `grill-me`、`grill-with-docs`、`setup-matt-pocock-skills`、`tdd`、`to-prd`、`to-issues`、`triage`。
Source: GitHub 仓库 README / skills.sh 列表；本机 `~/.agents/skills` 列表。
Verified by: 网络搜索 + 本地文件列表。
Stability: medium（仓库布局和技能集合会变化）。
Implication: 适合作为技能 / 工作流 / 参考资料采收的首个固定来源。比较单位是技能目录及其 `SKILL.md` / 引用资料，不是 Rope 产品 API。

### mindfold-ai/Trellis

Fact: Trellis 是团队级代理宿主框架，仓库内 `.trellis/` 保存规范、任务、调研等知识与流程。公开仓库为 `https://github.com/mindfold-ai/trellis`，许可证为 **AGPL-3.0**。
Source: GitHub 仓库元数据；docs.trytrellis.app 架构说明。
Verified by: 网络搜索。
Stability: medium。
Implication: 可作为 Rope `.rope/` **工作流和布局的灵感**。AGPL 使直接纳入 / 复制代码、将 Trellis 文件作为产品分发存在风险；采收优先提取思路并用 Rope 原生形式重写，不同步文件。将其视为次要且需谨慎处理的来源。

<a id="one-time-bridge-in-rope-retired"></a>
### Rope 的一次性迁移桥（已退役）

Fact: `skills/rope-migrate-docs` 曾将 Matt 风格文档及 Trellis `.trellis/` 布局映射到 `.rope/`，保留原文件。该技能因不再需要而于 2026-08 移除；当前布局为 `.rope/`，迁移按项目处理，不再分发专用技能。
Source: git 历史；`README.md`。
Verified by: 仓库阅读。
Stability: high。
Implication: 不重新引入分发的迁移桥；持续采收仍是本仓独立的维护事务。

<a id="assumptions"></a>
## 假设

- 此处“同步”指经人工把关、转换为 Rope 语义的思路 / 参考资料采收（R1），不是把上游技能文件机械合并进 `skills/rope-*`。

<a id="decisions-grill"></a>
## 已确认决策（grill）

- **R1**：采收运行产出人工审查简报，不自动合并到产品技能。
- **U1**：v1 只固定 `https://github.com/mattpocock/skills`。Trellis 仅为历史灵感 / 一次性迁移来源，不持续固定，其日常使用较少。
- **S1**：固定机制为本机上游克隆，加本仓提交的上次已审 SHA / 审查产物。不使用 git 子模块；上游不是 Rope 运行时或包依赖。
- **L1**：仓库内采收状态位于 `.rope/upstream/mattpocock-skills/{source.md,correspondence.md,reviews/}`；本机默认克隆路径为 `~/.cache/rope-upstream/mattpocock-skills`。
- **C1**：默认只扫描对应表中的 high 项（grill*、to-prd、to-issues、setup-matt-pocock-skills、tdd）；triage/prototype 为 `watch`，见 `.rope/upstream/mattpocock-skills/correspondence.md`。
- **A1**：采收技能止于审查简报、人工标记及推进 `last-reviewed-sha`，不自行改 `skills/rope-*`。吸收变化是人工接受后的**独立编辑，通常很轻量**，可在同一或后续会话说“把简报第 2 项应用到 rope-grill”。只有大的工作流语义变化才走完整 rope-grill/shape，普通上游小改不必如此。
- **B1**：首次运行先建立基线，固定当前上游 SHA。简报必须用**中文**；没有先前审查时，逐技能与**本地 Rope 目标**比较，不能只列 SHA 和名称。增量运行与上次已审 SHA 比较。可给建议标记，仍不自动改产品技能。
- **N1**：维护技能路径 / 名称为 `.agents/skills/upstream-harvest/`，不放产品 `skills/`，不以 `rope-*` 命名。
- **质量要求**：按 Matt 的 `write-a-skill` + `writing-great-skills` 写作规范编写 `upstream-harvest`：渐进披露、可核查完成标准、精简描述与正文、控制范围。这些是写作标准，不是采收扫描目标，在对应表中仍为 `out`。
- **I1**：`upstream-harvest` 由**用户显式调用**（`disable-model-invocation: true`）；维护者输入技能名，代理不得在其他工作中自动触发。
- **关闭门槛**：仅在人明确关闭本批审查后推进 `last-reviewed-sha`。放弃或部分审查保持 SHA 不变，草稿简报可留在 `reviews/`。

<a id="open-questions"></a>
## 未决问题

- 没有阻塞 v1 shape 的问题；简报模板和可选辅助脚本属于 issue 包实现细节。
