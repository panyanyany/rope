# Agent 模式 E2E 验收阶段 Tasks

Execution mode: shared   # 文档 + 本地 skill 草稿，无并行 worktree 需要；用户指定父窗口直接开发（2026-09-23）

## Graph summary

初始 ready：1（Slice 1）；层宽 [1,1]；最长 gating 链 2 层 = 2 个串行轮。
Slice 2 消费 Slice 1 的 ADR/词条词汇（seam-required）。数字为手工推导
（agent 派发，无 kernel explain）。

## Behavior Matrix (issue behavior spec — BDD)

| Behavior (Given/When/Then) | Applies? | Verified at |
| --- | --- | --- |
| Given 审查 approve、e2e.md 有待验项，When 进入 E2E 阶段，Then 先栈就绪再派 runner，每个必需旅程有独立执行证据 | yes | Slice 1+2 file-inspect + 用户 judgment |
| Given 项目声明入口（浏览器/钉钉/CLI），When runner 验收，Then 走用户实际入口；内部注入只记集成证据 | yes | Slice 2 file-inspect（skill 条款存在） |
| Given 多条旅程，When 调度，Then 互不争用并行、共享账号/可变状态串行 | yes | Slice 2 file-inspect |
| Given 某必需旅程失败或环境不可用，When 汇总，Then 阻塞交付，仅用户明确豁免可结案且状态标未验证 | yes | Slice 1（ADR 0015）+ Slice 2（skill 门） |
| Given E2E 缺陷修复合入，When 复验，Then 代码 delta 复审 + 栈更新到新提交 + 重跑受影响旅程与共享入口检查 + 旧证据标注提交 | yes | Slice 1+2 file-inspect |
| Given quick / dynamic 路径，When 本轮改动落地，Then 两者契约文本零变化 | yes | Slice 1 file-inspect（diff 范围检查） |
| 行为兼容：现行 ADR 0007/0010 未被本轮改动的部分（机械聚合、两叶审查、delta 复审）语义不变 | yes | Slice 1 file-inspect（ADR 0015 明示继承范围） |

## Slice 1: 架构记录——ADR 0015 与 CONTEXT/routes 词条

- Status: done (commit 见 Final Status；证据：S1-E1 ADR 取代范围+继承清单成文；S1-E2 CONTEXT 三处词条与 ADR/routes 互指闭合，grep 命中行 47/59/79/148/169；S1-E3 git diff 仅触三文件，quick/dynamic 契约零改动)
- Kind: vertical
- Goal: 维护者与父窗口读 `.rope/` 即可说出 agent 模式 review→E2E→verify 的完整规则
- Demo path: 打开 CONTEXT.md 搜 "E2E Runner"，能答"审查通过后谁起栈、谁跑旅程、不过怎么结案"
- Blocked by: none
- Scope: `.rope/adr/0015-agent-mode-e2e-acceptance-stage.md`（新）、`.rope/CONTEXT.md`（三处词条）、`.rope/routes.md`（一条路由）
- Owned files: 上述文件
- Size cap: ADR ≤120 行；CONTEXT 净增 ≤2 词条 + 2 处改写
- Matrix rows: 1, 4, 5, 6, 7
- Constraint IDs: D1, D2, D3
- Required evidence: S1-E1（矩阵行 4/7）ADR 0015 含取代范围与继承清单；S1-E2（行 1/5）CONTEXT 词条与 ADR 互指一致；S1-E3（行 6）`git diff` 显示 quick/dynamic 相关文件零改动
- Public behavior: `.rope/` 内 agent 模式 E2E 阶段的权威规则齐备且无自相矛盾
- Tests: file-inspect（人工通读 + grep 交叉引用）
- Implementation notes: ADR 0015 明确"部分取代 0010 规则 2、扩展 0007"；Real-Environment Walk 词条仅加 dynamic 限定，不改语义
- Verification: 交叉引用 grep（E2E Runner ↔ ADR 0015 ↔ routes 条目互指闭合）
- Stop conditions: 发现第三个权威来源与设计冲突 → 停，回报用户

