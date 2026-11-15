<a id="dynamic-go-harness-contract-research"></a>
# 动态 Go 宿主契约调研

日期：2026-09-11。
范围：已安装 pi 扩展与官方跨宿主接口对比，没有启动或修改目标工作流。保留动态内核退役前的历史设计证据。

<a id="finding-the-executable-host-here"></a>
## 发现：本机可执行宿主

检查对象为 `/home/wufei/Desktop/privatecode/pi-custom-subagent`，包 `@tintinweb/pi-subagents` **0.19.0**（`package.json:1,3,27-31`），HEAD `4a968b5`（2026-09-11）。检出含 agent-manager 等无关未提交变化，结论描述所读源码，不代表干净发行版或历史进程加载版本。`SubagentWorkflow` 属扩展而非 pi 核心；pi 明确不内置子代理和后台 bash，见安装目录 `/home/wufei/.nvm/versions/node/v24.15.0/lib/node_modules/@earendil-works/pi-coding-agent/README.md:15-17`、`docs/usage.md:307-309`。

可执行固定模板是普通 JavaScript：纯字面量 `export const meta` 开头，使用 `agent`、`pipeline`、`parallel`、`phase`、`log`，最终返回经 JSON 检查的数据。完整契约见 `src/workflow/tool-description.ts:25-43,63-105,199-201`；脚本不是 TypeScript，在异步上下文运行，无 fs / Node API（`:105-107`）。

pi 适配工作实质但边界窄：`WorkflowHost` 注入派生、检查执行、中止 / 控制、日志、保存脚本解析；runtime 保持宿主无关（`src/workflow/host.ts:1-20`、`runtime.ts:1-8,38-83`）。`WorkflowSpawnResult` 含 `{ok,text,error,skipped,tokens,outputTokens,structuredRetried,toolCalls,cwd,gate}`（`runtime.ts:123-166`），没有 branch/baseSha。`toSpawnResult()` 将 `text` 设为 `record.structuredJson ?? record.result`（`host.ts:121-151`），schema 输出因此刻意绕过宿主附加散文页脚。runtime 会解析 / 重新校验文本（`runtime.ts:497-523,826-835,1045-1063`），但不会补私有 worktree 元数据。Go 须把提交身份写进请求 schema，不用正则解析页脚。

<a id="concrete-mechanics-and-limits"></a>
## 具体机制与限制

- `pipeline` 按项流动，无阶段屏障；`parallel` 有显式屏障（`tool-description.ts:75-85`）。
- 并行限制是源码常量 / 参数，不仅是文字：并行默认 `workflowConcurrency()`（`runtime.ts:593`）；对外说明 `min(16, available CPUs - 2)`、生命周期代理上限 1000、单调用项目上限 4096（`tool-description.ts:115-117`）。内部有 `concurrency`、`agentCap`、`itemCap`、`nestedCap`，不自动成为脚本公开参数。核验默认 `max(1,min(16,cpus-2))`（`runtime.ts:48-50`）；父独立测得 `node:os.cpus().length` 为 16，得当时并发上限 14。这是同时调用上限，不是推荐工作量。
- 嵌套 workflow 共享并发、代理计数、中止信号和预算，最多一层（`tool-description.ts:88-89`）。
- `resumeFromRunId` 重放最长未变前缀，不恢复任意已完成调用；首个变化 / 新调用及之后均真实执行，已记录失败终止可复用前缀（`:199-201`）。这不保证副作用幂等：合并 / 检查需持久提交核验及幂等命令，前序编辑会使后续缓存失效。
- 内联脚本自动持久化；重复使用脚本放 `.pi/workflows`、`.agents/workflows` 或代理目录 `workflows`，命名工作流用同一注册表（`:46-48,88-89`；`saved.ts:166-205`）。无文件 / Node API，也无 `eval` / `Function`（`:105-107`）。保存子 workflow 由宿主 `scriptPath` / 名称解析，最多一层，共享限制、日志 / 中止、预算（`runtime.ts:184-218`）。可复用骨架须通过 `args` 内联 / 参数化图，不能导入模块。
- `gate` 是代理后执行的 shell 命令，上限 10 分钟（`host.ts:38-54`）。worktree 的 gate 须在删除前 `onBeforeWorktreeCleanup` 内运行；spawn 返回后执行会测到主树（`host.ts:8-20`）。resume 不能与 gate/schema/isolation/model/effort/agentType 混用（`tool-description.ts:63-72,199-201`），重试需全新带 gate 的验证者或明确同树命令。

<a id="worktree-identity-and-merge-contract"></a>
## Worktree 身份与合并契约

worktree 从调用者当前 HEAD 分离创建，记录 `baseSha`，保留仓库相对子目录（`worktree.ts:87-113`）。调用目录自身在 worktree 时就用其 HEAD，不自动寻找主 worktree；Go 在 worktree 中启动时，适配层须先明确集成根。

