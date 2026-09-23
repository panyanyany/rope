# Agent 模式 E2E 验收阶段 E2E

## E1 产品树整合结构检查

Architecture evidence: D1/D2/D3 —— execution-rules/role-schema 与 ADR 0015 / CONTEXT 词条一致
Mechanism: file-inspect
Executor: agent
Risk: local-readonly
Gate Decision: not-required
Scope: `skills/rope-go/`（SKILL.md、execution-rules.md）、`skills/rope-harness-presets/references/`（role-schema、agent-templates、manifest-schema）、`skills/rope-verify/references/verify-rules.md`
Command or Steps:
- execution-rules 含 "E2E Acceptance Stage" 段：前置、项目声明栈、旅程并行/串行判据、journey brief 模板、修复回环、交付门（agent_passed/user_confirmed/waived）
- execution-rules 审查段与 SKILL.md 步骤 1/4：reviewer code-only、无产品启动残留句
- role-schema 四角色表 + rope-e2e-runner 行；agent-templates 含 runner 种子、reviewer 种子无产品运行；manifest-schema 四角色键
- grep 旧契约残留：`only leaf allowed to start/stop`、`Starts the product first`、`rope-e2e/SKILL.md` 零命中
- verify-rules/finish-checklist diff：仅一处引用行变化，规则零变化
- `node --test tests/*.test.mjs` 回归
Pass Criteria:
- 上述结构项全过；交叉引用（execution-rules ↔ ADR 0015 ↔ CONTEXT ↔ role-schema ↔ routes）闭合；quick/dynamic 契约文件零改动
Failure Report:
- 列出缺失/残留项与文件行号
Forbidden Out-of-Scope Actions:
- 写 `~/.agents/skills/`、`~/.pi/agent/agents/`、`~/.config/rope/`
Result:
- agent_passed（2026-09-23，重跑）：E2E Acceptance Stage 段成文（含模板与门）；SKILL.md 步骤 1 code-only、步骤 4 E2E 阶段；role-schema/agent-templates/manifest-schema 四角色；旧契约句零残留；verify-rules 仅一处引用行；finish-checklist 零改动；node --test 68 用例全绿。（首轮针对独立 skill 方案的检查随范围纠正作废）

## E2 用户确认整合结果（全局安装前置）

Architecture evidence: 仓库 AGENTS 约定 —— 全局 skill 先本地改、确认后安装
Mechanism: judgment
Executor: user
Risk: human-judgment
Gate Decision: user-run
Scope: ADR 0015 + execution-rules E2E 段 + harness-presets 角色改动 + CONTEXT 词条
Command or Steps:
- 用户通读整合结果，决定接受/修改意见/否决
Pass Criteria:
- 用户明确接受（或给出修改意见后修订再审）
Failure Report:
- 用户指出条款缺口或措辞问题
Forbidden Out-of-Scope Actions:
- 未经确认写 `~/.agents/skills/`、`~/.pi/agent/agents/`、`~/.config/rope/`
Result:
- pending
