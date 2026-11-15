---
name: rope-shape
description: 将澄清后的需求整理为 .rope issue 包，包含 PRD、切片、行为矩阵和 E2E。用于 rope-grill 之后，或用户要求在 .rope/issues 下 shape、出 PRD、拆切片时。
---

<a id="rope-shape"></a>
# Rope Shape：需求成形

父编排器将已澄清需求整理为 **issue 包**（`.rope/issues/<slug>/{prd,tasks,e2e}.md`）。它不是 `.rope/specs/` 架构文档；使用 **issue / PRD / 切片**这一组术语。

模板：[issue 包](references/issue-package.md)。
测试边界选址：[边界设计](references/seam-design.md)。
架构影响与约束包：[架构连续性](references/architecture-continuity.md)。
E2E 分类、授权和图术语：[授权与术语](references/gates-and-vocab.md)。

默认在同一会话交给 `rope-go`。

<a id="workflow"></a>
## 工作流程

1. 读取 `.rope/GLOSSARY.md`（旧文档按[现行文档契约](../rope-clear/references/current-docs.md#project-language)查找）、routes、架构连续性及相关 adr/research/specs。
2. 按[交接契约](../rope-harness-presets/references/role-schema.md#exploration-and-validation-handoff)使用 explore，只调查足以确定公共接口与验证**边界**的内容。请求来源位置、消费者、已有测试边界、文件归属及依赖事实。父编排器决定契约、处置、切片和边，并编写完整 PRD/tasks/E2E；只委派事实采集，不委派设计判断或整包起草。用探索结果初始化 `<issue>/map.md`，每行一个事实，带文件路径和日期；后续叶子据此定位，并修正被其工作证伪的条目。
3. 补齐 `routes.md` 的仓库契约；已有仓库可直接从这里接入，无需重跑 rope-init：
   - `Worktree setup:`：询问新 worktree 如何具备测试条件；优先先检查再执行的幂等脚本，也可 `host-managed`。
   - `Test tiers:`：依据 go 的 execution-rules 推导，无需人工；耗时预算与推导说明只保留在该参考文档。
   - `Test policy:`：`fast-iteration` | `full-at-freeze`；允许缺省，由测试阶梯决定。
4. 探测宿主能否派生隔离的 worktree 子代理；在 tasks.md 头部记录 `Execution mode: worktree | shared`，并用一句话说明验证方式。go 使用此记录；实际能力不符时可降级 shared，但必须说明原因。
5. 检查架构影响触发项，记录 `required`，或附轻量检查说明的 `not-applicable`。`required` 必须**在切片前**读取生效来源章节，记录每项来源状态、处置、不变量、禁止捷径、证据、范围和冲突。无来源时写经风险评估的新决策候选。高风险候选、替代、例外和冲突交用户确认。
6. **切片提纲确认：**标题、用户可见交付、`Blocked by`、矩阵行、约束 ID、证据；迭代至批准后再写完整文件。
7. **调研记录门槛：**PRD 必须引用 `.rope/research/` 结论，或记录 `research: not-needed` 及原因；两者皆无则返回 grill。按模板写 `prd.md`、`tasks.md`、`e2e.md`。每个切片必须有约束 ID、必读来源路径 / 章节及架构落点证据；Testing Decisions 声明架构检查和例外路径。交接前执行整包就绪检查。切片硬规则和证据投影见[授权与术语](references/gates-and-vocab.md)及[架构连续性](references/architecture-continuity.md)。
8. **依赖图、粒度确认与执行选择：**由 `Blocked by` 推导波次（层级）和河流（簇），展示初始就绪数、各层宽度及最长阻塞链。**默认窄切片：**上下文窗口是上限，不是填满目标；文件不相交的切片并行。同一条消息确认粒度是否过粗 / 过细、边标签是否真实，再问执行选择：≥2 条河流则提供拆 issue 或并行；单链则确认波次顺序并进入 go。改变需求的重切必须返回 grill。
9. `e2e.md` 只记录**真实环境行为**：真实外部系统、入口、数据中模拟无法证明的部分；不重复工单级测试。标记每项的**验证机制**，在 shape 解决非 agent 授权；go 按实时能力重新确定执行者。
10. **契约摘要确认：**输出 prd.md 的 `## Contract Note`，用 3–5 个单句说明可观察结果和相关失败可见性。用户确认摘要，**无需默认通读完整 PRD**。再确认架构决策和授权，提交 issue 包。
11. **完成条件：**整包已提交、就绪检查通过、所有适用架构条目均有已定处置、授权已决定。有已记录阻塞项仍不算可执行。以 issue 路径和提交号在同会话交给 go。

<a id="guardrails"></a>
## 护栏

- 不写功能代码；契约、测试边界、处置、冲突或调研记录未定，不得宣布就绪。
- 高风险新决策候选阻塞 shape；`not-applicable` 仍须记录触发项检查。
- 必须装得进一个全新上下文窗口；不能为回避拆分问题而合并河流。不写易过时的逐文件计划，只写公共接口与边界。
- 第 10 步契约摘要确认代替默认的完整 PRD 审阅。
- 迁移接口边界的切片必须有消费者全量检查证据，见 gates-and-vocab。
