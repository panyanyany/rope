<a id="shape-gates-e2e-classes-vocabulary"></a>
# Shape 授权、E2E 分类与术语

<a id="e2e-executor-rules"></a>
## E2E 执行者规则

每个 E2E 项都标记**验证机制**，说明如何观察行为：`browser-walk` | `cli` | `api` | `file-inspect` | `judgment` | `credentialed` | `unreachable`。在 go/verify 阶段按**宿主能力探测**（实际可用的浏览器自动化、HTTP/CLI、文件检查工具）确定执行者，不在 shape 固化：

- 探测到工具覆盖该机制：由 **agent** 执行，记录 `agent_passed`、工具和证据。有浏览器自动化时，所有 `browser-walk` 都可由 agent 执行；只有驱动过程需要人工判断时才留给 `user`。
- 工具覆盖，但涉及重启 / 部署 / 共享写入 / 昂贵操作：**agent-with-gate**，先批准再执行。
- `judgment`（品味、签字）、`credentialed`（双因素认证、私人会话）、`unreachable`：**user**，这些是稳定的人工类别。
- 范围外：`not-run`，附原因和用户接受的豁免。

每项的 `executor`、`decision` 写入 `e2e.md`；不执行的项目还要写 `reason`。没有批准记录的 `agent-with-gate` 不能开始；排除的项目保留决定记录，不能删掉。

E2E 只包含**真实环境行为**（真实 API、入口、数据）。工单级单元验证留在 TDD 证据中，不写成 E2E 项。不再使用 `covered_by_slice` 记账：能标为该值的条目本就不属于 e2e.md。

<a id="gate-approval-rules"></a>
## 授权规则

- 批准的是**动作**，不是精确命令，例如“重启本地开发服务器”。
- 每项批准明确范围、风险、通过标准及禁止的越界动作。
- go 可自行选命令；只有动作 / 范围 / 风险 / 环境 / 目标变化才重新询问。
- 用户跳过的 agent-with-gate：go 记录 `skipped_by_user_at_shape`，不执行。

<a id="vocabulary-do-not-blur"></a>
## 术语（不能混用）

| 术语 | 含义 |
| --- | --- |
| **Issue package（issue 包）** | `.rope/issues/<slug>/{prd,tasks,e2e}.md` |
| **PRD** | `prd.md` 的产品 / 需求说明 |
| **Slice（切片）** | `tasks.md` 中的纵向单元 |
| **Spec（规范）** | `.rope/specs/**` 的架构契约，不是 PRD |
| **ADR** | 难以逆转的架构决策 |
| **River（河流）** | 无依赖切片簇，图中独立的另一条旅程 |
| **Wave（波次）** | 切片图的拓扑层级，前沿切片并发执行 |
| **Map（调查图）** | `<issue>/map.md`，每行一个带路径和日期的事实，供叶子共同定位 |
| **Component slice（组件切片）** | 交付一个用户故事的部分能力；简报引用故事行和自身完成标准，符合 tracer-bullet 切片法 |
| **Prefactor（前置重构）** | 先调整结构以简化后续切片，通常是获得较宽并行度的第一步 |

上游的“spec/ticket”只用于谈论上游；Rope 自己的产物使用 Rope 名称。

<a id="edge-classification"></a>
## 边分类

shape 给每条 `Blocked by` 边恰好一个标签；`seam-required` 始终阻塞派发，`file-overlap` 取决于模式：

| 标签 | 判断依据 | 效果 |
| --- | --- | --- |
| **file-overlap** | 下游读写上游拥有的文件，须核对 Owned files，不能凭直觉 | shared 阻塞派发；已记录 worktree 模式下只表示**合并顺序偏好**，可并发派发，串行合并，冲突后重派一次 |
| **seam-required** | 下游依赖上游尚需创建的公共边界 | 两种模式都阻塞派发 |
| **methodology-order** | 无文件重叠、无边界消费，只是“先做更好理解”，如先埋点再重构 | 仅合并顺序偏好，go 可跨边派发 |

缺标签是 shape 缺陷。“感觉串行更安全”不是标签，至多是合并顺序偏好。

<a id="slice-granularity-hard-rules--anti-patterns"></a>
## 切片粒度硬规则与反模式

- **演示路径，每片必填：**“该切片落地后能演示什么？”必须是行为，不能回答层名，如“schema 完成”。
- **下限：**整个改动装得进一个全新上下文窗口，就不要建多切片 issue，推荐 `rope-quick`；编排成本会超过收益。
- **上限：**一个切片约一个全新上下文窗口，默认约 400 行 diff / 4 个拥有文件；超出立即重切。
- **默认窄切：**窗口上限是重切红线，不是填满目标；切出具有自身演示路径、可独立验证的最小行为。宁可更多更薄，也不要少数塞满；文件不相交即可并行。
- **两阶段契约切片：**深层持久性 / 并发 / 协议工作拆为薄接口 + 加固；消费者只阻塞于薄接口。
- **消费者检查，适用于边界迁移：**移动 / 重命名共享边界的切片必须在 Required evidence 中声明全仓旧符号 `grep` / 导入图断言，零命中或逐个解释。拥有边界不等于拥有消费者；无人负责扫描会遗漏组装文件并让旧符号残留。
- **反模式：**按层横切；过度拆分导致失去有意义的组合；验收条件在基线提交已成立、只能靠别片完成，或只是重述需求而非检查产物。上游实际经验表明横切会增加重复代理执行和返工。

<a id="wide-refactor-expandcontract"></a>
## 大范围重构（扩展—收缩）

单个机械改动波及很广时，不要伪装成独立小片。tracer-bullet 仍适用，但沿 expand → migrate → contract 链切，不横向拆链。顺序为扩展 → 一批或多批迁移 → 收缩；使用 `Kind: wide-refactor-*`，沿链声明 Blocked by，优先保持每批通过检查。

<a id="frontier-waves-rivers"></a>
## 前沿、波次、河流

必须从 `Blocked by` 读取切片图，不能猜。

- **前沿：**没有未解阻塞项的切片；拥有文件不重叠的前沿切片并发。
- **波次：**图的一个拓扑层，N 波清空后进入 N+1 波。
- **河流：**与图其余部分既无直接边也无传递边的切片簇。两条河流是两段旅程；shape 提供拆成各自可独立交付的 issue，或保留一包并由 go 并行执行。不能为回避选择而把河流合成一片。
