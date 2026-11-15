<a id="0017-dispatch-contract--research-floor-brief-as-contract-parent-writes-no-code"></a>
# 0017 派发契约：调研底线、简报即契约、父编排器不写代码

**状态：**active。恢复并加强 [0016](0016-single-execution-form-agent-dispatch.md)精简时削弱的派发纪律，不改唯一执行形态；修订 [0011](0011-edge-classification-and-acceptance-gates.md)第 8 项模式措辞。

日期：2026-09-29。

<a id="decision"></a>
## 决策

1. **调研底线：**新机制、外部集成或成熟产品做法判断，在决策前并行调研，通常仓库先例与外部调查两份。纯内部小改记 research: not-needed 和理由。shape 无引用 / 免调研记录则拒绝 PRD。无调研产物的行业实践不能作依据。2026-10-22 澄清：先查成熟实现如何完成同任务，再核项目额外约束，不能认为已有自建就必需；决策写复用 / 改造 / 自建及最小剩余范围，结论必须影响选择，不只列书目，独立问题决定并行数量。
2. **简报即契约：**明确问题、来源、路径、返回，叶子逐项履行。explore 默认 map 式事实；指定 research 输出则返回路径、≤300 词摘要、置信度。无法满足要求写 unknowns 及尝试，不默删。explore 默认 low 升 medium，因廉价叶子 low 时会空返回。
3. **必须派发，默认并行：**规则点名叶子处必须派发，每条 E2E 都用 runner，资源不相交并行。父编排器不能代替失败 / 空叶子，这本身是已知失败模式。
4. **go/E2E 父编排器不写产品 / 测试：**所有修改走实现简报，纠偏改简报再派，“小修”也不例外。2026-10-22 澄清：原因未知时默认搜索、调用链、诊断先交 explore；父保留已知位置短读、关键证据核验、契约解释、范围决定。基线 / 集成执行与日志摘要交已有叶子，父选范围、处置失败、管服务生命周期。不设工具次数、不加角色、不用片测代替组装验收。
5. **当轮沉淀：**已确认决定同轮写知识层，轮终仍只留聊天即违规。
6. **默认窄切：**全新窗口是重切上限，不是填满目标；切最小独立可验证且有演示路径的行为，宁多薄、不少满。

2026-09-29 明确**不采纳**：死 / 空叶子机械重派协议、超 ADR 0015 的证据作废规则、收紧修复轮次数、runner 模型等级变化、第五角色。

<a id="context"></a>
## 背景

[三会话审计](../research/grill-research-coverage-regression-audit.md)发现：0016 删派发指令后调研退为用户坚持才做；两场父自实现各约六次压缩，S0 超修复预算，E2E 中五次父修复；runner 启动即死由父开浏览器接手；09-24 确认决定到 09-28 才落盘；S0 横跨 runner/组装/注册/测试超单窗。dispatch-precedents 中 superpowers、GSD、Trellis、Matt 的研究收敛于可执行简报、落盘只返路径、禁止嵌套、父侧有界升级。

<a id="why-this-shape"></a>
## 理由

所有失败同源：该设底线的地方只说“优先”“范围大时”，父总能找到似合法的自办替代。指定接口必须派发、关闭父写入面，即可修复，不恢复旧内核。三家先例一致支持简报和路径返回；低价模型、固定派发数、重试阶梯等分歧恰为用户拒绝部分，判断留父。

<a id="consequences"></a>
## 后果

- grill/shape/go 加硬底线及兜底；explore 正文 / 思考变化需再生成预设。
- 父上下文只留编排、简报、合并、授权；失败以派发问题重简报，不接管。
- 琐碎工作过度派发风险，由 not-needed 分层和 quick 缓解。
- 0011 第 8 项由“简报选择”改“简报声明”，其余不变。

<a id="alternatives-considered"></a>
## 考虑过的方案

- 新 rope-research：拒绝，explore 模式已有覆盖，第五角色割裂谱系。
- 死叶子机械恢复 / 质量门：用户拒绝，保留父判断和强制派发。
- 恢复 dynamic 调研 machinery：拒绝，回归是删文本，不是机制问题。

<a id="context-protection-clarification-2026-10-22"></a>
## 上下文保护澄清（2026-10-22）

[父上下文复盘](../issues/parent-token-retro/retro.md)确认：

- shape 委派来源、消费者、边界、归属、依赖事实，不委派契约、切片、完整包写作；父仍是 PRD/tasks/E2E 作者。
- TDD 独立手册，父在实现简报含纠偏 / 通用回退中传已核实安装绝对路径，不传正文，无需刷新全局预设。上游比较未支持新增 TDD 策略，保留 Rope 验收 / 证据适配。运行归[简报契约](../../skills/rope-go/references/execution-rules.md#leaf-brief-contract-hard-budget)。
- clear 维护文档，init 搭骨架。唯一新术语路径 .rope/GLOSSARY.md，非根目录。clear 按批准批次保留内容迁移 / 合并 CONTEXT、修有效入链；改名和内容清理分开，旧文迁移前可读。运行归[现行文档](../../skills/rope-clear/references/current-docs.md)和[clear](../../skills/rope-clear/SKILL.md)。

这些只澄清已有派发 / 读者边界，不恢复内核、不加固定并行数或自动安装 / 迁移。用户明确指令可覆盖本任务分工；本仓技能编辑有意不使用子代理。
