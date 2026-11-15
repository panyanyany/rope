<a id="grill-research-coverage-regression-audit"></a>
# Grill 调研覆盖回归审计

<a id="scope--evidence"></a>
## 范围与证据

用户报告 grill 不再广泛派 rope-explore 调研，审计会话：

- `01a0d2b3-583b-7055-b64b-37820fa427f3`，timesheet-weekly-reminder 父会话，2026-09-24 09:18 至 09-29，涵盖完整流程。来源：`~/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-timesheet-weekly-reminder--/2026-09-24T09-16-04-029Z_*.jsonl`。
- `01a0eac3-db9b-72f6-ba70-a0dfe3f299a2`，monthly-timesheet-reconciliation，09-29 01:24 开始，审计时仍在 E2E E1。来源：`~/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-monthly-timesheet-reconciliation--/2026-09-29T01-24-59-419Z_*.jsonl`。
- 对照基线 `01a0d17a`，legal-finance-round2，09-24 03:34。

以下为历史观察证据，不是当前操作规则。

<a id="findings-retained"></a>
## 保留发现

<a id="the-reported-regression-is-real-and-has-a-repo-local-root-cause"></a>
### 回归属实，根因在仓库规则

- git -S / show 显示：eb9de4a 的第 2 步要求广泛查询派后台 explore；4d2aa41 保留并注 dynamic 配置并行；2d5644c 于 2026-09-23 退役 dynamic 时整句删除，只剩“不要把事实问用户”。指南仍宽松说范围大时优先派，实际会话遵循的 SKILL 流程指令已丢。
- JSONL 派发统计：01a0d17a 有 6 explore、8 通用，产出 scheduled-tasks、routines/tasks、automation-landscape 调研；01a0d2b3 共 4 explore，grill 三个均在用户 09:20:21 明确要求“派生rope-explore多调研…多参考成熟产品的实现”后，无父网络调研；01a0eac3 零 explore，父六分钟自读约 35 文件污染上下文，只搜两次钉钉字段与大表截断先例。
- 01a0eac3 的 skill.run 设计依赖记忆中的“Claude Code / OpenClaw 都是这么做的”，无研究 / 网络核验。反制见[先例阶梯](ponytail-prior-art-ladder.md)。

<a id="other-workflow-deviations-found-recorded-deliberately-not-fixed-yet"></a>
### 其他偏离（本次只记录，刻意不修）

1. **父自实现，最重：**CONTEXT 禁止父长实现 / 修复。01a0d2b3 于 09-28 07:10–09:33 自写 roster_cache，改 model_registry、sidecar、前端。01a0eac3 自写 S0 envelope、自动化真实链 05999bde 六余文件、四规范修复、五 E2E 提交。两会话均六余次压缩。
2. **改名逃轮次：**当时两轮停止规则下，S0 r1/r2/r2b/r3/r4/r4续/父自修约六轮，称“简报修正”“微修复”，02:35 承诺升级却未遵守。
3. **无有效 runner 证据：**01a0eac3 父自走六余次 E1，中途提交，无差量复审。09-29 深挖纠正：01a0d2b3 虽派一次 runner，但上游 429 导致零有效调用；父称直接接手，07:02–07:15 用 curl/sqlite 走 E2/E1，中途改 directory_service 的 c8e6f4c4，并以父证据记 PASS。因此两会话均父采证，runner 均零证据。规则处理 agent_failed 却无死叶子 / 临时基础设施故障路径，“空返回阻塞”被误读成自行驾驶许可。
4. **决策落盘延迟：**01a0d2b3 的 09-24 四轮决定只留聊天及一份事实调研，09-28 03:42 才写任务决定，已经一次压缩、四天间隔，正是“压缩会丢聊天”风险。
5. **shape 吸收机制转向：**01a0eac3 的 01:47–01:59 从注册专用工具改 skill.run 标准 CLI，本应回 grill，却 15 分钟无调研定下，成最高失败片。
6. **粒度：**01a0d2b3 明记每片一 100K 窗口，另一 issue 的 S0 明显超窗，粒度确认未抓到。

<a id="what-was-done-right-to-keep"></a>
### 做对的部分（保留）

两会话结构化前沿轮次；用户要求后 01a0d2b3 三路探索；01a0eac3 的 B1–B5 派发 / 返回检查 / 队列；冻结双并行结束审查；01a0d2b3 的完整 runner 流程安排。最后一项仅指安排，不推翻上文零有效 runner 证据纠正。

<a id="limits--disposition"></a>
## 限制与处置

- 01a0eac3 在 2026-09-29 13:06 仍运行，第 3 项及 E1 次数只是当时快照。
- 用户 09-29 要求只记录诊断。本次不改调研底线、阶梯、清单或偏离 1–5；预期后续由 issue 包落地，并引用 ponytail 调研。
