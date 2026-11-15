---
name: rope-grill
description: 对照 .rope 文档追问需求，形成可交给 shape 的契约，明确行为、架构影响和决策处置。用于切片前澄清功能，或讨论 ADR/spec 的继承方式。
---

<a id="rope-grill"></a>
# Rope Grill：需求澄清

用通俗语言访谈需求。内部由以判断为主、**保护上下文**的父编排器负责；与用户交流时使用简单的产品语言。

访谈方法（事实与决策、前沿轮次、场景、检查清单）：[访谈指南](references/grilling.md)。
文档格式：[文档格式](references/doc-formats.md)。
架构连续性的字段与处置方式：[架构连续性](../rope-shape/references/architecture-continuity.md)。

<a id="plain-interview"></a>
## 通俗访谈

Rope 内部术语用于推理，不直接当作用户语言。开口前先转换：把 Behavior Contract 说成“必须保证什么行为”，把 failure visibility 说成“用户在哪里看到错误”，把 forbidden shortcut 说成“哪种偷懒实现虽然能过测试，却违背需求”。

每个决策问题都包含四部分：一个通俗问题、推荐答案、用户会点击 / 运行 / 看到 / 收到什么的具体例子，以及另一个选项的代价。完成标准：用户无需追问 Rope 术语，就能用自己的话复述决定。若用户困惑，暂停推进，用真实场景重新解释。

所有带选项的问题都必须列出编号。用户只回复数字即可选中对应项；继续前复述选中的选项。

<a id="inputs"></a>
## 输入

读取已有的 `.rope/GLOSSARY.md`、`routes.md`、相关 `adr/`、`research/`、`specs/`，以及 routes 指向的代码。旧术语表按[现行文档契约](../rope-clear/references/current-docs.md#project-language)查找。

<a id="context-protective-parent"></a>
## 保护父编排器上下文

1. 搜索和诊断默认按[交接契约](../rope-harness-presets/references/role-schema.md#exploration-and-validation-handoff)交给 explore；独立查询并行派发。探索只推迟依赖其结果的问题，不暂停整轮。每份调研简报都声明输出契约（问题 / 来源 / 路径 / 返回格式，见 explore-research-mode.md）。
2. 已确认决策立即写入 `.rope/`，避免上下文压缩后丢失。
3. 读取叶子摘要和产物路径，不加载完整执行轨迹。
4. 禁止要求叶子再派生叶子。

<a id="workflow"></a>
## 工作流程

1. 复述目标和疑似歧义。
2. 提问前先解决**事实**（代码 / 文档 / 库），不要把可查证的事实变成用户问答题（见 grilling.md）。**调研底线：**涉及新机制、外部平台 / 服务集成，或“成熟产品如何解决”这类设计判断时，必须在决策轮次前派发调研，通常并行两份简报（仓库先例 + 外部产品调查）。推荐实现前，把结论用于复用 / 改造 / 自建比较。纯内部小改动则在 issue/PRD 记录 `research: not-needed` 及一句原因。
3. 执行**领域语言纪律**：检查术语表、模糊用词、与代码的矛盾。
4. 明确 **Behavior Contract** 的六个字段（见 grilling.md）。
5. 按条件检查架构影响：定向查阅术语表、routes、接口边界和相关 ADR/spec；记录 `required`，或以轻量触发项检查说明 `not-applicable`。存在触发项时，必须在 shape 前确定每项决策的处置方式。
6. 按**前沿轮次**提出**产品 / 设计优先**的问题（见 grilling.md）：前置条件已明确的决策放在同一编号轮次；依赖尚未收到的答案的决策留到后续轮次。每轮结束后重新计算前沿。
7. 批量问题和选项优先使用宿主的结构化提问工具；不可用时改用同样的纯文本问题，不因此阻塞。
8. 持续推进：回答岔题、复述直到确认，再进入下一个未被阻塞的问题；除非用户暂停，不等待“继续”。
9. 用场景检验：主路径、失败可见性、禁止的捷径。
10. 每轮已确认决策都在**当轮**沉淀到 `.rope/`（术语表 / ADR / research / specs）。上下文压缩会丢失聊天；一轮结束时已确认决策仍只存在聊天中即属违规，不得攒到访谈结束再写。
11. **共同理解确认点：**用 3–6 点回顾，用户确认后才能 shape。未确认前不得写 issue 包（用户已说“直接 shape”除外）。shape 随后将回顾投影为 PRD 的 Contract Note。确认后、写 issue / shape / go 产物前，用编号询问分流：
    1. 完整流程：写 issue → shape → go（推荐）。
    2. 直接 quick：小任务走 `rope-quick`，跳过 issue 和 shape。
    说明每条路径的结果与代价。回复 `1` 进入完整流程；回复 `2` 则把已确认回顾和决策交给 `rope-quick`，由其 grill-lite 记入 `quick.md`；超出范围时由停止线转回完整流程。该路径不创建完整 issue 包。
12. **完成条件：**grilling.md 的就绪清单全部满足，且用户确认；否则列出阻塞项。
13. 默认同一会话交给 shape；只有用户切换会话时才准备跨窗口粘贴内容。同会话 shape：先给摘要，提交前取得确认。

<a id="guardrails"></a>
## 护栏

- 不写功能实现代码；第 11 步确认前不创建 issue 包。
- 选项必须编号，单独的选项数字就是有效答案。
- 不把可回答的不确定性留作“实现分支”。
- 产品决策不能只留在聊天中，必须写入 `.rope/`。
- schema、依赖、认证、部署、破坏性文件系统 / git 操作、生产 / 共享环境变更须经人工确认。
