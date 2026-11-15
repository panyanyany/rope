# dispatch-contract map

- rope-grill SKILL.md step 2 无派生指令：`2d5644c`（2026-09-23，ADR 0016 精简）删除了 "dispatch a background explore leaf for wide lookups" — skills/rope-grill/SKILL.md（2026-09-29 核实）
- grilling.md 仍留许可式措辞 "Prefer background explore leaves when wide" — skills/rope-grill/references/grilling.md
- ADR 0011 item 8：research mode 为 brief-selected（"简报要求 findings 文件才激活"）；item 6：fresh-window 上限为 re-cut 触发器（未规定收窄默认）— .rope/adr/0011-edge-classification-and-acceptance-gates.md
- explore-research-mode.md 已定义 research 简报形状（问题+为什么/一手来源/输出路径+小节/返回≤300字摘要+置信度）与降级路径 — skills/rope-harness-presets/references/explore-research-mode.md
- role-schema.md：explore 默认 thinking `low`；ranking.md §3.1 同 — skills/rope-harness-presets/references/{role-schema,ranking}.md
- 本机 preset：~/.pi/agent/agents/rope-explore.md（thinking: low，正文 Mode contract/两套输出未按简报切换）；manifest ~/.config/rope/harness/pi.json
- 执行规则已有父侧纪律但被违反：execution-rules.md Parent/Leaf Contract（纠偏=重写简报重派；E2E fan out runner leaves/一旅程一叶）— skills/rope-go/references/execution-rules.md（2026-09-29 审计：两 session 父自写码、runner 零有效证据）
- 先例证据：superpowers（有界重派+能力升级+禁历史累积）、trellis（findings 落盘+只报路径）、gsd（计划即提示词+frontmatter）、mattpocock（research skill 通用契约）— .rope/research/dispatch-precedents/*.md（2026-09-29）
- ponytail 先例阶梯与"未验证行业断言不得作决议依据" — .rope/research/ponytail-prior-art-ladder.md
- 回归审计与 E2E runner 断链证据 — .rope/research/grill-research-coverage-regression-audit.md（2026-09-29 修正版）
- 切片机器已存在：gates-and-vocab.md 粒度硬规则（demo path/上下限/two-stage/consumer sweep）与 ADR 0011 item 6 — skills/rope-shape/references/gates-and-vocab.md
- 仓库测试为结构冒烟（frontmatter/相对引用解析/CLI 安装）— tests/smoke.test.mjs；routes.md 由测试回写
- solo 执行豁免先例：finer-grained-parallel-execution-rules（2026-08-27，"solo mode per user waiver"）— .rope/issues/finer-grained-parallel-execution-rules/tasks.md
