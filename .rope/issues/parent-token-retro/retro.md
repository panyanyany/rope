# Agent Workbench 主规划模型消耗复盘

状态：六项讨论已确认，仓库内 skill 与相关模板已修改，冒烟测试通过；随后按用户授权安装全局 skill 并刷新 Pi preset，原生加载校验通过；未提交。
范围：用户截图指定的 MR !118–!124；主要证据为 2026-10-20～22 的七个 Pi 主会话。全局日志只用于定位样本，不将其他项目计入结论。

## 结论

不是缺少 subagent：七个主会话已有 149 次 `Agent` 工具调用。主要可疑开销是父代理承担大量定位、测试输出分析、派工准备和文档回填；部分工作直到父代理已查明实现细节才交给叶子。优化对象应是主代理的工作边界与往返次数，不是单纯增加代理数量。

## 统计口径

逐条累加主 JSONL 的 `message.role=assistant` 中 usage；同目录可能有叶子，不能按 cwd 汇总。MR 号仅用于定位分支；会话可含追加需求（例如 !119 后续还有 roster 工作），不是每个 MR 的独立成本归因。`Agent` 为调用次数（含尝试），不是已完成或唯一叶子数。assistant 数为日志记录数，不保证每条都是一次成功计费请求。

| MR / 分支 | assistant 记录 | input | output | cacheRead | Agent 调用 | 压缩 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| !118 session-attachment-deliverable-turn | 131 | 274,309 | 50,826 | 9,371,392 | 12 | 1 |
| !119 tech-timesheet-attribution | 210 | 519,551 | 79,412 | 17,196,032 | 17 | 2 |
| !120 turn-request-budget-guard | 296 | 1,331,988 | 112,117 | 23,145,216 | 24 | 2 |
| !121 skill-path-reminder-data | 239 | 958,584 | 72,157 | 19,361,728 | 28 | 2 |
| !122 duplicate-session-deliverables | 200 | 280,764 | 60,434 | 13,523,456 | 9 | 1 |
| !123 session-partial-turn-persistence | 262 | 1,157,777 | 90,147 | 23,144,512 | 21 | 2 |
| !124 haizhi-a2a-server | 356 | 747,286 | 159,388 | 36,133,248 | 38 | 2 |
| 合计 | 1,694 | 5,270,259 | 624,481 | 141,875,584 | 149 | 12 |

约 96% 的上述三类累计 token 是 cacheRead：这是多轮反复携带的前缀，不是 1.42 亿独立阅读量，也不能与新输入按相同单价估价。部分模型 cost 字段为零，不能当真实账单；不据此给节省金额或承诺节省比例。日志可见主模型以 GLM-5.3 为主，!123 另有 GPT 模型切换，不能把所有消耗归给单一规划模型。

## 逐项讨论 1：grill 主动参考成熟实现（用户已确认）

!121 主日志 L13：父仅查本仓代码后称“事实已核实充分”，开始路径修法、skill 读取死锁的决策问题。L16 的 `ask_user_question` 返回保留用户原话：“先调研常用的harness暴露的路径位置，比如pi的……”以及“为什么cat ls find被拒绝？成熟agent的实现是什么？”。L17 才派两个外部调研 explore。这是“用户提醒后才调研”的直接证据；不能把同目录叶子开场的研究 brief 当真实用户原话。

L30 用户再提普通 read/bash；L34 父仍推荐保留 skill.run，并称附件 token 授权为安全边界；L35 用户质疑白名单/授权必要性，L36–40 父查代码后改口白名单是软约束。L41 用户再问 skill.run 的必要性，L42 才明确可删除。部分最初“必须保留”的判断未在推荐前核实；这不等于所有成熟产品模式都可直接移植。

用户确认方向：新机制/工具面设计先调查成熟实现如何完成同一用户任务，并核对本项目必须额外保留的真实约束；不默认现有自定义机制全部有必要。输出必须进入方案比较（复用/沿用成熟方式/定制及理由），不是只生成资料。纯内部小修不固定外部搜索，不固定 fan-out 数。该点已确认；尚未修改 skill。

## 逐项讨论 2：探索默认交给 explore（用户已确认）

