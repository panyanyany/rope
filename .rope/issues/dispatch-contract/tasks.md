# 派发契约规则修订 Tasks

Execution mode: shared（solo mode per user waiver 2026-09-29：父会话自行施工不派生子代理；shape 完成后由用户放行 go）

## Graph summary

初始就绪 4（S1|S2|S3|S4 无边并行，目录互斥）；两层，最长链 2（S1–S4 → S5）；串行总量 5 切片；S5 为文档汇合点，唯一方法序边是"规则文本先于 ADR 定稿"。全部切片 ≤4 owned files、预计 <200 diff 行。

## Behavior Matrix (issue behavior spec — BDD)

| Behavior (Given/When/Then where it helps) | Applies? | Verified at |
| --- | --- | --- |
| B1 Given grill 遇新机制/外部集成/产品设计判断，When 进决策轮前，Then SKILL.md step 2 与 grilling.md 要求两路调研派发（仓库先例+外部横评），纯内部改动记 not-needed+理由 | yes | S2 diff + review |
| B2 Given 派调研简报，When 写简报，Then 必含问题+为什么/一手来源规则/输出路径+小节/返回形状；preset 正文按简报声明切换默认返回；unknowns 必附试过什么 | yes | S1+S2 diff + E2 |
| B3 Given grill 一轮决议确认，When 本轮结束，Then 决议当轮写入 .rope/（票面/tickets），checklist 含此项 | yes | S2 diff + review |
| B4 Given shape 开写 PRD，When PRD 既无 research 引用也无 not-needed 记录，Then shape 拒绝开写（兜底检查写入 SKILL.md） | yes | S3 diff + review |
| B5 Given 切片图定稿，When 粒度判断，Then 收窄为默认姿态（fresh-window 是上限非目标；独立可验证最小行为；文件不重叠并行） | yes | S3 diff + review |
| B6 Given go/E2E 进行中，When 出现代码改动需求，Then 规则要求走叶子简报，父会话连续编辑产品/测试码为违规；E2E 旅程必须派 runner 且能并行则并行 | yes | S4 diff + review |
| B7 Given explore preset，When 重生成，Then thinking: medium，正文含两套默认输出契约与 unknowns 纪律；role-schema/ranking 同步 | yes | S1 + E2 |
| B8 Given 规则修订完成，When ADR 0011 item 8 与 CONTEXT.md 检查，Then 简报即契约措辞落地、Research Floor 术语入表、0017 记录全部决策与放弃项 | yes | S5 + review |
| Real-entrypoint behavior（安装产物含新规则文本） | yes | e2e.md E1/E2 + review probe |

## Slice 1: harness-presets 简报即契约与 medium 档

