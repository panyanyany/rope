# 2026-09-16—23 Agent Workbench E2E 会话抽样

只读抽样真实 pi JSONL 与其派生 worktree/issue。JSONL 行号是事件定位；message 内文本为用户/工具/assistant 事件摘录。没有将关键词缺席解释成“未做”。

## 对照实例

### 2026-09-21 `/clear` 修复：确实做最终 E2E，但不是实时钉钉客户端

- 父 session：`/home/wufei/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-fix-clear-context-not-cleared--/2026-09-21T03-43-40-284Z_01a0c20f-f2fb-7387-810a-df5439c95eea.jsonl`。行 220 记全量测试冻结点新增失败 0；行 221 明确“然后做 E2E”；行 224 开始 E2E；行 247 明确 PASS：真实模型、真实 sqlite、legacy 归档/新 session `history_messages=0`；行 255-256 用户追问后答复明确“没有用 dws，也没有启动测试钉钉栈”，从 submitter seam headless 注入。
- 同 session 行 264 指向 worktree `/home/wufei/orca/workspaces/agent-workbench/fix-clear-context-not-cleared`，issue `.rope/issues/dingtalk-clear-legacy-chat-scope/`；说明单切片 rope-quick、父会话内联、无并行叶子。行 251–253 有 E2E 记录/提交/结案证据。
- reviewer/implementer：单人单 session quick 流程，无独立 reviewer/implementer 派生；不是所有 E2E 都需要/有代理。
- 失败与跳过：行 161、191 可见依赖缺失造成导入失败；补依赖后相关套件全绿（204）。冻结全量 4372 项报告 8F+150E、26 skipped，但新增失败 0，明确归为基线环境缺口（219-220），不是静默报绿。真实 E2E 另记 PASS（247）。

### 2026-09-18 thinking stream：E2E 证据来自真实模型快照，后续有复审

- 主 session：`/home/wufei/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-feat-thinking-stream-and-working-shimmer--/2026-09-18T14-16-52-673Z_01a0b4e0-96c1-742a-bb4d-49c250b46729.jsonl`。末段复审记录指出 E2E 观察到正文 delta 仍携带 thinking 全量快照；行 17–19 同组 sidechain 可定位单测命令及 63 tests OK，复审 verdict PASS，并列两项 note（重复 message_end、空白 text 边界）。
- 对应 worktree `/home/wufei/orca/workspaces/agent-workbench/feat-thinking-stream-and-working-shimmer`，issue `.rope/issues/webui-thinking-stream-working-row/`（同 session 事件中的提交 diff 直接指向该 issue）。
- 真实运行类型：可证实真实模型事件形态/持久化快照驱动修复；复审明确“未起服务栈”（sidechain 输出末尾 probe log）。证据不足以认定使用真实浏览器或真实钉钉客户端；该会话显示的是后端投影事件回放/单测，不等于 UI browser E2E。
- 并行：可见父/sidechain reviewer 活动；此为 reviewer 派生复核而不是 implementer 并行切片。主窗口是否启动栈：审查者明确未启动；不能据此推断其他执行会话从未启动。
- 失败/跳过：复审记录原始 E2E 缺陷如何复现，随后加入回归用例；63 项通过。没有看到该样本记录全面端到端钉钉通过。

### 2026-09-18 legal-finance UI：不能把测试断言当真实 E2E

- Session `/home/wufei/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-fix-webui-frontend-issues--/2026-09-18T07-01-58-971Z_01a0b352-6e3b-75db-8af3-988d68429313.jsonl` 行 18–22 是针对 legal-finance issue 的源码/契约检查和 Vitest fixture 证据；未见可定位的真实浏览器访问或钉钉发送证据。issue `.rope/issues/legal-finance-ai-employees/`，tasks 中 Slice 10 的 E4 real Admin probe 明确标成 `blocked_on readiness 票`（该 session 行 21 引用）。
- 结论是“本次检查未观察到真实浏览器/钉钉运行”，不是断言全周无人运行；文档显示该项受 readiness 阻塞，不能称真实 E2E 已完成。

## 汇总判断

