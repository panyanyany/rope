<a id="session-01a01ece-post-mortem--green-pipeline-broken-product"></a>
# 会话 01a01ece 复盘：流程全绿，产品不可用

保留历史证据与当时提案；逐片审查、verify 职责、动态模式及降级策略后来已演进，现行规则以生效 ADR / 技能为准。

<a id="question"></a>
## 问题

agent-workbench 的 `webui-staff-desk` 会话 `01a01ece-3a5f-7b43-b846-60560b71abc7` 跑完 grill → shape → go（9 片、逐片审查、TDD）→ E1 冒烟 → verify PASS，约 11.5 小时、55 叶子派发、40 多提交。通过后数分钟，用户以 admin 看不到入口、不能访问 `/desk`。漏了什么，哪些外部宿主模式能补缺口？

<a id="session-evidence"></a>
## 会话证据

来源：会话 JSONL `2026-08-20T10-23-21-711Z_01a01eb2…`（内部 ID `01a01ece…`）、`/tmp/pi-subagents-1000/…/tasks/` 的 55 个叶子输出共 18 MB、agent-workbench 的 `.rope/issues/webui-staff-desk/`。

### timeline

Fact: grill 01:06–02:00；S1–S9 实现 / 审查 02:00–09:00；E1 09:00–09:14；verify 09:14–09:27；09:27 PASS；09:46 用户报 admin 无入口 / 路由不可达；11:38 压缩；11:38–12:31 约 53 分钟修复，发现并修正三根因，真实浏览器验证。

### root-causes-all-environment-parity

Fact: 修复结论见会话 [560] 和 e2e.md：

1. 真实 registry 从未有法务 / 财务 profile；**S1–S9 全用 fixture**，无片负责落真实配置。
2. 主题 CSS 仅 neutral accent；双主题都无 `--desk-accent-legal-purple` / `finance-gold`，映射有、值无。
3. admin 建岗位会话 403；MR !43 grant 只给 admin 隐含研发面角色，S6 让 admin 见全部页签，却无人验点击能否执行。

三项是环境 / 数据一致性缺口，不是局部逻辑 bug。所有单元 / 切片 / E1 绿，因为 fixture 恰好供应代码期望的数据。

### e1-was-fixture-scoped-by-design

Fact: E1 约定启动 fixture / 本地运行时 WebUI，含给张三测试 profile；它自启 fixture registry，诚实验代码路径并通过。唯一产品真值 E2 被标 Executor user / Gate Decision user-run，推给人，后者发现不可用。

### fix-round-is-the-proof

Fact: 53 分钟修复完成此前 7.5 小时 fixture 测试未完成的验证，只多一项：启动真实 registry、构建 dist、真实认证的栈，浏览器 admin 登录、点页签、截图、发消息，几分钟显根因。代理能做产品真值验证，只是流程没要求。

### infra-overhead

Fact: 宿主故障耗约 1.5 小时：

- S1 派发 6 次因 `maxTokens 384000 > 上游 131072` 失败，改 models-store 并完整重启 pi，约 40 分钟。
- S7 遇 503 / 内容过滤误判，7 次派发、降通用、最终父自实现并记降级，约 36 分钟。
- 一叶子 720 秒中途截断，留下未提交红测试，父手动恢复。

Verified by: 会话 [163–198]、[352–418]、[209–215]。
Stability: high，本仓会话。

<a id="verified-facts-external-patterns"></a>
## 已核验外部模式

### anthropic-evaluator-clicks-through-running-app

Fact: Anthropic 长期应用宿主文章说，早期应用看似好却实际有 bug，评价者用 Playwright MCP 像人点击运行中应用，检 UI、API、数据库。默认 Claude QA 会发现真问题后说服自己“不严重”并批准，需要独立、针对怀疑性调校的评价者及逐标准硬门槛。
Source: https://www.anthropic.com/engineering/harness-design-long-running-apps
Verified by: 2026-08-22 抓取。
Stability: high。
Implication: 审查 / verify 需真实运行探测、反宽松校准、任一必修标准失败即不通过。这是当时提案输入，现行 E2E 已独立分工。