用户选择“默认派探索”：未知答案的查找、追踪和诊断默认交 explore；父保留已知位置的短读取及决定性证据复核。!123 L493–540 共24次诊断工具调用，L544才派实现，是典型反例。brief可从症状和问题出发，不要求父先查出根因。不用固定工具调用次数判断何时派工，不禁止父亲读源码作判断。

## 高优先级：把定位也派出去，而非只派最后的改动

!120 的父级诊断更长：L209–240 查日志、实现和 SQLite；L270–302 直接对现场消息运行 bridge 探针；L344–390 亲自建立 DEBUG API 栈、编写复放脚本并定位配置；L439–456 再加探针复放，最后才派最终修复。L382 还明确写“加诊断探针（不改产品代码）”——仅禁止父写产品代码，不足以阻止父承接整段诊断。诊断本身有效且必要，问题是执行位置，不是应当删掉这些验证。

!123 的两次用户验收反馈是最清晰的例子：

- JSONL L492 用户反馈停止标记独立显示；L493–540 父代理读取截图、代码、反复 grep 和查询 SQLite，L544 才派修复叶。
- L560 用户反馈停止时工具历史先消失后出现；L561–593 父代理逐层追查前端状态与后端终态，L595 才派修复叶。
- L112–124 研究叶返回后，父代理自行 fetch/search 并改研究文档。存在补充核实需求，但这部分事实核实也可退回研究叶，不能把“派过研究”当作后续研究必须自己做的理由。

现行 `skills/rope-go/SKILL.md:14-16` 和 `references/execution-rules.md:19-25` 限制父写代码，却没有同样清晰的诊断交接点；“先彻底查懂，才能写 brief”的倾向仍会把定位噪音留在父上下文。

最小改法：收到新症状后，父先给观察、预期、复现入口、相关契约与问题；由 explore 返回根因证据和未知项。父解释契约/决定修复边界，再交 implementer。已定位且边界明确的问题直接派 implementer，避免为简单问题固定增加一次研究。brief 不要求父先列完文件级修法。

保留父职责：判断是否改变需求/架构、授权边界、是否回 shape。父需要亲读决定性 source 段落，而非重复整个定位过程。

## 高优先级：测试与环境事实输出下沉

!123 L276–286 父代理多轮从完整后端测试日志提取失败，再跑聚焦用例；L378、397 等有后端全套运行。每轮是否合理需结合所选影响范围，不能仅按次数判浪费。但失败归类与日志挖掘无需全部占据父上下文。

现行 `execution-rules.md` 已有 impact selection、baseline ladder、One run shows the failures、禁止 per-merge test ritual。缺口不是再添加一套测试政策，而是让执行者输出可直接判断的结果。

最小改法：baseline / 集成验证由已有 explore 或相应验证叶执行，返回 commit、命令、退出码、失败用例名、摘要、完整日志路径；父只处理失败类别和范围决定。保留一次明确的集成验收，不把实施叶自测直接视为验收。环境 readiness 也使用有界摘要；栈生命周期仍归父，避免叶子各起一套栈。

## 中优先级：shape 的事实整理/草稿与决策分离

已存在正确切片/派工，不应全面推翻：!121 L76 用户明确要求“切细，多并行，多 subagent”，L77 父重切，最终有 28 次 Agent 调用；!122 L89 在确认 worktree 能力后，因两部分依赖同一规则且总量小，向用户建议合为一个切片。后者只派 9 次并不自动表示漏派。!119 也有多个独立切片并行与单独 review/E2E。优化重点不是再增加固定 fan-out。

当前 `skills/rope-shape/SKILL.md:21-61` 把来源盘点、能力探测、map、完整包写作与切片判断放在同一父流程。允许“wide 时 explore”，但大部分机械写作仍默认父亲自执行。

确认后的改法：explore 交来源定位、测试 seam/消费者清单、owned-files 和依赖事实；父阅读有效约束、确定 disposition/契约/切片边界，并撰写完整包。最初提出的大包草稿委派候选已被用户否决，见逐项讨论6。

## 中优先级：减少父会话的无判断往返

当前 `execution-rules.md:161-236` 规定 brief 与证据回填，但这些仍需父反复拼接和摘录。!123 的串行 merge 和 map 更新本身有必要；不应为了 token 把主 checkout 交给多个叶子并发写。