## Slice 2: rope-e2e skill 本地草稿

- Status: done (commit 见 Final Status；证据：S2-E1–E3 条款/模板成文，SKILL.md 71 行≤100；S2-E4 preset frontmatter 合法且工具面含 agent_browser*；quick_validate.py 本机不存在，记录跳过；`node --test tests/*.test.mjs` 68 用例全绿确认零代码影响)
- Kind: vertical
- Goal: 父窗口（或用户）在审查通过后调用 rope-e2e，即可按 ADR 0015 完成整个 E2E 阶段
- Demo path: 对一份示例 e2e.md 走 skill 步骤，能产出派发 brief、证据记录与交付门结论
- Blocked by: Slice 1 (seam-required: ADR/词条词汇是 skill 条款的引用对象)
- Scope: `.agents/skills/rope-e2e/`（SKILL.md、references/journey-brief.md、agents/rope-e2e-runner.md）
- Owned files: 上述新文件
- Size cap: SKILL.md ≤100 行（write-a-skill 规范）；brief 模板 ≤60 行预算同源
- Matrix rows: 1, 2, 3, 4, 5
- Constraint IDs: D1, D2, D3（引用，不复制）
- Required evidence: S2-E1（行 2/3）skill 含项目声明入口、并行/串行判据、栈父窗口独占条款；S2-E2（行 4/5）含全必需项门、豁免记录格式、修复回环（delta 复审+受影响重跑+提交标注）；S2-E3（行 1）journey brief 模板含证据字段与只读/no-nested-spawn 边界；S2-E4 preset 草稿 frontmatter 合法（pi 格式）且工具面含 browser/CLI
- Public behavior: skill 文本可被评审、确认后可安装
- Tests: file-inspect；quick_validate.py（如本机可用则跑，路径外部不 vendored）
- Implementation notes: 模型可触发（description 写触发分支）；宿主无独立 browser 会话时旅程降级串行并记录原因
- Verification: 结构检查（行数、frontmatter、互指）+ 用户通读
- Stop conditions: 需要改产品 skills/ 树才能自洽 → 停，回报（超出本轮授权）

## 末尾审查（记录）

- Verdict: **approve**（2026-09-23；单叶只读审查，rope-reviewer；两叶拆分的产品启动串行理由不适用——无产品可跑，偏差已记录）
- Findings: 1 note —— runner preset 工具面补 `agent_browser_action`/`agent_browser_qa`；已于交付前应用（不属于修复轮）
- 修复轮次: 0
- Matrix 复核：五点契约与 ADR 0015 Decision 1–5、SKILL.md 步骤 1–8 逐点对位；quick/dynamic 零改动属实；交叉引用闭合

## Follow-up（产品/安装轮，另开 issue；本轮 Non-goals 已声明）

- `skills/rope-go/references/execution-rules.md`：审查段去产品启动、新增 E2E 阶段约定（reviewer 只审代码；栈父窗口独占；必需项门收紧为“全过或逐项用户豁免”）；修复后复审补受影响旅程重跑条款（现行 248–277、347–364 滞后）
- `skills/rope-go/SKILL.md`：Final review 段与交接前置同步（现行 49–50）
- `skills/rope-verify/references/verify-rules.md` + `skills/rope-finish/references/finish-checklist.md`：终态口径收紧为“必需旅程通过或用户逐项豁免”（现行 25–30 / 10–17）
- `skills/rope-harness-presets/references/role-schema.md` + `manifest-schema.md`：有意新增 E2E Runner 第四角色（现行 schema 明确三角色，28–49 / 33–70）
- `rope-reviewer` preset 重生成（全局）：职责收窄为代码两轴
- 用户确认草稿后：安装 `.agents/skills/rope-e2e/` → `~/.agents/skills/`，preset → `~/.pi/agent/agents/`
