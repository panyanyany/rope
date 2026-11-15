<a id="0014-workflow-execution-mode--script-driven-orchestration-config-decided"></a>
# 0014 工作流执行形态：配置决定、脚本编排

> **状态：由 [0016](0016-single-execution-form-agent-dispatch.md)替代。**dynamic、内核、配置解析、L1/L2/L3 均退役，父代理派发是唯一形态。

原状态（历史）：active，替代 [0003](0003-dynamic-workflow-mode.md)机制部分及 mode: dynamic，补 [0007](0007-graph-driven-go-single-review.md)图为事实来源、[0008](0008-slice-ready-worktree-execution.md)隔离原语、[0011](0011-edge-classification-and-acceptance-gates.md)结构检查。

日期：2026-09-08。

<a id="context"></a>
## 背景

0003 由父模型读图、逐个派发、吸收全部摘要；无 runner、机械检查、恢复机制，无法支撑大并行，shape 仍保守。问题是执行形态，不是并行想法，切片大胆程度依赖基础设施。

2026-09-08 legal-finance-ai-employees 波 2–3 回放以 pi SubagentWorkflow 验证：父 go 上下文 <6%，原运行 385 轮 / 四次压缩；第二波五叶子 334K tokens、约五分钟并行；前缀缓存恢复已完成叶子零 token；新视角结束审查抓到原审链遗漏的读侧 ACL 绕过。见 dynamic-workflow-replay-legal-finance。

回放加真实缺陷（legal E4 组装；钉钉 v1.6.2 reply_queue 残留，stream_assembly/intake_facade 不属任何片，E1 只验生命周期不验行为）说明集成必须断言真实不变量，组装根必须用真实组装、输入事件、可观察输出验证。

<a id="decision"></a>
## 决策

1. **执行形态仅由配置及能力决定。**`~/.rope/config.toml`：
   ```toml
   [execution]
   default = "dynamic"   # dynamic | agent，缺省为 agent

   [execution.fans]      # 可选执行侧预算上限
   research = 20
   panel = 3
   fix_storm = 3
   ```
   配置 dynamic 且有确定性 runner 则脚本执行；无 runner 如 codex/agy 软降派发，缩并行并记 map，工单不变。配置缺省 / agent 保 0007。包不声明执行形态，删 mode。小任务走 quick，临时手动接管只是当次引导，不存字段。
2. **dynamic 必须脚本驱动。**JS 管就绪、派发、串行合并、检查、修复，模型只在叶子 / 审查。检查脚本落文件避免多层引号腐坏；修复用新代理，resume 不能带 gate；未解合并阻塞，独立线可续。不允许部分集成通过，曾有 3/5 被单断言误放行。
3. **每批廉价机械检查菜单：**L1 片内聚焦；L2 必须所有输入分支合并且聚焦测试通过，单纯绿不够；L3 真实组装根冒烟，只在外边界模拟，不在迁移 seam 模拟，一个事件进、可观察结果出，秒级，触及至少一组装根则必需，shape 列根。
4. **工单不依赖执行者。**图给并行可能，配置预算定利用程度；包无 fan。research/panel/fix-storm/array 是运行时语义。研究按独立问题及证据对账，shape 挑战粗片 / 假依赖，不追固定数量。
5. 有各根 L3 后，E4 类人工走查由发现层降为最终抽查。
6. **运行说明随技能分发。**当时唯一契约为 `skills/rope-go/references/dynamic-workflow.md`，grill/shape/go 相对安装目录读启动指针；spec 只导航，不复制操作。全局 / 项目安装均无需 Rope 检出，不改安装优先级或展示模型计划。相关文件现已退役。

<a id="consequences"></a>
## 后果

收益：go 父近空闲、缓存续跑零 token、并行省时；历史回放有无头旧上下文限制，需核当前宿主。成本：不变量设计关键，错一次可交部分集成；共享 map 必须叶子返证据行、集成者追加，不并写。graph2workflow 编译器当时留后续 issue，先积累手写经验。

<a id="addendum-2026-09-10-graph-scheduling-gate-tiering-setup-step-0"></a>
## 附录：图调度、分层、准备第 0 步（2026-09-10）