最小改法：复用现有返回字段，统一固定顺序的短回执：status、delivery branch、evidence IDs→路径、blockers、map delta。父执行 git 核对与串行合并，只读缺项/冲突的必要证据；不再重新扫描实现来填表。先用模板，不先造新 runtime、角色或调度系统；真有重复机械操作后再做一个小的确定性工具。

## 中优先级：按阶段加载规则，缩短共同前缀

讨论状态：后续逐项讨论已确认 clear/GLOSSARY 迁移和 TDD 独立路径传递；下列其余阶段加载细分仍是原候选，非本轮实施范围。用户要求“这个context的，看下上游matt的改造是怎么处理的吧？你也应该调研成熟实现”。已由 explore 核实，研究落于 `.rope/research/matt-context-loading-retro.md`。Matt #1304 的 in-progress chief-of-staff 增加分主题 wiki、index.md、来源指针、历史知识带日期/commit；目的是跨 session/compaction 记忆，不是领域契约。原文要求决策前读索引及指向页，未明确如何只选相关页，也无加载节省证据。可讨论借用索引和引用而不新建与 .rope 并行的知识层；不能把其“只记历史”套到当前有效的 specs/术语。以下仍是原候选，不是已接受决定。

- 当前 `skills/rope-go/references/execution-rules.md` 504 行 / 27,905 字节，TDD playbook 121 行 / 5,812 字节；!123 L205 父一次加载 execution-rules、tdd、architecture-gates。
- !123 工作树当前 `.rope/CONTEXT.md` 589 行 / 73,321 字节，`.rope/routes.md` 282 行 / 14,474 字节。历史 !123 L25 发起无 offset/limit 的 CONTEXT read，L27 实际返回第 1–419 / 588 行（50KB 截断），未见续读，不能称全量读完。
- !124 L10 发起 CONTEXT read，L13 同样返回第 1–419 / 588 行；L18 用 offset=420 续读，L20 返回余文。这一次确有全文读取。其他样本可见 head/grep 定向读取，不能推广成“通常都全文读”。当前文件大小不代表历史返回大小，也不是 token 估值。
- 本次检查时仓库与全局安装的 grill/shape/go SKILL.md 相同；这不证明历史每次加载都与当前相同。

最小改法：go 顶层保留父步骤与阶段入口，TDD 留给 implementer；review/E2E/故障参考到阶段才读。Workbench CONTEXT 保留核心名词和导航，将领域分支术语放到按主题读取的参考。压缩不应删掉公共契约或让必读约束失去可靠入口。

## 逐项讨论 3 补充：clear 负责整理与迁移（用户指定）

用户否决 init 统一迁移入口的候选，选择扩展 rope-clear 负责文档整理（含规范迁移）；init 保持初始化职责。clear 自己也需要项目上下文，应设计其获取方式，不能无条件吞入全量知识库。用户进一步明确：唯一术语入口为 `.rope/GLOSSARY.md`（不放仓库根目录）；后续执行 rope-clear 时，检测到旧 `.rope/CONTEXT.md` 应支持重命名迁移至 `.rope/GLOSSARY.md`。保留现有内容，更新当前有效引用；若新旧两文件并存不得覆盖，需核实合并/冲突。内容归属整理与文件重命名区分，不借改名删掉有效约束。init 后续创建新文件名，当前 skill/模板/根说明等读取方须同步，历史记录不盲目替换；完整调用范围待 explore 盘点。不新增根 GLOSSARY、副本知识层或版本系统。

## 逐项讨论 4：实现叶自行读取 TDD（用户已确认）

用户选择“独立 TDD 文档＋派工传明确路径＋叶子自读”，不复制规则正文到 skill/preset/brief，不依赖刷新全局 preset。父解析当前已安装 rope-go/references/tdd.md 的绝对路径列入实现叶必读；brief只保留任务特定验收、测试切入点和命令，父无需完整加载后转述。go 原有必读要求落实为可执行路径传递，不新增 TDD 政策。

