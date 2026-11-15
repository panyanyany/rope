<a id="architecture-decision-continuity-across-issues"></a>
# 跨 issue 架构决策连续性

shape 切片前找生效来源并逐决策记录处置；go 要求实现和审查叶子阅读限定来源、返回架构证据；结束审查判断不变量和例外，verify 查记录，finish 按现有归属完成正式文档。保留架构行为，但不要求每任务新 ADR 或强制具体内部实现形态。

<a id="status"></a>
## 状态

active

<a id="decision"></a>
## 决策

- 新包显式记录 Architecture Impact；not-applicable 是轻量核验结果，不能省章节。
- 依据 CONTEXT、routes、公共边界和相关 ADR/spec 定向查找，不全扫描。
- 每来源单列路径、状态、范围、处置、不变量、接口、禁止捷径、证据、文档结果、冲突；每决策 / 不变量映射 issue、切片、e2e、verify 及证据。
- 来源状态 active/superseded/deprecated/provisional/unknown 与 issue 处置 inherit/extend/supersede/exception/not-applicable 分开。
- 有触发无来源，写 Relevant decisions: none found 及独立 New decision candidate，不能冒充 not-applicable。难逆转、改公共契约或有真实取舍的候选阻塞 shape；低风险也需父编排器明确是否要长期文档。
- 影响 issue 的未解冲突阻塞 shape，必须明确来源及解决方式，不能默选。
- 当前正文原位改权威来源，不能追加矛盾条款。普通正文依赖 Git 历史，ADR 保留决策史并标替代范围 / 链接；搜索命中先查状态。运行维护规则归[现行文档契约](../../skills/rope-clear/references/current-docs.md)。
- rope-clear 显式整理先提带证据批次再批准；来源权威不明、脏内容、无 Git 历史需保留 / 决策。常规已授权同步遵守相同规则，无需另开无关清理。
- prd.md 唯一完整约束包，父持有完整内容，叶子必收全局 / 切片 ID 与来源章节；实现者编辑前读并记架构落点，摘要不能替代。见[连续性契约](../specs/guides/architecture-continuity.md)。
- 实现者 / 审查者不能默改处置，冲突回父编排器重简报、调 shape，必要时人工确认。
- 结束审查判断行为 / 不变量继承、职责重复、依赖方向、公共兼容、例外、证据；verify 只查结果和映射，保留唯一审查点。均不得要求来源未定的内部形态。not-applicable 也要检查。
- 缺来源状态写 unknown，只有可能改变适用规则 / 处置才阻塞，否则显式带不确定性继续。
- tasks.md 只引用 ID 并记切片适用 / 证据，不复制完整包。
- 最终变更决策则 finish 完成文档：难逆转意外取舍进 ADR，稳定契约 / 易踩坑进 spec，领域术语进 CONTEXT，外部事实进 research。缺文档本身不算 verify 失败；确认过的直接写，不重问。
- finish 发现未确认架构变化则暂停决定处置，不造例外、不带文档待办关闭。
- 文档终态 updated-existing / added-new / no-new-decision / exception-recorded，附范围、理由、到期 / 失效条件。finish 前可 pending-finish，收尾必须替换。
- grill 优先 ask_user_question 等宿主结构化工具；无工具则通俗问题加推荐、例子、代价。

<a id="consequences"></a>
## 后果

- 包及简报增加架构字段，但决策来源仍在已有知识层。
- 无架构影响的小任务仍轻量。
- supersede/exception 需明确解释及证据，不授权无记录捷径。
- 旧包不批量迁移，进入执行时补相关约束 / 阅读；兼容不等于无约束执行。
- 审查者可据组装行为 / 依赖证据质疑 not-applicable；verify 查是否解决，不推断架构或复审 diff。
