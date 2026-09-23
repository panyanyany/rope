# Agent 模式 E2E 验收阶段 E2E

## E1 rope-e2e skill 结构检查

Architecture evidence: D1/D2/D3 —— skill 条款与 ADR 0015 / CONTEXT 词条一致
Mechanism: file-inspect
Executor: agent
Risk: local-readonly
Gate Decision: not-required
Scope: `.agents/skills/rope-e2e/`
Command or Steps:
- 检查 SKILL.md 行数 ≤100、description 含触发分支、frontmatter 合法
- grep 交叉引用：skill ↔ ADR 0015 ↔ CONTEXT `E2E Runner` 词条闭合
- preset 草稿 frontmatter（description/tools/model/prompt_mode）可解析
- quick_validate.py 可用时执行（外部工具，缺失则记录跳过）
Pass Criteria:
- 结构项全过；交叉引用闭合；无 quick/dynamic 契约文本被改动
Failure Report:
- 列出缺失/超限项与文件行号
Forbidden Out-of-Scope Actions:
- 修改 `skills/` 产品树或全局目录
Result:
- agent_passed（2026-09-23）：SKILL.md 71 行≤100，frontmatter 合法，描述含触发分支；交叉引用 skill↔ADR 0015↔CONTEXT↔routes 闭合；preset frontmatter 可解析，工具面含 agent_browser 全套（含 action/qa，审查 note 已应用）；quick_validate.py 本机不存在，跳过已记录；末尾审查 approve

## E2 用户确认 skill 草稿（全局安装前置）

Architecture evidence: 仓库 AGENTS 约定 —— 全局 skill 先本地改、确认后安装
Mechanism: judgment
Executor: user
Risk: human-judgment
Gate Decision: user-run
Scope: `.agents/skills/rope-e2e/` 草稿全文 + ADR 0015
Command or Steps:
- 用户通读草稿，决定接受/修改意见/否决
Pass Criteria:
- 用户明确接受草稿（或给出修改意见后修订再审）
Failure Report:
- 用户指出条款缺口或措辞问题
Forbidden Out-of-Scope Actions:
- 未经确认写 `~/.agents/skills/`、`~/.pi/agent/agents/`
Result:
- pending