核实当前本机 `~/.pi/agent/agents/rope-implementer.md` 有 read 工具和简短红绿步骤，但无 TDD playbook 入口；仓库 agent-templates 禁止复制完整 TDD。!123 E1修复任务007824ba-6f48-43c，确认匹配叶日志 `/home/wufei/.pi/agent/sessions/--tmp-pi-agent-007824ba-6f48-43c-7c5393a6--/2026-10-21T11-00-26-079Z_01a15e1e-995f-7309-a6e1-21ff347e89a8.jsonl` L7 brief有先红后绿要求但无playbook路径，未见读取TDD记录；L277确有读取 `/home/wufei/.agents/skills/agent-browser/SKILL.md`，证明当前worktree叶可访问全局skill路径。不能由叶能红绿推断已读TDD。仅核实一实施叶，不外推全部历史派工；未改本机preset。

## 补充研究：当前 TDD 与 Matt 的差异（已完成，用户接受不增补规则）

用户要求比较当前 Rope TDD 与 Matt 上游是否一致、哪些更好设计可采纳。explore 的研究落于 `.rope/research/tdd-matt-comparison.md`；父复核了本地独立 tdd 与 Rope playbook。核心单行为红绿、公开seam、独立expected、mock系统边界、反批量测试等已基本对齐，不建议为对齐增加规则或复制示例。Matt one logical assertion per test 相比 Rope one logical behavior per cycle 是细微表述差别，不能误变成只准一条assert；无实际问题证据，不建议单改。Rope的shape确认seam、父子返回红绿证据、风格/文档豁免等编排适配保留；不可直接把叶子阅读入口换成全局独立tdd（其要求执行者向用户确认seam）。源与部署Rope playbook一致，独立全局tdd另属Matt正文，不混淆。

## 逐项讨论 5：测试执行与日志摘要的交接（用户已确认）

已有规则包含 impact selection、baseline ladder、单次运行留全日志和摘要、同HEAD证据复用；不再新增测试频次政策。讨论是否把有独立工作量的基线/集成验证交已有叶，父决定范围和失败处置，执行者返回HEAD/环境、命令、退出码、失败项/计数、日志路径；复杂日志诊断沿用已确认默认explore。栈生命周期仍归父，实施叶自测不替代组装验收，不固定新增代理或回合。用户选择“执行与摘要交给叶”：有独立工作量的基线/集成检查委派已有叶，父决定范围、验收证据和失败处置；不新增固定角色。

## 逐项讨论 6：shape 只下沉事实整理（用户已确认）

用户选择“只下沉事实整理”，不采纳把issue包起草交docs-only实施叶的候选。explore整理来源、消费者、既有测试入口、文件归属和依赖事实；父保留契约解释、架构取舍、切片/依赖、用户确认、完整PRD/tasks/E2E写作和最终ready判断。不能让explore自行决定切片或未确认的设计。当前只有规则职责证据，不声称已量化shape成本或证明所有父写作浪费。

## 最初分工候选（以逐项确认和实施记录为准）

1. Grill：父问取舍；叶子取事实。父只对决定性证据作定向复核。
2. Shape：叶子只盘事实；父定契约、架构 disposition、切片，并撰写完整issue包（用户确认不委派起草）。
3. Go：父决定 ready set、验返回证据并串行 merge；实现和长检查交叶子。
4. 新症状：先判断是需求冲突还是诊断；诊断委派，不在父窗口跑长排查。
5. Review/E2E：沿用现有角色隔离；不要增加父第二轮代码审查。
6. Finish：从已有证据生成文档草稿，父确认状态和发布动作。

优先落第 1、2 项（诊断交接、检查回执）；再改 shape 写作与参考分层。不是“更多更碎的代理”，而是“一段需要查很多事实的工作，完整交出去”。

## 本地实施记录

用户明确要求本轮自行修改当前仓库skill，不派生子代理；已遵循。TDD核心政策不增补，shape完整包不委派起草。

| 已确认项 | 实施位置 |
| --- | --- |
| grill 主动研究并影响方案取舍 | `skills/rope-grill/{SKILL.md,references/grilling.md}` |
| 默认探索/诊断交接，父保留定向复核 | `skills/rope-harness-presets/references/role-schema.md` 共同约定，grill/shape/go/clear 引用 |
| clear 整理与旧术语文件迁移；init 只初始化 | `skills/rope-clear/`、`skills/rope-init/`，读写方及中英文README同步 |
| TDD独立文档，实际安装绝对路径传叶自读 | `skills/rope-go/{SKILL.md,references/execution-rules.md}`；模板不复制正文，TDD仅更新术语路径 |
| 验证执行与短摘要交叶，父控制范围和处置 | 共同角色约定、go baseline与验证回执、explore权限/模板说明 |
| shape只下沉来源/消费者/测试入口/归属/依赖事实 | `skills/rope-shape/SKILL.md`，父保留判断与完整包写作 |

