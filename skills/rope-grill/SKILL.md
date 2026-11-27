---
name: rope-grill
description: 对照 .rope 文档追问需求，形成可交给 shape 的契约，明确行为、架构影响和决策处置。用于切片前澄清功能，或讨论 ADR/spec 的继承方式。
---

<a id="rope-grill"></a>
# Rope Grill：需求澄清

澄清用户需要的行为，记录已确认决定，并形成可交给 shape 的契约。父编排器负责判断和交接；与用户交流时，使用具体的产品语言。

按需读取以下参考文档：

- [访谈指南](references/grilling.md)：区分事实与决策，组织问题轮次，检查就绪条件。
- [文档格式](references/doc-formats.md)：选择决定和事实的保存位置。
- [中文文档写作规则](references/content-design.md)：组织信息，明确动作，保持术语和协议一致。
- [架构连续性](../rope-shape/references/architecture-continuity.md)：记录架构影响及决定的处置方式。

<a id="plain-interview"></a>
## 通俗访谈

Rope 内部术语用于推理，不直接当作用户语言。开口前先转换：把 Behavior Contract 说成“必须保证什么行为”，把 failure visibility 说成“用户在哪里看到错误”，把 forbidden shortcut 说成“哪种偷懒实现虽然能过测试，却违背需求”。

每个决策问题都包含四部分：一个通俗问题、推荐答案、说明用户会执行什么操作、看到或收到什么的具体例子，以及另一个选项的代价。完成标准：用户无需追问 Rope 术语，就能用自己的话复述决定。若用户困惑，暂停推进，用真实场景重新解释。

所有带选项的问题都必须列出编号。用户只回复数字即可选中对应项；继续前复述选中的选项。

<a id="inputs"></a>
## 输入

读取已有的 `.rope/GLOSSARY.md`、`routes.md`、相关 `adr/`、`research/`、`specs/`，以及 routes 指向的代码。旧术语表按[现行文档契约](../rope-clear/references/current-docs.md#project-language)查找。

<a id="context-protective-parent"></a>
## 保护父编排器上下文

1. 父编排器默认按[交接契约](../rope-harness-presets/references/role-schema.md#exploration-and-validation-handoff)将搜索和诊断交给 explore 叶子工作者。独立查询并行派发。等待探索结果时，只推迟依赖该结果的问题，其余问题继续。每份调研简报必须声明问题、来源、输出路径和返回格式，见[探索调研模式](../rope-harness-presets/references/explore-research-mode.md)。
2. 已确认决策立即写入 `.rope/`，避免上下文压缩后丢失。
3. 读取叶子摘要和产物路径，不加载完整执行轨迹。
4. 禁止要求叶子再派生叶子。

<a id="workflow"></a>
## 工作流程

1. 复述目标，并指出可能存在歧义的地方。
2. 提问前，先核验代码、文档和库能够回答的事实。不要让用户回答可查证的问题。涉及新机制、外部平台或服务集成，或需要判断成熟产品做法时，必须在决策轮次前派发调研。通常并行调查仓库先例和外部产品。推荐实现方案前，用调研结论比较复用、改造和自建。纯内部小改动可以不做外部调研，但必须在 issue 或 PRD 中记录 `research: not-needed` 及原因。
3. 核对项目术语。遇到模糊词、术语冲突或用户描述与代码不符时，先澄清再继续。
4. 明确 **Behavior Contract** 的六个字段，见[行为契约字段](references/grilling.md#behavior-contract-fields)。
5. 检查架构影响。定向阅读术语表、routes、接口边界和相关 ADR/spec。命中触发项时记录 `required`，并在 shape 前确定每项相关决定的处置方式。未命中时记录 `not-applicable`，并附轻量触发项检查说明。
6. 按[前沿轮次](references/grilling.md#design-tree--frontier-rounds)提问，优先解决产品和设计问题。把前置条件已明确的独立决策放在同一编号轮次。依赖尚未收到的答案的问题留到后续轮次。每轮结束后，重新确定可以继续提问的决策。
7. 批量问题和选项优先使用宿主的结构化提问工具。工具不可用时，使用相同内容的纯文本问题，继续访谈。
8. 持续推进访谈。回答用户的分支问题，复述决定，确认后进入下一个未受阻塞的问题。除非用户要求暂停，否则不等待用户说“继续”。
9. 用具体场景检查主路径、失败可见性和禁止的实现捷径。
10. 在每轮结束前，将当轮已确认决定写入适当的术语表、ADR、research 或 specs。上下文压缩可能丢失聊天内容，因此不得将写入工作推迟到访谈结束。
11. **对齐目标并选择执行路径。** 用 3–6 点回顾目标、行为和关键决定。已有用户指令或回答足以确定契约时，记录授权来源并继续，不重复要求确认。仍有影响结果的歧义或关键取舍时，集中提问并等待明确答案。按[授权规则](../rope-shape/references/gates-and-vocab.md#gate-approval-rules)，由父编排器依据风险、不确定性、上下文容量及 quick 停止线选择 quick 或完整流程，告知选择和原因，不要求用户选择流程。已确认目标但尚未确定路径时，不提前创建完整 issue 包。选择 quick 时，将回顾和决定交给 `rope-quick`，记入 `quick.md`；选择完整流程时交给 shape，由其将回顾投影为 PRD 的 Contract Note。用户只要求讨论或规划时，不自行进入实现。
12. **检查完成条件。** [就绪清单](references/grilling.md#ready-for-shape-checklist)全部满足且行为契约已有明确授权时，完成澄清；否则列出具体阻塞项。
13. 完整流程默认在同一会话交给 shape。提供摘要并沿用已有授权，不为文档保存或本地提交另设确认。只有用户切换会话时，才准备跨窗口粘贴的交接内容。

<a id="guardrails"></a>
<a id="护栏"></a>
## 执行限制

- 不写功能实现代码；目标和执行路径确定前不创建 issue 包。
- 选项必须编号，单独的选项数字就是有效答案。
- 不把可回答的不确定性留作“实现分支”。
- 产品决策不能只留在聊天中，必须写入 `.rope/`。
- 涉及 schema、依赖、认证、部署、生产或共享环境时，检查具体动作及其影响，按授权规则处理；不能仅凭类别名称要求确认。破坏性操作或超出既有授权的动作必须取得明确授权。