- 最终 E2E 确有实例：clear 修复由主 session 完成 headless submitter 注入 + 真实模型/SQLite，明确没有测试钉钉栈/dws；它证明业务路径，不证明实际客户端 UI。
- Reviewer/implementer 派生并非固定：clear 是 quick 单会话；thinking stream 样本可见独立复审 sidechain。不要将 reviewer 复审混作并行 implementer。
- 主窗口启动测试栈不能统一回答：clear 明确未启动；thinking reviewer 明确未启动；其余未观察到不能推断确实没有。
- 失败/跳过有明确记录的实例会分层记录：导入依赖问题、冻结基线失败/skip、新增失败差分、最终 E2E PASS 分开陈述；E4 readiness 阻塞亦明示，而非伪装通过。

## 不确定

- 时间范围内实例很多，本报告是代表性对照，不是全量统计；JSONL 行含压缩/工具输出时，行号定位的是事件而非原生源码行。
- 未对所有约 55 个对应 session 逐个审阅；真实浏览器、钉钉用户确认以及主窗口启动栈的总体频率未知。
- 2026-09-18 样本中的 E2E 初始触发究竟是线上真实浏览器还是日志/快照输入，现有可读事件足以确认真实模型形态，不足以确认真实浏览器操作。

## 补充：系统性范围、full-issue 路径及 UI 判据（2026-09-23）

### 总体枚举与分层（范围限定：Rope agent 模式）

- 用户范围决定：本次结论只讨论 Rope 的 `agent` execution mode；dynamic workflow/kernel 不调整，也不纳入本研究推论。样本的 agent-mode 判定依据是 session 内实际 rope-go/quick 父窗口以 Agent 派发/quick 内联路径执行，而不是只凭仓库全局配置推定。原始 session 中可见 `.pi` 配置含 dynamic/kernel 文本，不代表该 issue 本次走该模式。
- 枚举口径：只取 `/home/wufei/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-*/` 下文件名日期 2026-09-16 至 2026-09-23（含两端）的 JSONL；共 **44 个文件**。按启动日期：09-17=1、09-18=19、09-19=1、09-20=4、09-21=17、09-22=2；09-16/23=0。剔除不是主会话的显式 leaf/reviewer/standards/研究提示，并将同一 issue 的 parent、叶子及同启动时刻相邻文件合并为同一 issue episode；44 是原始文件数，不是 issue 数/独立工作项数。
- 按提示词身份、工件内容分层：44 中有一批只读调研/生产取证/标准扫描/专项 reviewer 文件，不是 go 主窗口；识别到本周至少 3 个 agent-mode 工作 episode（含 full issue 与 rope-quick，不能统称 full go/verify/finish）：`webui-desk-h3yun-tool-execution`（09-20，rope-quick inline）、`model-management-effort-control`（09-21/22，agent dispatch）、`dingtalk-clear-legacy-chat-scope`（09-21，rope-quick inline）。`webui-conversation-flow-fullstack` 的 verify 日期为 09-15，不纳入本周。`legal-finance-milestone` 的 09-18 全量验收报告是前置验收/缺陷发现，09-20 h3yun 修复是 follow-up，不重复计作另一个 full issue。
- 证据优先级：真实 UI 仅在 session 有浏览器交互事件（Agent Workbench URL、snapshot/locator/click/fill 等）并且服务启动/端口/stack 证据相互印证时计入。仅 `e2e`/`browser` 字样、fixture/unit test、`e2e.md` 声称 PASS 均不单独当现场运行证据。

### 代表性 full issue 对照（均按上述 agent-mode 口径；不涵盖 dynamic/kernel）

