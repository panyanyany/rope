<a id="plan-artifact-reader-layering--spec"></a>
# 计划产物读者分层规范

规定面向人 / 机器的计划产物、契约摘要和最小叶子简报预算。决策来源：`.rope/adr/0005-plan-artifact-reader-layering.md`。

<a id="readers"></a>
## 读者

- **人读：**rope-grill 的 3–6 点回顾和 shape 的 3–5 点 Contract Note。通俗易扫读，必要时省略完整语法。
- **机器读：**PRD 行为契约、矩阵、约束包、任务、E2E 计划。结构化、按引用加载，不批量复制进聊天或叶子简报。

<a id="contract-note"></a>
## 契约摘要

- 位置：prd.md 的 `## Contract Note`，位于 Solution 与 Public Interface / Behavior 之间。
- 内容：3–5 个单句，回答“完成后能观察到什么”，适用时补失败可见性。
- 投影规则：每点来自行为契约的可观察结果、失败可见性或允许 / 禁止边界，不能另列愿望。
- 确认：shape 让用户确认摘要，无需默认读完整 PRD；确认摘要即确认投影的行为契约。
- 验收：依据行为契约、矩阵、E2E，摘要本身不是验收产物。
- 兼容：无摘要旧包仍有效，新包必须写。

<a id="minimal-leaf-brief"></a>
## 最小叶子简报

实现者 / 审查者采用允许清单及行数上限：

- **可内联内容：**一句切片 Public behavior、最简六字段行为契约、约束包路径及切片约束 ID 和短全局不变量、测试边界及一个先例路径。
- **必需操作契约，不计为内容载荷：**已解析的安装版 TDD 手册绝对路径，要求实现者编辑前读；任务红绿命令及 red 信号；摘要 / 路径 / 提交返回格式；禁止嵌套派生和提交规则；prd/tasks/e2e、约束包、specs、文件等引用路径。
- **仅引用：**切片备注、PRD 段落、包细节、实现笔记、推测逐文件计划。
- **上限：**正文 ≤60 行，路径及命令块不计。

运行时交接归[角色契约](../../skills/rope-harness-presets/references/role-schema.md#exploration-and-validation-handoff)和[简报契约](../../skills/rope-go/references/execution-rules.md#leaf-brief-contract-hard-budget)。shape 委派事实采集，不委派整包写作；父编排器仍是作者和决策方。TDD 策略留独立手册，不复制到主技能、预设或简报。

<a id="unresolved-questions"></a>
## 未决问题

- 可回答问题在 shape 前的 grill 确认点解决，不作为实现分支带入执行。
- go 叶子发现冲突返回父编排器重写简报和处置，不默默吸收，不自行发明 exception/extend/supersede。

<a id="forbidden-shortcuts"></a>
## 禁止捷径

- 简报复制完整 PRD / 约束包。
- 为省词删 TDD 命令、返回格式或叶子纪律。
- 确认从未写入 prd.md 的聊天回顾，造成漂移。
- 把摘要当验收契约。
- 默默吸收叶子发现冲突。
- 继续使用“计划简洁，最后列未决问题”的旧规则。
