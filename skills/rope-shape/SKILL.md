---
name: rope-shape
description: 将澄清后的需求整理为 .rope issue 包，包含 PRD、切片、行为矩阵和 E2E。用于 rope-grill 之后，或用户要求在 .rope/issues 下 shape、出 PRD、拆切片时。
---

<a id="rope-shape"></a>
# Rope Shape：需求成形

父编排器将已澄清需求整理为 **issue 包**，保存到 `.rope/issues/<slug>/{prd,tasks,e2e}.md`。使用 issue、PRD 和切片描述本次工作；稳定架构契约仍保存在 `.rope/specs/`。

模板：[issue 包](references/issue-package.md)。
测试边界选址：[边界设计](references/seam-design.md)。
架构影响与约束包：[架构连续性](references/architecture-continuity.md)。
E2E 分类、授权和图术语：[授权与术语](references/gates-and-vocab.md)。

默认在同一会话交给 `rope-go`。

写入说明、简报或记录时，遵守[中文文档写作规则](../rope-grill/references/content-design.md)。

<a id="workflow"></a>
## 工作流程

1. 读取 `.rope/GLOSSARY.md`（旧文档按[现行文档契约](../rope-clear/references/current-docs.md#project-language)查找）、routes、架构连续性及相关 adr/research/specs。
2. 按[交接契约](../rope-harness-presets/references/role-schema.md#exploration-and-validation-handoff)使用 explore，只调查足以确定公共接口与验证**边界**的内容。请求来源位置、消费者、已有测试边界、文件归属及依赖事实。父编排器决定契约、架构处置、切片及依赖边，并编写完整的 PRD、tasks 和 E2E 文件。只委派事实采集；设计判断和整包起草由父编排器负责。用探索结果初始化 `<issue>/map.md`，每行一个事实，带文件路径和日期；后续叶子据此定位，并修正被其工作证伪的条目。
3. 补齐 `routes.md` 的仓库契约；已有仓库可直接从这里接入，无需重跑 rope-init：
   - `Worktree setup:`：询问新 worktree 如何具备测试条件；优先先检查再执行的幂等脚本，也可 `host-managed`。
   - `Test tiers:`：依据 go 的 execution-rules 推导，无需人工；耗时预算与推导说明只保留在该参考文档。
   - `Test policy:`：`fast-iteration` | `full-at-freeze`；允许缺省，由测试阶梯决定。
4. 探测宿主能否派生隔离的 worktree 子代理；在 tasks.md 头部记录 `Execution mode: worktree | shared`，并用一句话说明验证方式。go 使用此记录；实际能力不符时可降级 shared，但必须说明原因。
5. 检查架构影响触发项，记录 `required`，或附轻量检查说明的 `not-applicable`。`required` 必须**在切片前**读取生效来源章节，记录每项来源状态、处置、不变量、禁止捷径、证据、范围和冲突。无来源时写经风险评估的新决策候选。高风险候选、替代、例外和冲突交用户确认。
6. **确认切片提纲。** 列出每片的标题、用户可见结果、`Blocked by`、矩阵行、约束 ID 和证据要求。根据反馈修改，用户批准后再写完整文件。
7. **检查调研记录。** PRD 必须引用 `.rope/research/` 结论，或记录 `research: not-needed` 及原因；如果两者都没有，返回 grill。按模板写 `prd.md`、`tasks.md`、`e2e.md`。每个切片必须列出约束 ID、必读来源路径及章节，以及架构落点证据要求。在 Testing Decisions 中声明架构检查和例外路径。交接前执行整包就绪检查。切片硬规则和证据投影见[授权与术语](references/gates-and-vocab.md)及[架构连续性](references/architecture-continuity.md)。
8. **确认依赖图、切片粒度和执行选择。** 从 `Blocked by` 推导波次（依赖层级）和河流（互不依赖的切片簇），展示初始就绪数、各层宽度及最长阻塞链。默认采用窄切片；上下文窗口是容量上限，不需要填满。文件范围不相交的就绪切片并行执行。同一条消息中，先确认切片是否过粗或过细、依赖边是否符合事实，再询问执行选择。有至少两条河流时，提供拆成不同 issue 或并行执行的选择。只有单链时，确认波次顺序并进入 go。重新拆分会改变需求时，必须返回 grill。
9. `e2e.md` 只记录**真实环境行为**：真实外部系统、入口、数据中模拟无法证明的部分；不重复工单级测试。标记每项的**验证机制**，在 shape 解决非 agent 授权；go 按实时能力重新确定执行者。
10. **契约摘要确认：**输出 prd.md 的 `## Contract Note`，用 3–5 个单句说明可观察结果和相关失败可见性。用户确认摘要，**无需默认通读完整 PRD**。再确认架构决策和授权，提交 issue 包。
11. **检查完成条件。** 整包已提交，就绪检查已通过，每项适用架构决定都有明确处置，授权项均已决定，才能交给 go。记录了阻塞项并不代表已就绪。交接时提供 issue 路径和提交号，默认继续使用同一会话。

<a id="guardrails"></a>
<a id="护栏"></a>
## 执行限制

- 不写功能代码；契约、测试边界、处置、冲突或调研记录未定，不得宣布就绪。
- 高风险新决策候选阻塞 shape；`not-applicable` 仍须记录触发项检查。
- 每个切片必须能在一个全新上下文窗口内完成。不得为回避拆分问题而合并互不依赖的切片簇。不写易过时的逐文件计划，只写公共接口与边界。
- 第 10 步契约摘要确认代替默认的完整 PRD 审阅。
- 迁移接口边界的切片必须有消费者全量检查证据，见 gates-and-vocab。