### anthropic-sprint-contract

Fact: 生成者 / 评价者写代码前约定完成契约；某 sprint 有 27 标准，发现带准确 file:line。
Source: 同文。
Implication: Rope Contract Note 已在 issue 层做投影，缺口是未说清在哪个环境观察完成。

### pulumi-self-verifying-browser-loop

Fact: Pulumi 描述 AI 构建组件、开浏览器、试交互、确认预期；无浏览器自动化就由人做。agent-browser 的紧凑快照 / ref 相比完整无障碍树省约 82.5% E2E 上下文，使循环内浏览器验证可负担。
Source: https://www.pulumi.com/blog/self-verifying-ai-agents-vercels-agent-browser-in-the-ralph-wiggum-loop
Verified by: 2026-08-22 抓取。
Stability: high。
Implication: 现场 agent_browser 可做 agent 浏览器 E2E，快照引用纪律可控成本。

### osmani-harness-ratchet

Fact: 宿主工程主张每次失误都改机制避免再犯，规则须追溯真实失败；hook 确定性约束成功静默 / 失败详细，编辑时类型 / lint / test 预检闭环。
Source: https://addyosmani.com/blog/agent-harness-engineering
Verified by: 2026-08-22 抓取。
Stability: high。
Implication: 每根因应有具名规则而非孤例；派发配置预检同属此模式。

### spec-tool-landscape

Fact: 调查含 spec-kit（轻门槛 specify→plan→tasks→implement 与 constitution）、BMAD（计划 / 开发）、OpenSpec（最小 Markdown）、Kiro（带 hook 的规范 IDE）、AgentOS（多代理 MCP）。未在所查材料发现明确真实 / 部署环境而非仅 fixture 的门槛；Anthropic 运行应用点击是当时最明确可借实践。
Source: https://medium.com/@tim_wang/spec-kit-bmad-and-agent-os-e8536f6bf8a4 及搜索。
Verified by: 2026-08-22 抓取。
Stability: medium。
Implication: 当时未找到可直接移植的环境一致性模板，Rope 需自行设计。

<a id="diagnosis--rope-gaps"></a>
## 诊断与 Rope 缺口

| # | 缺口 | 位置 | 证据 |
| --- | --- | --- | --- |
| 1 | 无真实环境 E2E 类型；user 成唯一产品真值，混机械检查与审美 | shape gates-and-vocab 执行者规则 | E1 fixture、E2 user-run，用户发现不可用 |
| 2 | shape 不盘真实 registry/config/dist/migration/seed，不分配数据落地 | shape / issue-package | 根因 1、2 |
| 3 | verify 只查结论、日期、证据目录等文书 | 当时 verify 第 3 步 | 第一轮全是文档问题 |
| 4 | 无派发预检 / 失败预算 | go execution-rules | 40 分钟配置、36 分钟重试 |
| 5 | 有真实环境仍接受 fixture-only | reviewer / tdd 反模式 | 9/9 片 fixture 通过 |

<a id="proposed-changes-ranked"></a>
## 当时提案（按优先级）

<a id="p0-1--real-env-e2e-class--user-run-decomposition"></a>
### P0-1：真实环境 E2E 与 user-run 拆分

gates-and-vocab 执行者规则：触及依赖真实配置 / 构建产物的用户界面，至少一项在真实配置、构建、认证的部署形态下运行，agent 可浏览器操作，之后才允许 verify。user 项先拆，入口可见、路由、状态码、数据等机械项交 agent；审美、2FA、私有环境留 user。

<a id="p0-2--verify-product-truth-check"></a>
### P0-2：verify 产品真值