- Status: pending
- Kind: vertical
- Goal: explore preset 以简报声明的输出契约为准，模式歧义消除；默认思考档升 medium。
- Demo path: 重生成的 ~/.pi/agent/agents/rope-explore.md 打开即见 thinking: medium 与"尊重简报输出契约+两默认+unknowns 附尝试记录"正文。
- Blocked by: none
- Scope: skills/rope-harness-presets/（role-schema、ranking、agent-templates、explore-research-mode）+ 本机 preset 重生成。
- Owned files: skills/rope-harness-presets/references/role-schema.md；references/ranking.md；references/agent-templates.md；references/explore-research-mode.md（preset 与 manifest 为生成物，不属 owned 文件）
- Size cap: ~4 files / <200 行
- Matrix rows: B2, B7
- Constraint IDs: D1（research 写入仅限 .rope/research/**；三角色不变）
- Required evidence: 四文件 diff（B2/B7）；preset 工件 frontmatter+正文（B7，亦见 E2）
- Public behavior: 派发给 explore 的调研简报获得契约一致的返回。
- Tests: node --test tests/*.test.mjs（引用解析）
- Implementation notes: explore-research-mode.md 触发措辞从"brief asks for a findings file"改为"简报声明产出即契约"（保留 ADR 0011 引用并注明 0017 修订）；role-schema explore 行 thinking low→medium；ranking §3.1 同步并注明依据（2026-09-29 用户裁定）；agent-templates §rope-explore 增两默认输出契约与 unknowns 纪律；随后按 skill 幂等重生成 preset（approved gate）。
- Verification: 冒烟 + preset 文件检查
- Stop conditions: preset 生成机制与本仓规则文本冲突无法幂等重生成 → 报 blocker

## Slice 2: rope-grill 调研门槛分级与实时落盘

- Status: pending
- Kind: vertical
- Goal: grill 恢复强制调研派生（分级门槛）+ 决议当轮落盘。
- Demo path: 新 grill 会话遇外部集成需求时，step 2 直接要求并行派两路调研简报，纯内部改动引导记 not-needed。
- Blocked by: none
- Scope: skills/rope-grill/
- Owned files: skills/rope-grill/SKILL.md；skills/rope-grill/references/grilling.md
- Size cap: 2 files / <150 行
- Matrix rows: B1, B2, B3
- Constraint IDs: D1
- Required evidence: 两文件 diff（B1/B3）；grilling.md 简报契约段（B2，与 S1 契约一致）
- Public behavior: 见 Demo path。
- Tests: 冒烟（引用解析）
- Implementation notes: SKILL.md step 2 恢复派生指令并写分级条件（新机制/外部集成/产品设计判断→必派两路；否则 not-needed+理由记票面）；step 10 强化"每轮决议当轮落盘"；grilling.md "External libraries" 节扩为 Research Floor（引 ponytail-prior-art-ladder.md 与 dispatch-precedents/；含未验证行业断言禁令；简报契约引用 explore-research-mode.md）；Ready checklist 加两条（先例阶梯已走或 not-needed；无未验证"业界都这样"断言）。
- Verification: 冒烟
- Stop conditions: none 预见

## Slice 3: rope-shape 兜底与切片收窄默认

- Status: pending
- Kind: vertical
- Goal: shape 拒绝无调研记录的 PRD；切片默认收窄、并行优先。
- Demo path: shape 开写前检查 PRD 的 research 引用/豁免；粒度 quiz 把"收窄+并行"作为默认答案。
- Blocked by: none
- Scope: skills/rope-shape/
- Owned files: skills/rope-shape/SKILL.md；skills/rope-shape/references/gates-and-vocab.md
- Size cap: 2 files / <120 行
- Matrix rows: B4, B5
- Constraint IDs: D1（item 6 粒度规则增收窄默认）
- Required evidence: 两文件 diff（B4/B5）
- Public behavior: 见 Demo path。
- Tests: 冒烟
- Implementation notes: SKILL.md step 7/8 增兜底句（PRD 无 research 引用亦无 not-needed → 拒绝开写）与收窄默认（fresh-window 上限不变、姿态改窄；独立可验证最小行为；文件不重叠即并行，方法序边不阻塞派发——沿用 ADR 0011 语义）；gates-and-vocab 粒度节增收窄默认行。注意与既有下限规则（整变更装一窗→建议 rope-quick）不冲突。
- Verification: 冒烟
- Stop conditions: none 预见

## Slice 4: rope-go 父不自写与 E2E 必派并行

- Status: pending
- Kind: vertical
- Goal: go/E2E 期父会话不产码；E2E 旅程必派 runner 叶且能并行则并行。
- Demo path: execution-rules.md Parent/Leaf Contract 出现加粗硬规则"父会话不写产品/测试码，纠偏=重写简报重派"；E2E 节"必须派生、并行派"为显式强调。
- Blocked by: none
- Scope: skills/rope-go/
- Owned files: skills/rope-go/SKILL.md；skills/rope-go/references/execution-rules.md
- Size cap: 2 files / <100 行
- Matrix rows: B6
- Constraint IDs: D2（继承+强调）、D3（父纠偏=重写简报）
- Required evidence: 两文件 diff（B6）
- Public behavior: 见 Demo path。
- Tests: 冒烟
- Implementation notes: 不新增死叶协议/证据作废规则（用户裁定不设）；仅强调派生与并行；引用审计 research 作为现场证据（一行）。
- Verification: 冒烟
- Stop conditions: none 预见

## Slice 5: ADR 0017 + 0011 修订 + CONTEXT 术语 + 索引同步

- Status: pending
- Kind: vertical
- Goal: 决策记录完整：0017 新增、0011 item 8 措辞修订、CONTEXT.md 收 Research Floor、索引同步。
- Demo path: .rope/adr/0017 存在且含全部决策与放弃项清单；CONTEXT.md 术语表可查 Research Floor。
- Blocked by: Slice 1, Slice 2, Slice 3, Slice 4（methodology-order：规则定稿先于决策记录；不阻塞其派发，仅定稿顺序）
- Scope: .rope/
- Owned files: .rope/adr/0017-dispatch-contract.md；.rope/adr/0011-edge-classification-and-acceptance-gates.md；.rope/CONTEXT.md；.rope/specs 索引/README 同步点（如存在）
- Size cap: 4 files / <250 行
- Matrix rows: B8
- Constraint IDs: D1、D3
- Required evidence: ADR/CONTEXT diff（B8）；0017 含放弃项（死叶协议/恢复协议/修复轮计数/runner 档位）与先例引用
- Public behavior: 见 Demo path。
- Tests: 冒烟
- Implementation notes: 0017 结构沿用仓库 ADR 格式（Status/Date/Decision/Context/Why this shape/Consequences/Alternatives）；0011 仅改 item 8 触发措辞并加"部分被 0017 取代"标注，不动其他条目。
- Verification: 冒烟
- Stop conditions: none 预见
