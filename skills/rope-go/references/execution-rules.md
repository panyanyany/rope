<a id="rope-go-execution-rules"></a>
# Rope Go 执行规则

<a id="parent--leaf-contract"></a>
## 父编排器与叶子契约

go 会话就是**父编排器**，叶子分工如下：

| 角色 | 常用预设 | 工作 |
| --- | --- | --- |
| implementer（实现者） | `rope-implementer` | TDD，实现一个切片单元、提交，返回摘要和路径 |
| reviewer（审查者） | `rope-reviewer` | issue 结束行为验收：只读代码，依据组装 diff 走查矩阵及高风险边界；拥有结论 |
| scanner（扫描器） | `rope-explore` + 规范简报 | 快扫规范、lint/typecheck、约定和异味基线；不运行产品 |
| explore（探索者） | `rope-explore` | 按简报调查及执行基线 / 集成检查；不改产品 / 测试 |

规则：

- 父编排器用**自包含简报**派生叶子；叶子只返回**摘要、产物路径及状态**。
- **禁止嵌套派生。**全部派发由父编排器负责。
- 调查和验证遵守共享[交接契约](../../rope-harness-presets/references/role-schema.md#exploration-and-validation-handoff)。新症状无需先查明原因才派发；父编排器依据调查决定修复范围，不自行完成全套诊断。
- **父编排器不写产品 / 测试代码：**go 和 E2E 的所有代码修改，包括 E2E 中的“小修”，都走实现者简报。自行编辑违反契约；纠偏始终是改简报再派发。失败或空返回按派发问题处理，不能由父编排器接手叶子工作。
- 纠偏 = 改简报 + 重派实现者。全新叶子仍返回相同失败特征，说明无进展，触发人工升级停止；设计 / 契约缺陷立即停止。修复不暂停其他就绪切片派发。
- **默认并发：**每个就绪切片都派后台叶子；即使只有一对也并行。任何串行安排都须在 `tasks.md` 记录理由。

<a id="modes"></a>
## 模式

- **Worktree 模式：**宿主能把叶子隔离在 git worktree 中，如 pi 的 `isolation: "worktree"`、Claude Code 的 agent `--worktree`，或手工 worktree。按切片就绪调度：`seam-required` 阻塞项**已合并**即就绪，从最新合并 HEAD 建新 worktree。重叠切片可并行，重叠留到合并队列处理。
- **Shared 模式：**按波次；同波并行需要拥有文件不相交。叶子不能同时提交，避免索引争用；父编排器按落地顺序串行收集提交，或叶子停在测试通过和 diff 状态，由父编排器提交。

<a id="merge-queue-worktree-mode"></a>
## 合并队列（worktree 模式）

父编排器按落地顺序**一次一个、串行**合并。仍有运行叶子可能触碰相同路径时，不得合并。

1. 合并一个分支；冲突则派发**一个**实现叶子，给出两边分支名和冲突路径，在**未合并分支**解决，合并 / rebase 已落地的相邻分支。未合并切片的简报及提交保留其意图；修复后重入队列。tasks.md 有 methodology-order 偏好时，方便则按其排队；只影响落地顺序，不阻塞派发。
2. 每次合并后依据叶子摘要更新 `map.md`，重算就绪集，派发新就绪切片。
3. 不逐次合并重跑测试：叶子已跑 TDD，下游 worktree 会使用上游变化，组装行为由结束审查验收。长期 / 整线集成分支走独立[候选合并检查](architecture-gates.md#whole-line--integration-merge)。**偶发失败纪律：**并行负载下失败，只重跑失败测试判断偶发性；全量干净重跑必须记录理由。

<a id="worktree-setup-repo-contract-in-routesmd"></a>
## Worktree 准备（routes.md 中的仓库契约）

```md
- Worktree setup: `./scripts/worktree-setup.sh`   # 或 host-managed | npm ci | uv sync | …
```

- **声明的命令**必须**先检查、可幂等**：脚本先廉价判断是否可测试，如 `test -d node_modules`，已就绪则快速退出。优先低成本方案：从主检出只读链接 `node_modules`、虚拟环境、`.env*`，或共享包缓存如 pnpm store，避免重复安装。每个 worktree 叶子简报都必须带**无条件第 0 步**，它是前置条件，不能等测试失败后由叶子决定是否补环境：
  ```md
  Worktree setup（先运行，脚本先检查；已有测试条件时快速空操作）：<命令>。
  准备后仍有环境失败，报告阻塞；不把修复轮次花在环境准备上。
  ```
  执行声明命令是机械动作，识别测试输出中的环境失败则需判断；简报不能依赖后者。叶子返回一行 `setup: ran <cmd>` 或 `setup: no-op (already testable)`；带代码切片缺此行，返回检查必须退回。
- **`host-managed`：**宿主 hook 准备 worktree，须说明覆盖**范围**。仅对宿主创建的 worktree 触发的 hook 不覆盖 Rope 隔离 worktree，应声明手动执行脚本，通常 `bash <host-setup.sh> <path>`。无论如何，简报仍带第 0 步；hook 已跑时做空操作检查。
- **未声明：**叶子先尝试 green，环境失败即阻塞。父编排器对剩余切片降级 shared 并记录理由。接受“环境准备麻烦”作为降级理由前，先核查宿主脚本能否手动运行，通常可以保住 worktree 模式。

<a id="test-tiers--baseline-ladder-repo-contract"></a>
## 测试层级与基线阶梯（仓库契约）

`routes.md` 声明：

```md
- Test tiers: quick: `<cmd>` (~Ns, measured)   # 检查 + 入口冒烟 + 纯单元
               full:  `<cmd>` (~Ns, measured)   # 回归安全网，不用于日常迭代
               report: `<full cmd> 2>&1 | tee <log> | grep -E '<failure|tally>'`
                       # 单次执行打印失败名称和统计，保存完整输出；见下文
```

- **按影响选择：**shape 的 Testing Decisions 记录受影响模块、共享消费者、聚焦命令，以及纳入 / 排除套件的理由。切片测试保持聚焦，集成检查覆盖受影响边界，结束审查走矩阵 / E2E 并核查组装影响。共享基础设施、影响不明、跨模块耦合证据、仓库明确要求，才扩大套件。先诊断局部失败，再判断是否足以支持全局重跑。
  - **契约全量检查：**受影响集合取决于改动*破坏什么*，不只是*碰了什么*。删除、反转、重命名、改键的契约（提示文本、枚举 / 状态值、字段 / 参数、错误字符串、菜单项、响应形状），对应断言往往在切片未打开的文件。测试通过公共接口工作，未必导入被删符号，因此只搜该符号几乎无结果。应在测试树搜契约自身词汇，如字面量、旧值、删除字段。每个命中都在本片迁移，或具名排除并说明理由；手挑文件列表不算全量检查。
- **基线阶梯，go 启动：**复用同一 HEAD、覆盖所选范围及相关环境、≤24 小时的 CI 或已记录通过证据；否则按上述交接契约，委派已有叶子运行声明的 quick 或受影响测试。更广套件仅作 issue 级回退，且须满足上述影响理由。将范围、命令、原因及复用 / 执行证据写入已有 Testing Decisions / 工作记录。
- **一次运行即显示失败：**证据命令一次执行就将完整输出写文件，同时打印失败项名称和统计。一个命令的三种视图应读同一文件，不执行三次。采集必须保留退出状态；裸 `cmd | tee log | grep …` 只返回 grep 状态，会把失败套件变成通过，因此先 `set -o pipefail`。从保存文件搜索堆栈，不为取堆栈重跑命令。
- **验证返回：**检查简报要求交接契约中的提交 / 环境、命令 / 退出码、统计 / 失败项、完整日志路径。父编排器判断覆盖与处置，不读全日志；需要调查的失败再交 explore。这同时适用于基线和组装检查。
- **full 指范围，不指频率：**基线与结束审查是决策点，不是两次必跑全量。范围内通过只证明该范围。后端局部改动不自动跑前端；修改 UI 消费的共享 API 须包含受影响 UI 测试，耦合广泛或不明再扩。
- **允许未声明：**阶梯跳过缺省层级。shape 发现缺行时自行推导（explore 或会话内扫描，不问用户，不由 go 中途发明）：检查与入口冒烟必需，纯单元可选，排除重 fixture 集成 / 基准 / 网络测试。测量候选，**仅 ≤60 秒**时写回，附日期、标准、实测耗时。标准只在此定义，shape 引用而不复制。

<a id="leaf-brief-contract-hard-budget"></a>
## 叶子简报契约（硬预算）

**最小简报**采用允许清单，正文 ≤60 行，路径与命令块不计。父编排器派发前检查。

**允许直接写入的内容：**

1. issue 路径及切片 ID / 标题。
2. **Public behavior：**一句用户可见行为；组件切片则写服务的用户故事行及自身完成条件，如接口签名 / 测试通过。
3. **Behavior Contract：**六字段的最简表达。
4. **架构约束，必填并按引用加载：**约束包**路径**、明确 `Constraint IDs:`、短全局不变量列表。必读来源路径 / 章节写在操作契约。空白或占位 ID 阻塞派发；有理由的 `none` 遵守[整包就绪检查](../../rope-shape/references/architecture-continuity.md#package-readiness-gate)。
5. **测试边界与先例：**PRD Testing Decisions 的边界，加一个先例路径。

**必需的操作契约，不计为内容载荷：**

- TDD 模式：行为代码默认 `required`；或 `waived (<kind>)`，附手册允许的类型和原因。required 需给 red 命令及有效失败信号、最小实现后的 green 命令，默认聚焦边界。全套属于 issue 级证据，不能要求叶子必跑。相对当前已加载参考文档定位 [TDD 手册](tdd.md)，核实文件存在，把**绝对路径**放入 Required reading，要求编辑产品 / 测试前读。纠偏简报、通用回退叶子同样适用，无需刷新预设。任务验收 / 边界 / 命令留简报，策略留手册；父编排器只定位，不加载并转发正文。路径不可访问是待解决阻塞，不是跳读许可。
- Required reading：生效 spec/ADR 路径和章节；编辑前读，再记录 ≤3 行架构落点（复用职责 / 公共边界 / 保持归属方向）。返回真实阅读和落点记录引用，未决冲突停片。见[架构检查](architecture-gates.md)。
- 返回格式：摘要、改动路径、交付分支与 `git rev-parse HEAD` 提交号、验证过的验收文本、除豁免外的 red 命令及失败证据、green 证据、已检查约束 ID 与落点记录和处置冲突、受影响检查 / 例外差异、worktree 的 map 修正 / 所需行、带类别的阻塞、`setup: ran <cmd>` 或 `setup: no-op`。**另附返回检查载荷：**每个 Required evidence 按证据 ID 映射到粘贴输出或产物路径。
- worktree 交付步骤：提交全部工作，使 `git status --porcelain` 为空，再 `git branch -f <delivery branch> HEAD`。宿主清理分支不能作为合并队列路由名。
- 相关产物路径：prd/tasks/e2e、约束包、map、specs、文件。
- map 路径：据其定位；shared 提交前修正被证伪行，worktree 在摘要报告。
- worktree：仓库声明准备命令时，作为无条件第 0 步，脚本先检查再执行。
- 禁止嵌套派生；提交规则；Blocked by / Scope。

结束审查有两份简报：**扫描器**拿 diff、提交列表、规范来源路径、必需架构块、检查命令 / 证据、内联全局不变量和下述异味基线原文；**审查者**拿 diff、提交列表、矩阵行为行、e2e 路径（只用于高风险阅读，执行由 E2E 阶段负责）、全局不变量、必需架构块、例外差异路径；先读适用约束包 / 来源章节，不带 map。审查轴和高风险清单在审查预设正文，不放简报。沿用同一允许清单与行数上限。

<a id="return-gate-reconciliation--defense-budget"></a>
## 返回证据核对与防御预算

每次落地做机械表格核对，不做代码审查：

```md
| 证据项 ID | 要求来源（矩阵行 / 约束 ID） | 返回输出 / 路径 | verdict |
| --- | --- | --- | --- |
| S2-E1 重命名后崩溃 | B4 | 粘贴 pytest 输出 | ok |
| S2-E2 并发 get-or-create | B5 | 缺失 | BOUNCE |
| S2-A1 来源阅读与编辑前落点 | D1 | 工作日志路径 | ok |
```

- 任一 `BOUNCE`：只带缺失 ID 重派，不重开其他内容。
- 架构证据在 shape 声明：已读章节、编辑前落点、已查 ID、受影响检查 / 例外差异。缺失则退回；冲突则暂停该落地等待解决。见 architecture-gates。
- 不重读实现、不重跑测试、不下审查结论；结束审查是唯一审查点。父编排器不自行测试来补证据。
- **防御预算：**纠偏简报中，shaped 行为矩阵 / 约束包之外的新验收要求必须为 **0**。架构义务在 shape 声明，不能修复时发明。执行中发现缺口，回 shape 重切，或记为 tasks.md 非阻塞备注。轮次间要求漂移违反预算，应重切。

<a id="human-gate-panel"></a>
## 人工授权面板

多个待授权项一次批量展示：

```md
## Human Gate Panel（2 项待确认）
1. [S5] 批准 fail-open 改 fail-closed；影响范围：摘要检查路径。
   S2/S3 继续，S4 暂停。
2. [S8] 批准破坏性 worktree 清理；影响范围：无未合并工作。
   所有执行线继续。
```

每项写受影响切片、具体请求、影响范围、其他执行线继续 / 暂停状态。不能逐项卡住，同时让其他线空等却不说明。

<a id="end-of-issue-review-execution"></a>
## issue 结束审查执行

所有切片完成后、verify 前，由父编排器在**同一消息派发两个只读叶子**。两者都是未参与构建的新视角；父编排器根据结构化返回记账，无进展修复循环触发人工升级停止：

1. **扫描器：**用 `rope-explore` 预设及下述规范简报；无预设则通用只读叶子并记录类型。先执行声明的完整架构检查，以及按影响选择的 lint/typecheck/build，或验证可复用证据；工具已保证的内容不重复查。不运行产品。
2. **审查者：**用宿主清单的 `rope-reviewer`，否则明确审查指令的通用叶子。只读代码和组装 diff，先读适用架构来源，再走矩阵、归属 / 边界不变量、例外差异、高风险边界。产品运行、真实入口走查和 E2E 全归后续验收阶段。
3. **机械汇总：**取最差结论，顺序 `approve` < `changes_requested` < `blocked`。任一轴的阻塞项汇成一份修复简报。不能重排、合并或重新判断，父编排器不是第二审查者。tasks.md 记录结论、两个叶子身份和修复轮次。
4. **修复协议：**原样转录阻塞发现 `{severity, path:line, issue, fix}`，不留下待探索内容。每轮必须缩小阻塞集合；首个无进展轮次（相同问题重现、新问题抵消已修复项、修复回退先前修复）触发人工升级停止。`note` 只记 tasks.md，不进入修复轮次。
5. **差量复审：**扫描器只扫描修复提交 diff，审查者只重查受影响路径，不重复全量复审。E2E 修复还遵守下方重跑规则。

<a id="diff-hygiene-both-leaves"></a>
### Diff 清理（两个叶子共用）

```md
git diff <base>...HEAD -- . ':(exclude)*lock*' ':(exclude)*.snap' ':(exclude)dist/'
```

按仓库扩展排除项，如 vendor/、构建输出、生成文件。锁文件 / 快照常占 Web 项目组装 diff 的 20–50%，两叶子都要为每行付出上下文成本。

<a id="scanner-brief-paste-35-lines"></a>
### 扫描器简报（粘贴，约 35 行）

- 带排除项的 diff 命令及提交列表，但保留检查 / 例外变化。
- 规范来源路径：CODING_STANDARDS / CONTRIBUTING / lint 配置。
- 约束 ID、约束包路径、必读来源章节；声明的完整架构检查命令或可复用证据路径。
- 内联全局不变量短列表。
- 原样粘贴下述异味基线。
- 返回契约：“报告 `clean` 或 ≤200 词发现，每项 `{severity blocking|note, path:line, issue, fix}`。每个命中均需判断，不能自动视为违规；仓库已记录规范优先于基线，工具已保证的项目跳过。检查命令 / 覆盖 / 退出状态 / 输出 / 提交引用另行返回，不挤入发现摘要。”

**异味基线**，Fowler《重构》第 3 章，每项一行，另加 Rope TDD 反模式：耦合实现、自证式测试、横向批量测试。

- 神秘命名：名称说不出职责就改名；无法诚实命名通常说明设计模糊。
- 重复代码：多处逻辑形状相同，提取共同形状。
- 依恋情结：方法更关心别人的数据，移到数据所属处。
- 数据泥团：字段 / 参数总是一起出现，组成一个类型。
- 基本类型偏执：基础值承担领域概念，为概念建类型。
- 重复分支：相同 switch / if 链反复出现，用多态或共享映射。
- 霰弹式修改：一次改动散落多文件，聚合进一个模块。
- 发散式变化：同模块因无关原因修改，按原因拆开。
- 推测式通用：规范不需要的扩展钩子，删掉或内联。
- 消息链：过长 `a.b().c().d()`，封装在一个方法后。
- 中间人：主要转发调用，去掉中间层直接访问目标。
- 被拒绝的遗赠：实现者忽略大部分继承能力，改用组合。

<a id="reviewer-brief"></a>
### 审查者简报

- 同样排除项的 diff 命令及提交列表。
- 矩阵行为行和 e2e 路径，只作高风险阅读，执行由 E2E 阶段负责。
- 判断已定边界上的测试输入及可观察断言，是否证明每片承诺的行为 / 矩阵行，而非仅证明新函数孤立可用。承诺包含调用者组装时，测试必须覆盖组装；纯组件承诺可在其公共接口证明。这是代码 / 测试审查判断，不要求运行变异测试。
- 内联全局不变量、必填约束 ID、约束包路径、生效来源章节；先读适用记录 / 章节。
- 架构检查证据路径、逐项例外差异及原因、已确认处置；检查规则削弱也要审。
- 不带 map；审查轴及高风险焦点在预设正文。
- 结论 / 发现同时返回来源阅读记录引用、逐项例外覆盖及结果，不倾倒约束包或来源正文。

<a id="high-risk-boundaries-the-reviewers-deepest-look"></a>
## 高风险边界（审查者重点深查）

- 公共接口或用户可见行为。
- 外部系统或 adapter 行为。
- 认证、权限、密钥或数据泄露风险。
- 持久化、schema、迁移、存储格式。
- 路由、应用入口、运行时组装、后台工作者。
- 跨层行为、E2E 关键路径。
- 架构职责 / 生命周期归属、公共边界 / 依赖方向、检查覆盖变化、白名单 / 例外差异。

<a id="e2e-acceptance-stage-after-review-approve"></a>
## E2E 验收阶段（审查批准后）

只有结束审查返回 `approve` 才能运行。前提：工作树干净、结论已记录、HEAD 已记录；每行证据都引用实际执行提交。

**共享服务栈由父编排器负责。**启动命令和入口来自项目声明，如 routes.md 的 `E2E entrypoints:` 或 issue Testing Decisions。不能发明入口；无声明则 `blocked_on_user` 并询问。父编排器只启动**一套**服务，派发前探测就绪，把启动日志与端口存到 `<issue>/evidence/`，最后一条旅程结束后关闭。就绪失败记录 `blocked_on_*` 并报告；不派发，不花修复轮次处理环境。

**旅程。**把 E2E 项分成用户可见旅程，每叶子一条；同机制的多个项目可由一条旅程证明。资源不相交的旅程用隔离浏览器会话并行；共享账户或可变状态则串行。宿主无会话隔离时，记录理由后串行。

**Runner 叶子：**宿主清单的 `rope-e2e-runner`，否则带明确指令的通用只读叶子并记录类型。每份简报对应一条旅程，收集全部结构化返回；空返回是阻塞，绝非通过。每条旅程**必须派 runner 叶子执行**；父编排器不能自行驾驶来代替失败或空派发。

旅程简报约 40 行，沿用切片预算纪律：

```md
# E2E Journey <id> — <issue slug>
Issue/base commit: <路径 / 提交>；服务栈已运行，入口如下。
禁止重启 / 重建服务；未就绪时报告阻塞。
Items: <E#> <mechanism> — <逐项通过标准>。
Entrypoint: <项目声明的 URL / CLI / 真实通道>。
Browser session name: <journey-id>，隔离会话，不碰其他会话。
Steps: 按用户操作写 Given/When/Then。
Evidence: 存入 <issue>/evidence/e2e/；每项记录工具 / 命令及产物路径。
失败步骤记录做了什么、观察到什么、违反哪条标准。
Bounds: 代码只读，禁止派生代理，只走真实入口；注入 / fixture 不可替代。
Return: journey id; items [{id, verdict pass|fail|blocked, evidence}];
steps executed; blockers [{class, detail}]; notes ≤5 行。
```

**修复循环。**`agent_failed` 产生一份实现者修复简报，原样转录 runner 失败，不新增验收要求。代码缺陷按 [TDD](tdd.md) 在合适的已定公共边界先加失败回归，再最小实现至通过；边界缺口遵守已有计划调整规则。环境 / 部署缺陷保留对应真实环境验证，不强塞入普通 TDD。服务栈操作和 E2E 仍由父编排器、runner 负责。每轮必须缩小失败集，首个无进展轮次触发人工升级停止。修复合并后：差量代码复审，在新 HEAD 重新部署，重跑受影响旅程及共享入口冒烟；复用证据逐行注明提交，旧 HEAD 的通过不能当作新 HEAD 证据。

**交付门槛。**每个必需 E2E 项均需成功证据：runner 的 `agent_passed` 或用户亲自执行的 `user_confirmed`；否则必须有**逐项明确用户豁免**，记录为豁免，不能记通过。沉默不是豁免。其他状态均阻塞运行，升级时列出确切未证明项目。通过后关闭服务栈并记录，在 tasks.md 写阶段结论，交给 `rope-finish`。

<a id="e2e-execution-statuses"></a>
## E2E 执行状态

 e2e.md 只记录**真实环境行为**（真实 API、入口、外部系统）。工单级单元留在 TDD 证据。

执行者依据能力确定，见 gates-and-vocab：读机制标签、探测宿主工具，工具覆盖的机制均由 agent 执行。用户在 go 中说“你自己跑吧”，等于较晚触发能力探测；执行并记录 agent 证据，不当作例外。

**派发前写入 e2e.md。**每项带 `executor`（`agent` | `agent-with-gate` | `user` | `not-run`）和 `decision`；授权动作无已记录 `approved` 不得开始。执行项写 `preset`，未执行项写 `reason` 并保留终态，不能让主动跳过与条目缺失无法区分。

只有 `agent_passed` 或 `user_confirmed` 成功证据支持交付。必需项未执行（user、not-run、拒绝授权）可如实记录终态，但只有逐项明确用户豁免后才能交付；否则阻塞。叶子执行后返回 `blocked` 不是通过。

- `agent_passed`：agent 执行通过，记录命令和证据。
- `agent_failed`：已执行但失败，修复或记录阻塞。
- `blocked_on_gate` / `blocked_on_user`：缺授权 / 需人工判断、认证或不可达。
- `skipped_by_user_at_shape` / `not_run_with_reason`：有意跳过。

<a id="commit-rules"></a>
## 提交规则

- 每个完成切片独立提交，审查修复独立提交，不合并无关切片；未被要求时不 push / merge / rebase。

<a id="handoff-checklist"></a>
## 交接清单

- 各切片提交齐全；结束审查结论、修复轮次及身份已记录；E2E 阶段结论已记录，各项终态，工作树干净。
- tasks.md 已记录架构来源 / 落点证据、声明的检查覆盖、逐项例外差异审查及已定处置。

---

<a id="fault-manual-read-on-failure-not-upfront"></a>
## 故障手册（失败时读，不在启动时加载）

**缺宿主预设**，即 `~/.config/rope/harness/<host>.json` 或 rope-* 代理缺失：使用不固定模型的通用宿主叶子，tasks.md 记 `preset_missing` 后继续；不能自动运行 `rope-harness-presets`，不因此硬阻塞。

**不能后台派生：**前台逐叶子执行波次，在并行声明记录理由。

**请求 worktree 但返回无分支名 / 仍是主检出：**记录降级到共享检出，遵守 shared 纪律。

**完全无法派生审查叶子：**自行审查，记录 `review_degraded: no_subagent_tool_available`、已尝试内容及原因。能派生时不能默默跳过，也不能要求实现者审自己。

**叶子截断 / 中途终止：**先查 git 状态和测试状态，恢复未提交工作或重置后再改简报派发。

**实现者配额耗尽，429 / Insufficient Quota / Terminal API error：**使用宿主清单的 `roles.implementer.backup_model` 与 `backup_thinking`，以 `Agent({ subagent_type: "rope-implementer", model: backup_model, thinking: backup_thinking, ... })` 重派受影响切片。tasks.md 记录 `implementer_degraded: switched to <backup_model> (quota)`，本 issue 剩余切片持续沿用降级。清单无备用模型则立即人工升级停止。