当时建议 verify 第 3 步 / verify-rules：有用户界面的 issue 至少一次新鲜真实环境探测，agent E2E 或 inspector 开栈点击，不许只靠文书 PASS。反宽松校准要求环境证据，不以测试数量代替。

<a id="p1-1--shape-stage-environment-inventory"></a>
### P1-1：shape 环境盘点

增加问题：“功能可见需要哪些真实数据 / 配置，谁落地？”缺失则分配 data-config 片或明确真实 E2E，把用户最终发现转成 shape 时有归属。

<a id="p1-2--dispatch-preflight--failure-budget"></a>
### P1-2：派发预检与失败预算

execution-rules 当时提案：每角色首次派发前廉价探针 / 配置核对，模型解析、maxTokens 在 provider 限制内；同简报连续三次失败则停并升级；叶子中止后重派前先查 git 状态与测试状态，固化 [211–215] 的现场恢复。

<a id="p2--reviewer-anti-pattern--ratchet-maintenance"></a>
### P2：审查反模式与持续修正

TDD 反模式加入“有真实环境却只用 fixture 证明验收”，本研究作为新规则的真实失败出处。

<a id="round-2--wall-clock-accounting--upstreamcommunity-findings"></a>
## 第二轮：墙钟核算与上游 / 社区发现

### wall-clock-accounting

Fact: S1 02:00 到 verify PASS 09:27，墙钟 7.45 小时；叶子忙时合计 391 分钟，约 6.5 小时、墙钟 87%，瓶颈为串行前台叶子，非父。实现约 287 分钟、审查 65、失败派发 35；修正 / 收尾 94 分钟，约实现三分之一。仅 2/55 用后台。大叶子 S7 实现 31.6 分钟 / 130 万 token、S7 修 28.9 / 240 万、S8 27.1 / 180 万、S9 35.7 / 300 万，远超全新窗口尺寸。
Verified by: 逐派发 details.durationMs。
Stability: high。

### no-drift-execution-matched-plan

Fact: 9/9 片符合 shape，提交干净、无范围游走。真实缺陷为计划盲点：PRD 明确排除法务 / 财务 Agent Role Profile 内容装配，因此无人负责真实 profile，E1 合理用计划唯一提供的 fixture；S6 admin 见全部页签与 MR !43 admin 仅隐含研发角色冲突，两线决策未协调。
Verified by: prd Non-goals、e2e E2 修复记录。
Stability: high。

### matt-implement-spec-concurrent

Fact: 基线 9603c1c 后，上游 skills/in-progress/ 新增 implement-spec，提交 84b5ee5，最后变化 2026-08-21。工单图 / 前沿、后台最大并发、每人独立 worktree，仓库外共享探索笔记，最后整 PR 一次 code-review，所有发现交一个实现者修；稀疏指针沟通，不重复。
Source: `~/.cache/rope-upstream/mattpocock-skills@origin/main`。
Verified by: 2026-08-22 git show。
Stability: high，但技能仍开发中。
Implication: Rope 串行前台、逐片审、沟通量三轴都相反；对应表当时缺此行，可作采收候选。

### matt-agent-brief-durability

Fact: triage AGENT-BRIEF 强调耐久而非精确，不写易陈旧路径 / 行号，描述类型 / 签名 / 行为；行为而非步骤、完整验收、明确范围。to-tickets 要每片装进单全新窗口。
Source: 同克隆。
Implication: Rope 即时派发可用路径，但应采纳窗口大小规则，避免大叶子。

### anthropic-discourages-default-subagents

Fact: 当时社区分析报告 Claude Code 2.1.219+ 的 Opus 5 硬编码提示要求仅用户请求时用 AgentTool / workflow / deep-research；日常委派可能变差，含审计无法派独立审查导致非盲。
Source: r/ClaudeCode 1v6y5q2（156 评论）；anthropics/claude-code#80988。
Verified by: 2026-08-22 rdt 阅读。
Stability: medium，社区报告与二进制分析，不是官方确认。
Implication: 按上下文保护、影响范围、并行收益论证派发，不出于习惯。

