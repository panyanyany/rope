<a id="architecture-continuity"></a>
# 架构连续性

shape、go、verify、finish 共用本参考。issue 包只负责传递约束；`.rope/adr/` 和 `.rope/specs/` 仍是决策来源。

把检索到的段落当作要求，或修改决策前，先读[现行文档契约](../../rope-clear/references/current-docs.md)，核对状态、范围及替代关系。仅有 grep 命中不构成约束。

<a id="trigger-check"></a>
## 触发项检查

shape 定向查阅 `.rope/GLOSSARY.md`、routes、已确认边界、任务引用及相关 ADR/spec，不扫描全部架构文档。

任一触发项成立时，设为 `Impact: required`：

- 修改已有公共接口。
- 改变依赖方向或接口边界。
- 改变状态、生命周期、持久化、权限、并发或错误语义。
- 新增调用者、入口、adapter 或运行时。
- 可能重复已有职责。
- 任务引用或依赖 ADR、spec 或架构 issue。

只有记录轻量检查、说明各触发项均不适用后，才能设为 `Impact: not-applicable`。存在不确定性时用 `required` 并记录未决问题。

<a id="decision-record"></a>
## 决策记录

每个相关来源在 `prd.md` 中单列一项；保留字段和枚举名，内容用中文：

```md
- ID: D1
  Source: .rope/adr/NNNN-slug.md or .rope/specs/area/topic.md
  Decision status: active | superseded | deprecated | provisional | unknown
  Scope: <覆盖的行为与边界>
  Decision disposition: inherit | extend | supersede | exception | not-applicable
  Inherited invariants:
    - <行为或依赖不变量>
  Affected public interfaces: <接口边界或 none>
  Forbidden shortcuts:
    - <虽能过浅层测试却违反决策的偷懒路径>
  Required evidence: <测试、集成检查、审查判断或文档>
  Applies to: issue | Slice N | e2e | verify
  Documentation update: pending-finish | updated-existing | added-new | no-new-decision | exception-recorded
  Unresolved conflicts: <none，或来源及受影响行为>
```

`Decision status` 描述来源状态，`Decision disposition` 描述本 issue 的处理方式，不能混用。来源状态 `unknown` 只有在不确定性可能改变适用规则或处置时才阻塞；否则显式保留该不确定性。

处置含义：

- `inherit`：保留决策及其不变量。
- `extend`：保留核心不变量，扩展范围或兼容性。
- `supersede`：用明确接受的替代方案取代来源决策。
- `exception`：只在有边界、有文档的范围内违反指定不变量。
- `not-applicable`：该来源与本 issue 行为无关。

两个来源冲突且未明确替代关系时，列出两者、说明受影响行为，解决前阻塞 shape。叶子不能默默解决。

有触发项、定向查找却无来源时，写：

```md
- Relevant decisions: none found
- New decision candidate:
  - Scope: <新边界或职责>
  - Risk: low | high
  - Decision needed: <父编排器 / 用户决策，或明确无需新决策的理由>
```

高风险候选（难逆转、改变公共契约、存在真实取舍）阻塞 shape。低风险候选只有父编排器给出明确结论后才能继续。

旧包缺少 Architecture Impact 时，在 go 派发受影响切片前补做定向检查及适用映射。记录 `legacy package` 和评估；缺少历史不等于可以无约束执行。不要批量迁移无关旧包。

<a id="constraint-bundle"></a>
## 约束包

`prd.md` 保存唯一完整约束包，包含：

- 决策来源与来源状态。
- 范围。
- 不变量。
- 公共边界。
- 禁止的捷径。
- 验收证据。
- 未解冲突与新候选。

将每项决策和不变量映射到 `issue`、一个或多个切片、`e2e` 或 `verify`，并说明证明它的证据。`tasks.md` 只引用 ID 和切片适用性，不复制完整包。

父编排器保留完整包。每个切片必须有非空 `Constraint IDs:`，以及带章节名的 `Required reading:` 路径，涵盖全局适用和切片专属 ID。选取足以明确职责归属、公共边界和禁止捷径的最小来源章节，并带上状态 / 范围 / 替代关系上下文。包摘要不能代替读取生效来源。

已核验不适用时，写 `Constraint IDs: none — <触发项检查理由>`、`Required reading: none — <原因>`。纯文档工作不自动豁免：修改规范也可能影响架构决策。

父编排器**先读适用来源再切片**，据此建立映射。叶子只读自身映射章节，不读整个 `.rope/`。实现者写代码前记录 **Architecture landing（架构落点）**，最多三行，说明复用的已有职责、采用的公共边界及必须保持的所有权 / 依赖方向。返回实际来源阅读记录的引用及这段声明，不能只声称读过哪些路径。这不是新增批准轮次，也不是逐文件推测计划。

生效规范优先于切片局部便利。来源与约束包不符，或需改处置时，停止受影响切片，交回父编排器判断来源状态、重做 shape，并在需要时让用户确认变更 / 例外。独立切片可以继续。

<a id="package-readiness-gate"></a>
## 整包就绪检查

shape 宣布就绪前检查，go 派发前复查。缺失或仅占位的字段退回 shape，不能让实现者自行编造：

- 每个 issue 都有 Impact 结果和触发项检查理由。`required` 必须有非空约束包、具体来源路径与适用章节、已定处置，且无适用的未解冲突。
- 找不到已有来源时保留 `Relevant decisions: none found`；为已定新候选分配 ID，在包中记录理由、不变量、公共边界、证据、范围。正式文档建立前，以 issue 内路径 / 章节作为阅读来源。未定候选不能代替约束包，禁止伪造 spec 引用。
- 每片约束 ID 均映射到真实包记录，含必读来源、架构证据及全局适用 ID。有理由的 `none` 必须与触发项检查一致，不能只按切片标签判断。
- Testing Decisions 明确架构检查命令 / 覆盖和例外清单路径，或明确记录未发现及所需人工不变量审查。切片携带受影响检查的证据，完整架构检查覆盖属于 issue 级证据。执行与集成机制见[架构检查](../../rope-go/references/architecture-gates.md)。

包完整是派发门槛，不证明实现已遵守约束。

<a id="continuity-checks"></a>
## 连续性检查

issue 结束审查者依据生效来源判断行为、不变量、依赖方向、职责归属、公共兼容性和例外边界。verify 只检查已记录映射、证据、审查及文档结果，不重新判断代码。两者都不能要求来源契约未规定的内部实现形态。

`not-applicable` 记录轻量触发项检查；`inherit` 每项不变量均需证据；`extend`、`supersede`、`exception` 的证据须覆盖变化边界与文档结果。已确认但尚未写入的文档标为 `pending-finish`，不是代码问题。

finish 将 `pending-finish` 改为以下终态之一：

- `updated-existing`
- `added-new`
- `no-new-decision`
- `exception-recorded`

finish 发现未确认架构变化时，暂停并请求处置决定。不能自行编造例外，也不能带着文档待办关闭 issue。