同步了 `.rope/adr/0017-dispatch-contract.md` 的已确认补充和 `.rope/specs/plan-artifact-reader-layering.md` 的读取契约。修正了Testing Decisions模板中指向已更名测试选择标题的旧锚点。

验证：`node --test tests/*.test.mjs` 3/3通过（frontmatter、安装后相对引用、CLI安装及settings保留）；`git diff --check`通过；`grep -rn "ADR [0-9]" skills/` 无命中；检查剩余CONTEXT引用均为迁移或兼容说明。外部skill-creator验证器在已知安装位置不存在，未安装依赖。未启动真实代理/E2E（遵循本次不派生要求），不声称已验证下轮token收益。

未执行clear实际迁移：本仓库 `.rope/CONTEXT.md` 和现有根AGENTS保持原状；新skill兼容该旧入口，未来clear在批准批次中改名并修复有效引用。未修改已有未跟踪 `.pi/`，未提交。

后续部署授权：用户先要求安装全局，再要求刷新preset。已用 `node bin/rope.js add` 安装到 `~/.agents/skills/`，校验32个分发文件与当前工作区一致。已刷新 `~/.pi/agent/agents/` 的四个Rope preset，以及 `~/.config/rope/harness/pi.json`；保留各实际preset的模型、thinking、extension排除设置及manifest内实施叶备用模型，不重新排名或修改provider/settings。修正原manifest的runner过时条目，使其与既有实际preset一致（GLM Flash low）。使用宿主 `loadCustomAgents` 严格加载验证四项注册、全局来源、manifest一致性、禁止嵌套、TDD路径自读和explore验证权限。当前项目无同名覆盖；宿主在每次Agent调用时重读文件。未启动真实代理或声称已验证API调用/运行效果。

## 验证下一轮是否变好

对相似规模 issue 记录：父 input/output/cacheRead 分开、父 assistant 往返、首次派工前的源码/日志读取、父诊断工具调用、子代理总消耗、交付时长、缺陷/返工情况。目标是父开销下降且总成本/返工不反弹；本次未做 A/B，不给节省比例。

## 源日志索引

公共根目录：`/home/wufei/.pi/agent/sessions/`。以下每项目录格式为 `--home-wufei-orca-workspaces-agent-workbench-<分支中斜杠替换为连字符>--/`。

- !118：`fix-session-attachment-deliverable-turn` / `2026-10-20T08-01-25-885Z_01a15854-5b7c-70e9-b8ca-3af40828237a.jsonl`
- !119：`fix-tech-timesheet-attribution` / `2026-10-20T07-50-31-704Z_01a1584a-6018-77e1-9cde-15c3da91170b.jsonl`
- !120：`fix-turn-request-budget-guard` / `2026-10-20T03-16-11-329Z_01a1574f-35c0-71b7-b7a1-8f47513369dd.jsonl`
- !121：`fix-skill-path-reminder-data` / `2026-10-20T08-51-59-309Z_01a15882-a4cd-71ef-845d-c1ef5c06ea89.jsonl`
- !122：`fix-duplicate-session-deliverables` / `2026-10-21T09-43-54-024Z_01a15dd8-87a7-776b-b739-44493aab891b.jsonl`
- !123：`fix-session-partial-turn-persistence` / `2026-10-21T08-57-28-369Z_01a15dae-0631-7309-a6e1-2150a705f9ac.jsonl`
- !124：`feat-haizhi-a2a-server` / `2026-10-21T08-32-40-593Z_01a15d97-5291-7680-ac7c-147f5b410261.jsonl`

限制：尚未可靠连结所有 tmp/worktree 叶子的父子关系；不报告全流水线 token 总额。以上文件行号为本次快照。未审计产品代码正确性，未修改全局 skill、preset 或 Workbench 仓库。