### workflows-code-not-llm-for-control-flow

Fact: 社区称 Claude Code /workflows（2.1.147 后撤回）用 JS 阶段图管控制流，模型只管每步判断；子输出直接下一阶段，避免重新进入父的 token 税。替代有 agent teams、agentrelay。
Source: r/ClaudeCode 1tkjy4u（273 评论）。
Verified by: 2026-08-22 rdt 阅读。
Stability: medium，功能撤回，原则常见。
Implication: 当时可考虑把半确定性的 Blocked-by 循环移代码 runner 省父延迟；是较大架构方向，不是小改。

### actual-slice-graph-admits-two-streams

Fact: 图不是链。初始 S1/S2/S3/S7 就绪；S4/S5 依赖 S1/S2/S3，S6 依赖 S2/S3，S8 依赖 S7，S9 依赖 S7/S8。附件关键路径 S7 31.6 → S8 27.1 → S9 35.7，约 94 分钟；前端 S1–S6 约 90 分钟，与附件无边。go 却全串行。
Verified by: tasks 与叶子时长。

### mode-question-ordering-flaw

Fact: 当时 shape 第 1 步在第 9 步切图前问模式，没有波次分析且禁止自动判断；推荐串行符合规则，却没有信息依据。S1 与 S3 又重叠 types.ts/webuiApi.ts，不符合当时动态不相交要求，需先契约重切。串行适合现有切法，但从未反查切法是否支持并行。

### matt-code-review-two-axis

Fact: implement-spec 结束 code-review 是 Standards（仓库规范 + Fowler 异味）与 Spec（忠实 issue/spec）两轴，同固定基线 diff 并行代理、并列汇总不重排，只结束时一次。本地 `~/.agents/skills/code-review` 已是同技能。缺架构连续性、结论记账、修复预算 / 升级；优势是组装 diff 能抓跨片语义冲突、真实 profile 缺口，16 次逐片审结构上看不到。

### matt-timeline-first-party-numbers

Fact: Matt 2026-08-21 介绍 implement-spec：最大并发执行全部工单、最终对规范审、少监督自主交付，获 2,252 赞；后续报告 1 小时 20 分钟完成 6 工单、主上下文 120K，有待削减开销。与此处 9 片 / 7.5 小时是相近规模，但非受控比较。另有 08-18 明知可能更贵 / 不稳，仍选 LLM 委派代替手写确定性循环；08-17 人每次纠偏应改架构 / 数据结构消除再犯；08-18 grep 应返回代码而非规范计划研究噪声；08-14 用 CODING_STANDARDS.md 持续改 code-review。
Source: mattpocockuk 时间线，现场 Chrome Profile 1 cookie 与 8118 代理；搜索端点 404，只挖时间线。
Verified by: 2026-08-22 抓取。
Stability: high，一手内容。

<a id="round-2--speedaccuracy-conclusions"></a>
## 第二轮：速度与准确性结论

1. 速度是流程形态选择，不必然是子代理税。该图可并行，却 serial + per-slice；当时已有 dynamic / batch。估计相同检查、后台动态批审约 2.5–3 小时，属于估计。
2. 新功能单线程一小时可行，却也可能更快重现 fixture 绿、产品坏；应并行检查并指向真实环境，不只删检查。
3. 执行完全忠实，问题不是漂移；shape 增环境盘点与跨模块决策冲突扫描，可用一轮 grill 成本避免此类缺陷。

<a id="non-changes-validated-by-this-session"></a>
## 此会话支持保留的部分

- 父上下文保护有效：11:38 压缩丢 19 条记录后，修复仍只凭 issue 包完成，无混乱。
- S7 带证据父自实现并另审的软降级现场有效，但违反父不实现；当时建议保留窄出口与记录，不扩展正式化。此为历史处置，后续 ADR 已收紧父写入边界。