1. **真实 WebUI 浏览器 + 测试栈，reviewer 补做 E2E：模型管理/effort**
   - go 主 session `/home/wufei/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-feat-model-management-effort-control--/2026-09-21T07-21-25-129Z_01a0c2d7-4d89-74e3-a908-ed5d09179525.jsonl`。行 1552 起真人浏览器操作，1459/1467/1481 对 5274 设置页快照/选项/保存；1557 进入 desk；1577、1634、1660–66 发送并检查真实模型响应及 thinking 展示；220 截图落盘。主窗口明确自己启动标准测试栈：行 124–126 有 Vite/API 启动输出，栈 sqlite 为 test-dingtalk-stack（会话行 21/22 的栈脚本说明 DingTalk listener 亦启用）。这是真实浏览器 UI + 本地真实模型端点，不是仅模拟器。
   - reviewer 派生证据：`.../feat-model-management-effort-control--/2026-09-21T10-18-51-878Z_01a0c379-c266-74e3-a908-ed6d023bf530.jsonl` 顶部用户任务标明 `rope-reviewer` 行为验收叶且允许启动/HTTP/浏览器；其行 1491 明确 reviewer 自建真实 sqlite/API 做 agent turn。reviewer 在主流程之后做额外真栈验证，非 implementer。后续 reviewer 补验 session `/home/wufei/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-feat-model-management-effort-control--/2026-09-22T02-35-09-806Z_01a0c6f7-966e-74e3-a908-ed742c3ff3d7.jsonl` 行 9、45–50、124、216 等：启动个人测试栈、浏览器操作。issue `.../feat-model-management-effort-control/.rope/issues/model-management-effort-control/e2e.md`（该 session 行 14 提供文件内容；行 351 写 e2e.md，行 371 总结三段补验通过）。区分：是“有 reviewer 并实际跑 UI E2E”，且不只主窗口跑栈，reviewer 也自起栈。
   - 风险记录也保留：同一 reviewer session 行 1475/1614 有 locator/JS 操作失败；不能只引用通过截图而漏掉失败/重试。

2. **真实 WebUI 浏览器 + API/前端/DingTalk listener 测试栈；此前 reviewer 无法覆盖特定真入口，主窗口补跑：desk h3yun 工具**
   - Session `/home/wufei/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-fix-webui-desk-tool-registration--/2026-09-20T02-53-13-617Z_01a0bcbb-6810-77b0-96ae-add288445a89.jsonl`。行 11 是 full issue follow-up（源报告 `.rope/issues/legal-finance-milestone/e2e-webui-full-20260918.md`）；行 206–216 显示启动 `scripts/start_real_stack.sh`、API + DingTalk Stream listener + frontend；行 217/219 起浏览器到 `127.0.0.1:5273/desk/finance_agent`；行 235–255 输入真实问题并看到 h3yun.query 与回答；行 261–270 记录日志和停止自启动进程。对应 worktree `/home/wufei/orca/workspaces/agent-workbench/fix-webui-desk-tool-registration`，issue `.rope/issues/webui-desk-h3yun-tool-execution/`（行 305 为 PRD 标题）。这属于浏览器真实 UI + 真实集成栈，钉钉 Stream listener 启动但事件证据主要是 WebUI，不等于真实钉钉对话实测。
   - 派发链：行 116/125 明示 shape 后选 rope-quick 单独修复/E2E；没有独立 reviewer 执行 E2E 的证据。行 280 有完成报告。这个例子说明“有测试栈/真实 UI”不自动表示 reviewer 做了 E2E。
   - 对照原报告：行 15/46 是 09-18 full WebUI 验收报告，列 13 过 1 缺陷；09-20 follow-up 的浏览器操作对该单缺陷复测。报告里已有的旧 E2E 和 follow-up 修复不能混为一次全新完整验收。

3. **专项真实入口仍被阻塞，不能据审阅/单测推断 E2E 已完成：legal-finance**
   - 主 go/验收样本 `/home/wufei/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-wayfinder-legal-finance-ai-employees--/2026-09-18T09-06-24-743Z_01a0b3c4-5967-71a4-be3a-3d4669cc0287.jsonl`。对应 issue `.rope/issues/legal-finance-ai-employees/`，任务合同中 Slice 10 E4 real Admin probe 标为 readiness gate 阻塞；之前汇报已从同 session 取到 tasks 内容（行 21 tool result）。单凭 reviewer/源码审阅、fixture tests 不构成 E4 浏览器运行。其 `e2e.md`/`verify.md` 在该 worktree 的可见内容未确认，因此不把未知文档状态写成未执行结论。
   - 后续 full 验收报告 session `/home/wufei/.pi/agent/sessions/--home-wufei-orca-workspaces-agent-workbench-fix-webui-desk-tool-registration--/2026-09-20T02-53-13-617Z_01a0bcbb-6810-77b0-96ae-add288445a89.jsonl` 行 15/46 确认 09-18 有真 WebUI full E2E，但有一 High defect；缺陷修复才由 09-20 主窗口补测。此处“review 有/无”的判断须对准每个 issue 的角色派发，不可把全量 E2E 报告的存在反推为某个 reviewer 执行。

