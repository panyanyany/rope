---
name: rope-grill-standard
description: 独立完成按风险分层的事实发现、需求追问、架构检查和兼容 Rope 的文档沉淀，不转交其他需求访谈技能。
---

<a id="rope-grill-standard"></a>
# Rope Grill Standard：标准需求澄清

适用于简单澄清不足、又不应无限展开设计访谈的需求。独立负责探索、提问、决策追踪、文档、架构影响和最终 Rope 交接；不把讨论委派给 grill-me、grill-with-docs 或 rope-grill。

<a id="plain-language-rules"></a>
## 通俗表达规则

写作遵守[中文文档写作规则](../../../skills/rope-grill/references/content-design.md)。用完整、直接的中文说明执行者、条件和结果，保持协议字段名不变。

与用户说产品语言：

- Behavior Contract → “必须保证什么行为”。
- failure visibility → “用户在哪里看到错误”。
- forbidden shortcut → “什么捷径能过浅层测试，却违背意图”。
- human gate → “这需要你明确批准”。

每个决策问题包含一个通俗问题、推荐答案、具体例子，以及另一选择的代价。例子应说明用户、API 调用者或运维人员会执行什么操作、看到什么结果。所有可见选项都编号，单独回复数字即选中该项。后续问题依赖答案时逐题问，只合并真正独立的决策。

<a id="phase-1-discover-facts"></a>
## 第一阶段：发现事实

提问前：

1. 复述期望结果及疑似歧义。
2. 读取相关代码、测试、配置和本地约定。
3. Rope 仓库读取 CONTEXT、routes、相关 specs、adr、research。
4. 分开事实与决策：事实查代码 / 文档，只向用户询问产品选择、策略、取舍或缺失授权。
5. 继续前核对术语冲突，以及请求、代码、文档的矛盾。

<a id="phase-2-select-discussion-depth"></a>
## 第二阶段：选择讨论深度

选择足以解决全部实施分支的最小讨论深度，并简要说明理由。用户可以调整讨论深度。

<a id="quick"></a>
### 快速

适用于影响局部、行为明确、不改公共契约、数据边界、权限、部署或架构。明确目标行为、验收标准、回归测试，通常不超过三题。

<a id="standard"></a>
### 标准

功能或非简单缺陷默认采用。明确受影响的用户、调用者和记录，以及主成功流程。说明失败行为和错误出现的位置。检查相关的空输入、重复操作、依赖不可用及边界情况，并确定兼容要求、回归预期和验收证据。通常不超过五个决策问题；预算用于帮助停止，不是必须问满。

<a id="architecture"></a>
### 架构

出现以下任一情况时，采用架构讨论深度：

- 公共接口发生变化。
- 依赖方向或模块边界发生变化。
- 状态、生命周期、持久化、权限、并发或错误语义发生变化。
- 新增调用者、入口、adapter 或运行时。
- 可能重复已有职责。
- 需要引用 ADR/spec，或与这些文档存在冲突。

查相关决策、确定处置，记录不变量与所需证据。继续到高影响分支全部解决，不按任意题数收工。

<a id="investigation"></a>
### 调查

主要不确定性是事实，或需求与代码 / 文档冲突时，先探索、展示证据，再问剩余决策。不让用户回答仓库能回答的问题。

<a id="phase-3-control-the-decision-tree"></a>
## 第三阶段：控制决策树

只有不同答案会改变以下至少一项时，才向用户提问：

- 实现结构或实施路径。
- 用户或 API 调用者可观察的行为。
- 数据模型、持久化、迁移或兼容性。
- 授权、安全、隐私、可靠性或部署。
- 测试或验收证据。

每个未决问题先明确影响，先解决阻塞再看兄弟分支。每个答案后：

1. 通俗复述所选决定。
2. 更新工作契约。
3. 执行下述强制文件写入检查点。
4. 移除因答案已失去意义的问题。
5. 重算高影响未决分支。

所有影响实现的决策已解决或明确委托、验收行为可测，剩余仅低风险工程判断时停止。

<a id="mandatory-persistence-checkpoint"></a>
<a id="强制落盘检查点"></a>
### 强制文件写入检查点

每次实质用户回答后、下次提问前执行。必须用文件工具，不能只存在聊天：

