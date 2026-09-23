# Agent 模式 E2E 验收阶段 Tasks

Execution mode: shared   # 文档/技能文本改动，无 worktree 需要；用户指定父窗口直接开发（2026-09-23）

## Graph summary

初始 ready：1（Slice 1）；层宽 [1,1,1]；最长 gating 链 3 层。
Slice 2/3 消费 Slice 1 的 ADR/词条词汇（seam-required）。数字为手工推导
（agent 派发，无 kernel explain）。

范围修正（2026-09-23 用户纠正）：不另做 rope-e2e 独立 skill；整合进
rope-go review 阶段；harness-presets 加 rope-e2e-runner 角色；verify/
finish 不改规则（仅修一处过时引用）。原独立 skill 草稿已删。

## Behavior Matrix (issue behavior spec — BDD)

| Behavior (Given/When/Then) | Applies? | Verified at |
| --- | --- | --- |
| Given 审查 approve、e2e.md 有待验项，When 进入 E2E 阶段，Then 先栈就绪再派 runner，每个必需旅程有独立执行证据 | yes | Slice 1-3 file-inspect + 用户 judgment |
| Given 项目声明入口（浏览器/钉钉/CLI），When runner 验收，Then 走用户实际入口；内部注入只记集成证据 | yes | Slice 2 file-inspect（execution-rules 条款） |
| Given 多条旅程，When 调度，Then 互不争用并行、共享账号/可变状态串行 | yes | Slice 2 file-inspect |
| Given 某必需旅程失败或环境不可用，When 汇总，Then 阻塞交付，仅用户明确豁免可结案且状态标未验证（成功证据=agent_passed/user_confirmed） | yes | Slice 1（ADR 0015）+ Slice 2（execution-rules 门） |
| Given E2E 缺陷修复合入，When 复验，Then 代码 delta 复审 + 栈更新到新提交 + 重跑受影响旅程与共享入口检查 + 旧证据标注提交 | yes | Slice 1+2 file-inspect |
| Given quick / dynamic 路径，When 本轮改动落地，Then 两者契约文本零变化 | yes | Slice 1/3 file-inspect（diff 范围检查） |
| 行为兼容：现行 ADR 0007/0010 未被本轮改动的部分（机械聚合、两叶审查、delta 复审）语义不变 | yes | Slice 1 file-inspect（ADR 0015 明示继承范围） |
| rope-verify / rope-finish 规则文本零变化（verify-rules 仅一处过时引用修正） | yes | Slice 3 file-inspect（diff 检查） |

## Slice 1: 架构记录——ADR 0015 与 CONTEXT/routes 词条

- Status: done（2587014；2026-09-23 补 user_confirmed 门措辞与 Consequences 落地状态后随整合提交更新）
- Kind: vertical
- Goal: 维护者与父窗口读 `.rope/` 即可说出 agent 模式 review→E2E→verify 的完整规则
- Demo path: 打开 CONTEXT.md 搜 "E2E Runner"，能答"审查通过后谁起栈、谁跑旅程、不过怎么结案"
- Blocked by: none
- Scope: `.rope/adr/0015-agent-mode-e2e-acceptance-stage.md`（新）、`.rope/CONTEXT.md`（三处词条）、`.rope/routes.md`（一条路由）
- Owned files: 上述文件
- Size cap: ADR ≤120 行；CONTEXT 净增 ≤2 词条 + 2 处改写
- Matrix rows: 1, 4, 5, 6, 7
- Constraint IDs: D1, D2, D3
- Required evidence: S1-E1（行 4/7）ADR 0015 含取代范围与继承清单；S1-E2（行 1/5）CONTEXT 词条与 ADR 互指一致；S1-E3（行 6）diff 显示 quick/dynamic 相关文件零改动
- Public behavior: `.rope/` 内 agent 模式 E2E 阶段的权威规则齐备且无自相矛盾
- Tests: file-inspect（人工通读 + grep 交叉引用）
- Implementation notes: ADR 0015 明确"部分取代 0010 规则 2、扩展 0007"；Real-Environment Walk 词条仅加 dynamic 限定
- Verification: 交叉引用 grep 闭合
- Stop conditions: 发现第三个权威来源与设计冲突 → 停，回报用户

## Slice 2: rope-go 整合（execution-rules E2E 阶段 + SKILL 收口）