4. **full issue 中 review required 但无专用 reviewer：明确未派/降级，不等于已执行**
   - `webui-channel-integration` 的 verify 工件由 worktree 文件 `/home/wufei/orca/workspaces/agent-workbench/wayfinder-legal-finance-ai-employees/.rope/issues/webui-channel-integration/verify.md:806-810` 明记所有 `Review: required` 切片均 `review_degraded: no_specialized_review_subagent_available`；同文件 799–800、809 说真实 DingTalk/WebUI E2E 是用户确认，E10 后由用户确认真实 E2E 通过后改 PASS。这是“reviewer 未专门派出/资源缺失，真实 UI 证据由用户 gate”而非 reviewer browser run。但 issue/worktree 内容日期跨期，不能证明这一轮 09-16—23 新派发；故仅作 dispatch 模式对照，不纳入本周 full issue 分母。

### 对“本周有无真实 UI”结论的边界

- “本周没有真实 browser”是错误的：至少模型管理 full issue 与 desk-h3yun follow-up 有浏览器 tool transcript（localhost 页面、snapshot/click/fill、页面结果/截图），并有测试栈启动日志可交叉验证。
- “本周真实钉钉客户端通过”仍不能普遍断言：stack banner 确认 DingTalk listener 启动只证明组件起跑；需看到真实钉钉 callback/发送/用户确认作为该行为的证据。clear case 明确 headless，无此证据；h3yun session 的可核验行为是 WebUI。
- 统计口径严格限定：44 个主目录匹配文件中的日期样本；剔除根据用户任务头确认为 leaf 的研究、review、standards、生产取证。相邻 UUID/同毫秒文件、同 issue 多轮 worktree session 按一个工作 episode 计，而不是独立 issue。由于 session 行为可能以 sidechain 事件嵌在主 JSONL、且 worktree 文件时间跨区间，不能从 44 直接推算全仓所有 full issue 数。此处对照含 full issue、quick 与旧 issue 的 follow-up；跨期 `webui-channel-integration` 仅为角色对照，不计本周。
- 枚举核验用文件名日期计数而非全文 bulk dump；UI 搜索依据不是关键词命中：逐事件检查 `Agent Workbench http://127.0.0.1:*`、`Origin:`、可访问性 snapshot、点击/填充、HTTP/页面响应、保存截图；栈证据检查 `start_real_stack.sh`/Vite/API 端口、日志与 stop 记录。对未出现上述组合的 session 仅标“未观察到 UI 运行”，除非存在明确的 waived/blocked/not-run 工件才标“确实未做/被阻塞”。

### 修订后的关键差异

- 验收执行者并不一致：模型管理由主窗口先走真实 UI、rope-reviewer 再自建栈补验；h3yun follow-up 是 rope-quick，由主窗口启动完整栈和浏览器验证；clear 是单会话 headless；legal-finance Admin E4 的 readiness gate 使特定探针不能算完成。quick 与 full issue 不应混为同一角色调度频率。
- 测试栈归属：clear 明确没有启动测试钉钉栈；模型管理由主窗口与 reviewer 分别启动栈；h3yun 可证主窗口启动完整栈，但未证明 reviewer 起栈。
- 失败/skip/blocked 均需看逐项工件：模型 reviewer 浏览器交互有失败后重试；clear 冻结测试的既有失败/skip 与最终 headless E2E 分栏；legal Admin E4 readiness blocked；h3yun 旧 full run 的 High 缺陷与 follow-up 修复复验分别记录。