1. 分类为领域术语、稳定契约 / 易踩坑、外部事实、架构取舍、issue 局部产品决定。
2. 立即写入最小适当长期文档：
   - 领域术语 → `.rope/CONTEXT.md`。
   - 稳定契约 / 易踩坑 → `.rope/specs/<area>/<topic>.md`。
   - 外部事实 → `.rope/research/<topic>.md`。
   - 架构取舍 → `.rope/adr/`。
   - issue 局部决定 → 当前决策记录；包尚未建立时用 `.rope/issues/<slug>/grill-decisions.md`。
3. 重读变更文件或章节，验证已写入。
4. 告知用户保存了什么、在哪里，例如 `已记录 D2：失败时保留原数据，写入 .rope/specs/orders/cancellation.md`。
5. 之后才能问下一题。

若无合适长期文档，明确说明，并追加到 grill-decisions.md，标 `issue-local / pending issue package`，不能只留聊天。该文件是澄清台账，不是 issue 包；共同理解确认前不建 prd/tasks/matrix 等产物。选完整流程时携入 issue 包，选直接 go 时传递路径及确认契约。仓库无 `.rope/` 时先暂停询问记录位置。

编辑已有文档只改 / 追加相关部分，保留用户无关改动。未成功写入及验证不能声称已保存。

<a id="phase-4-maintain-the-compatible-contract"></a>
## 第四阶段：维护兼容契约

全程维护六字段，字段名保留英文：

1. System under test：被测系统。
2. Trigger or input：触发 / 输入。
3. Collaborators：协作者。
4. Observable result：可观察结果。
5. Failure visibility：失败可见位置。
6. Shortcut that could pass shallow tests but violate the intent：能过浅层测试却违背意图的捷径。

至少检验主成功路径、失败可见性、一个有意义边界、禁止捷径；适用时补空输入或依赖不可用。用户不懂 Rope 术语也应能复述最终决定，否则暂停，用具体场景解释。

<a id="phase-5-crystallize-decisions"></a>
<a id="第五阶段沉淀决策"></a>
## 第五阶段：保存已确认决定

决定稳定后，立即写入最小相关文档，不等待访谈结束：

| 决策 | 归属 |
| --- | --- |
| 规范领域术语 | `.rope/CONTEXT.md` |
| 稳定契约 / 易踩坑 | `.rope/specs/<area>/<topic>.md` |
| 可复用外部 / 平台事实 | `.rope/research/<topic>.md` |
| 难逆转、意外且有可信替代方案的取舍 | `.rope/adr/` |

不把争议写成定论，不把实现步骤、临时事实或工单细节放 CONTEXT。

文件写入检查点优先于分流确认：最终回顾中的每个确认决定必须有文档路径，或明确 issue-local / pending issue package 状态。

架构工作逐个相关来源记录：

```md
- ID: D1
  Source: <.rope/adr/... 或 .rope/specs/...>
  Decision status: active | superseded | deprecated | provisional | unknown
  Scope: <行为及边界>
  Decision disposition: inherit | extend | supersede | exception | not-applicable
  Inherited invariants:
    - <不变量>
  Affected public interfaces: <边界或 none>
  Forbidden shortcuts:
    - <捷径>
  Required evidence: <测试、集成检查、审查或文档>
  Applies to: issue | Slice N | e2e | verify
  Documentation update: pending-finish | updated-existing | added-new |
    no-new-decision | exception-recorded
  Unresolved conflicts: <none 或冲突>
```

无架构触发仍记录轻量 not-applicable 检查。存疑则按 required 处理，直到解决。

<a id="phase-6-finish-and-route"></a>
## 第六阶段：结束与分流

共同理解回顾应包含：

- 范围和明确不做的事项。
- 六字段契约。
- 已确认决定及其保存路径。
- 主路径、失败、边界和禁止捷径的场景。
- 验收标准及证据。
- 未解决风险和待人工授权的事项。
- 推荐的下一步。

用户确认回顾后，给兼容编号分流：

```text
1. 完整流程：写 issue → shape → go
2. 直接 go：跳过 issue 和 shape
```

完整流程的回顾应足以形成可 shape 契约；直接 go 的确认契约与路径应足以在不先建 issue 包的情况下实现。共同理解确认前不建 issue 产物。

本技能不实现功能代码，只负责澄清与决策记录；实现另行执行。

<a id="guardrails"></a>
<a id="护栏"></a>
## 执行限制

- 不问可查证事实。
- 不默默解决 ADR、spec、代码行为冲突。
- 可逆、常规、无取舍的选择不写 ADR。
- 访谈时不实现功能。
- schema、依赖、认证、部署、破坏性文件系统 / git、生产 / 共享环境变更需明确批准。