legal-agent-capabilities 首个 17 片生产运行验证形式并发现四缺陷，见 session-01a0840a：

1. 固定波次改逐片就绪，每次合并补前沿；worktree 不应让 S14–S16 等完整 W3 合并 / 无关全套。波次只留 shared。
2. 分层规则写脚本作者会读的位置。L1 聚焦，广套件按 0013 影响，纠正恰好两次。原每叶子及每波约 11 次全套，占 73 分钟中 38 分，早已违逐片禁全套。
3. 编译器无条件把 routes 准备命令放每简报第 0 步，先检查，返回 setup。首轮三叶子缺 node_modules 失败，补注入后一次通过。
4. gate 检查输出文件，不信管道退出码；曾 cmd|tail 吞失败报绿。

dynamic 的冻结点、双并行审查、脚本内修复协议当时保留于分发参考。

<a id="addendum-2026-09-11-the-fixed-execution-kernel-and-why-doc-only-rules-failed"></a>
## 附录：固定内核，以及仅文档规则为何失败（2026-09-11）

legal-retrieval-pagination 审计：go 拆两脚本，先只 S1、父手合、再其余，理由脚本无 shell。第二脚本分支解析误中简报中的 branch: HEAD，双叶子均标阻塞、零集成，却仍跑 L2/E2E，仅把结果作为字段而非前提；S3b/S4/P1–P3 消失。来源 dynamic-go-session-audit 及 template-and-parallelism。

结论是每次让新会话把文字契约重新编码，就会每次以不同方式出错；停止要求重复实现，不代表模型无法遵守。

<a id="decision-1"></a>
### 决策

1. 分发固定 go-execute.js，父用安装绝对 scriptPath，编译任务数据、读运行记录，不写编排代码；当时 schema 权威 execution-template.md。
2. 交付身份由 git 验：叶子提交、干净树、预声明分支指最终提交；宿主清理前在 worktree 执行 verify-delivery.sh，以退出码判断，替代文字解析。
3. 前提结构化：L2 全计划任务已集成且相关套件绿，之后才能 L3/审查/E2E。不能跑写 ran:false/ok:false 或 skipped:true，不冒通过。delivered 还需 approve 和 E2E ok。
4. run-check 按 scope@integrated commit set 复用，未变不重复昂贵命令，各阶段串行，无独占通道调度器。
5. 离线 stub 复现分支、漏下游、假 L2、逐片全套四类，行为引宿主源码，宿主契约变更在测试暴露。
6. 单文件内核是接受成本：沙箱禁 import，不能模块化，同文件片须串行，不是重引波次，在图和模板明示。
7. 用户决定无 schema 版本门槛。形状不符可能静默失败，接受风险以 explain 验证和逐阶段记录缓解。

<a id="consequences-1"></a>
### 后果

父省掉脚本大小的 token 及可引缺陷。能力修复集中，但内核 bug 影响所有 issue，离线套件是发布前提。内核改动串行。rope add 已递归复制，workflows/scripts 无需安装器变化，与技能版本绑定。

<a id="addendum-2026-09-11-the-stub-must-mirror-the-layer-the-script-receives"></a>
## 附录：stub 必须镜像脚本收到的层（2026-09-11）

legal-retrieval-quality 第二次真跑，所有片失败但 gate 全绿。parsePayload 按 WorkflowSpawnResult 假定 agent 返回 ok/text，但 schema spawn 在 agentIn 经 realmParse 已解包，所以 ok 永远 undefined，六份 gate 验证交付全被认无证据，花光修复预算。state 又无 branch，assertBoundary 遇嵌套 undefined 丢整个返回，父只能从 git 重建。

1. stub 镜像脚本收到层，不是宿主内部构造层。host.ts 的 toSpawnResult 是内部，worker-source 的 agentIn 才定边界。错层忠实 stub 会通过真实永不通过的测试。loader 重做 assertBoundary，在离线复现 result.tasks[0].branch 原错。
2. 可选字段应省略，不设 undefined；边界只允许顶层 undefined。内核返回前 stripUndefined，“缺失”必须是有意决定。

可复用教训：只读文档类型、不读宿主实际代码路径是契约猜测，正是离线套件应抓的问题。map 当时同时记两层与行号，防下个读者重犯。