- Status: done（见 Final Status 提交；含删除 `.agents/skills/rope-e2e/` 与 routes/ADR/CONTEXT 引用同步）
- Kind: vertical
- Goal: rope-go 父窗口按 execution-rules 即可在 review approve 后执行整个 E2E 阶段，无独立 skill
- Demo path: 对一份示例 e2e.md 按 execution-rules "E2E Acceptance Stage" 段走，能产出旅程 brief、证据记录与交付门结论
- Blocked by: Slice 1 (seam-required: ADR/词条词汇)
- Scope: `skills/rope-go/references/execution-rules.md`（审查段 code-only、新 E2E 阶段段、状态门收紧、Handoff 前置、journey brief 模板）、`skills/rope-go/SKILL.md`（Final review 步骤）、删 `.agents/skills/rope-e2e/`、`.rope/routes.md` 引用改向
- Owned files: 上述
- Size cap: E2E 阶段段 ≤60 行；brief 模板 ~20 行
- Matrix rows: 1, 2, 3, 4, 5
- Constraint IDs: D1, D2, D3
- Required evidence: S2-E1（行 2/3）execution-rules 含项目声明入口、并行/串行判据、栈父窗口独占；S2-E2（行 4/5）含全必需项门（agent_passed/user_confirmed/waived）、豁免记录、修复回环；S2-E3（行 1）journey brief 模板含证据字段与只读/no-spawn 边界；S2-E4 SKILL.md 步骤 1/4 与 execution-rules 一致
- Public behavior: rope-go 执行文本即完整 E2E 阶段契约
- Tests: file-inspect + `node --test tests/*.test.mjs`
- Implementation notes: reviewer brief 删 entrypoint 提示（reviewer 不再跑产品）
- Verification: 交叉引用 + 术语与 ADR 0015/CONTEXT 一致
- Stop conditions: 与 kernel/dynamic 契约文本冲突 → 停，回报

## Slice 3: harness-presets 第四角色与 reviewer 收窄

- Status: done（见 Final Status 提交）
- Kind: vertical
- Goal: harness 写手按 role-schema/agent-templates/manifest-schema 可生成 rope-e2e-runner preset，reviewer 职责同步收窄
- Demo path: 读 role-schema 角色表，能答"四个角色各做什么、runner 为什么是第四叶"
- Blocked by: Slice 1 (seam-required)
- Scope: `skills/rope-harness-presets/references/role-schema.md`、`agent-templates.md`、`manifest-schema.md`；另 `skills/rope-verify/references/verify-rules.md` 一处引用修正
- Owned files: 上述
- Size cap: 新增内容合计 ≤80 行
- Matrix rows: 1, 8（行 8 含 verify/finish 零规则变化）
- Constraint IDs: D1（runner 与 reviewer 职责切分）
- Required evidence: S3-E1 role-schema 四角色表 + 命名段；S3-E2 agent-templates 含 runner 种子且 reviewer 种子去产品运行；S3-E3 manifest-schema 四角色键；S3-E4 verify-rules/finish-checklist diff 仅一处引用行
- Public behavior: preset 生成源齐备
- Tests: file-inspect + `node --test tests/*.test.mjs`
- Implementation notes: "No fourth agent name"段改写为 runner 有意第四叶 + research 仍是 explore 模式
- Verification: grep 旧"only leaf allowed to start/stop processes"等句零残留
- Stop conditions: 与 ADR 0011 explore 模式约束冲突 → 停，回报

## 末尾审查（记录）

- Round 1（2026-09-23，独立 skill 方案）：**approve**（单叶只读，rope-reviewer；无产品可跑，两叶拆分理由不适用，偏差已记录）；1 note（runner 工具面补 agent_browser_action/qa）已应用。该方案随后按用户范围纠正整体替换，不作为本轮交付 verdict。
- Round 2（2026-09-23，整合方案）：**approve**（单叶只读，rope-reviewer，代码两轴合并；纯文本改动无产品可跑，偏差同上）；1 note（manifest 示例 JSON 尾逗号，先于本轮存在）已于交付前应用。①-⑤逐点对照无加严/放宽；旧契约句零残留；verify 仅一行引用修正、finish 零改动；交叉引用闭合；修复回环与 ADR 0015 第 5 条一致。
- 修复轮次: 0（Round 1、Round 2 各自零阻塞发现）

## Follow-up（需用户确认后执行，不属于本轮代码改动）

- 全局安装：`skills/` 树变更同步到 `~/.agents/skills/`（rope-go、rope-harness-presets、rope-verify 文档）；regenerate presets：`rope-reviewer.md` 收窄版 + 新增 `rope-e2e-runner.md` → `~/.pi/agent/agents/`；manifest `~/.config/rope/harness/pi.json` 补 runner 角色行。
- rope-quick 的真实入口要求：另议题。
