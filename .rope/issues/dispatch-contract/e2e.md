# 派发契约规则修订 E2E

真实环境行为 only：真实 CLI 入口、真实本机 preset 工件。文本 diff 检查属 review，不在此重复。

## E1 安装产物含新规则文本

Architecture evidence: B1/B2/B4/B6（规则文本经真实安装入口可见）
Mechanism: cli
Executor: agent
Risk: local-write（临时目录）
Gate Decision: not-required
Approved Action: —
Scope: 临时目录安装目标
Command or Steps:
- `node bin/rope.js add`（或等效安装命令，以 tests/smoke.test.mjs 的安装路径为准）安装到临时目录
- 对安装产物 grep 新规则标记：rope-grill 含 Research Floor 派生指令；rope-go 含父不自写硬规则；rope-shape 含 PRD 调研兜底
Pass Criteria:
- 安装成功且三处标记全部命中
Failure Report:
- 记录安装输出与缺失标记
Forbidden Out-of-Scope Actions:
- 写 ~/.agents/skills（全局安装不在本 issue）
Result:
- pending

## E2 本机 preset 重生成工件

Architecture evidence: B7（thinking medium + 新输出契约）
Mechanism: file-inspect
Executor: agent
Risk: local-write（用户级 pi agents 目录，approved gate）
Gate Decision: approved（2026-09-29 用户确认仅落本地）
Approved Action: 按 rope-harness-presets 幂等重生成 rope-explore preset
Scope: ~/.pi/agent/agents/rope-explore.md 与 ~/.config/rope/harness/pi.json
Command or Steps:
- 执行 preset 重生成（遵循 skill 幂等覆写规则，不触碰非 rope-* 文件）
- 检查 frontmatter `thinking: medium`、正文含两套默认输出契约与 unknowns 纪律
Pass Criteria:
- frontmatter 与正文检查全过；manifest 记录同步
Failure Report:
- partial_write 路径清单（pi-adapter 错误类）
Forbidden Out-of-Scope Actions:
- 删除或改写非 rope-* preset；改动 settings/models
Result:
- pending

## E3 下一真实 grill 会话的主动派生行为

Architecture evidence: B1（门槛分级的实际生效）
Mechanism: judgment
Executor: not-run
Risk: human-judgment
Gate Decision: not-run-waived
Reason: 需要下一个真实 grill 会话观察"未加指令即主动并行派调研"，属使用期观察，本 issue 内不可执行；审计基线已记录现状（0–3 次派生、需用户推动）供对照。
Result:
- not_run_with_reason（后续使用观察）