清理会提交变化，创建 `pi-agent-<id>` 分支，撞名则加后缀，再移除 worktree（`:123-179`）。分支 / 基线是私有元数据：`WorktreeInfo` 有 `baseSha`，清理只在内部返分支（`:23-29,87-113,156-174`）。公开 `cwd` 通常未设，因为结果构造前 worktree 已删除（`host.ts:57-75,121-151`）。叶子若先完整提交、保持干净，清理分支指同 SHA（`worktree.ts:139-174`）；否则清理额外提交的 SHA 是已结束叶子无法报告的。

当时可行契约：叶子结构化返回前显式提交全部、工作树干净、返回 `git rev-parse HEAD`；响应后 gate 不改产品或留下已跟踪输出。集成者核验提交对象、祖先 / 可达性再合并。不能依赖未来清理提交并神奇返回未来 SHA。可额外约定预声明分支，但须可核验，不会自动暴露。未来窄扩展可在 `WorkflowSpawnResult` 加宿主核验的 `{branch,baseSha,commit}`。

<a id="fixed-go-lifecycle-template"></a>
## 固定 Go 生命周期模板

一个 workflow 负责：准备 → 图就绪派发 → 串行机械合并代理 → L2（全部预期输入已集成且聚焦套件绿）→ 适用时 L3 组装入口冒烟 → 冻结 → 并行规范 / 行为审查 → 最多两轮全新修复及差量复审。就绪集合耗尽不等于完成，每个计划片含下游消费者都须集成或明确阻塞。gate 命令放仓库文件，不内联 shell，见当时 `dynamic-workflow.md:56-95`。pi 沙箱意味着合并交有工具的机械代理或宿主适配，不能默退父执行。

每个机器消费返回用 `agent(...,{schema})`，含 `{status, slice, commit, evidence, setup}`，可选预声明分支。null、缺提交身份、准备失败、部分合并、旧 gate 输出都阻塞。子代理把 SHA 当数据返回；集成者用 git 查对象 / 祖先 / HEAD 并返回证据，不信散文。schema 只验形状不验真，模型提交数据不等于宿主核验。workflow 返回只是报告，前置条件未机械断言就不是证明。

<a id="thin-cross-harness-comparison-official-sources"></a>
## 跨宿主简要对比（官方来源）

- **Claude Agent SDK：**Python/TypeScript SDK 提供查询 / 会话、流式消息、工具权限与 hook，须 SDK 原生适配，不能直接跑 pi 沙箱脚本。官方：https://platform.claude.com/docs/en/agent-sdk/overview 与 https://platform.claude.com/docs/en/agent-sdk/python 。
- **Claude Code Dynamic Workflows（父后续）：**官方有 JavaScript `agent/pipeline/parallel`、字面量 `meta`、`args`、schema 返回、无脚本 fs/shell、相似上限、前缀重放；博客推荐技能内可改造 JS 模板，比单看 SDK 更接近。pi 具体选项、预设名、worktree 元数据、gate 跨宿主语义仍未测。官方：https://code.claude.com/docs/en/workflows 与 https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code 。范围 / 大小见 `dynamic-go-template-and-parallelism.md`。
- **Codex：**官方 CLI/SDK 面向任务 / 会话，受沙箱 / 策略约束；pi 脚本应转为原生适配或降为明确 Agent 派发，不假定直接可跑。官方：https://developers.openai.com/codex/cli 与 https://developers.openai.com/codex/sdk 。

优先完善 pi 原生模板；跨宿主可移植性应是同图 / 同契约配已验证绑定或窄回退，不提前做通用运行时。Claude Code 原生动态工作流让共享 JS 机制可行，但须冒烟验证，来源相似 / 函数同名都不证明可直接执行。

<a id="actual-files-inspected"></a>
## 实际检查的文件

- Rope：`.rope/CONTEXT.md`、`.rope/adr/0014-workflow-execution-mode.md`、当时 `skills/rope-go/references/dynamic-workflow.md`、`.rope/issues/dynamic-go-session-audit/diagnosis.md`。
- pi 扩展：`src/workflow/tool-description.ts`、`runtime.ts`、`host.ts`、`saved.ts`、`worktree.ts`、`package.json`。
- pi 核心：已安装 `README.md`、`docs/usage.md`。

<a id="unknowns"></a>
## 未知项

核心点已核验：并发公式见 `runtime.ts:48-50`，总代理 / 项数限制已接入选项（`runtime.ts:24-30,279`；`tool-description.ts:115-117`）。返回没有 branch/baseSha（`runtime.ts:123-154`）；日志只存 `{index,key,ok,text,resumed}`（`journal.ts:43-67`），恢复也不能找回隐藏分支元数据。没有来源证明 Claude/Codex 可原样执行同一 JS；官方接口支持转换，不证明直接可移植。
