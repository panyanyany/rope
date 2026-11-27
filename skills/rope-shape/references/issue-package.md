<a id="rope-issue-package-template"></a>
# Rope issue 包模板

填写 issue 包时，遵守[中文文档写作规则](../../rope-grill/references/content-design.md)。保留协议字段名和枚举值，使用中文说明具体要求。

<a id="directory"></a>
## 目录

```text
.rope/issues/<issue-slug>/
  prd.md
  tasks.md
  e2e.md
  map.md   # 可选：每行一个事实，带路径和日期，供叶子共同定位
```

## `prd.md`

```md
# <issue 标题>

## Problem Statement

<用户面对的问题。>

## Solution

<用户可见的解决方案。>

## Contract Note

- <3–5 个单句：issue 完成后能观察到什么？适用时说明失败可见性。直接投影自 Behavior Contract，不另列愿望。>

## Goals

- <目标>

## Non-goals

- <不在范围内的目标>

## Public Interface / Behavior

- <可调用 API、UI 行为、CLI、配置、schema、副作用或可观察结果>

## Testing Decisions

- Good test: 在已定边界观察外部行为，不检查实现细节
- Seams under test: <shape 根据契约及来源确定的公共接口；仅当选址影响行为或授权时请用户决定；逐项说明可证明的行为及无法证明的部分，把真实环境限制映射到 e2e.md；接口足以证明行为即可，不必是系统顶层入口；选址有争议时参考 [seam-design.md](seam-design.md)>
- Prior art (optional): <仓库中相似测试的路径或模式>
- Test scope: <受影响模块 / 消费者、所选命令、排除的套件及理由>
- Contract sweep (only when the issue retires or re-keys a contract): <全测试树搜索的契约词汇、命中文件、在本 issue 迁移的命中项，以及具名排除项和理由>
- Broader-suite trigger: <影响 / 不确定性 / 仓库要求，或 none；遵守[测试选择](../../rope-go/references/execution-rules.md#test-tiers--baseline-ladder-repo-contract)>
- Repo suite policy: <`fast-iteration` | `full-at-freeze`，从 routes.md 的 Test policy: 复制；未声明则写 undeclared，由影响阶梯决定>
- Architecture guards: <命令、完整架构覆盖、受影响切片检查和证据 ID；或 none found 及人工不变量审查范围>
- Exception lists: <检查白名单 / 豁免路径与比较基线，或 none found；新增 / 删除 / 修改均需逐项理由与处置引用>

## Behavior Contract

- System under test: <规定并测试的行为>
- Trigger/input: <用户操作、API 调用、事件、命令或状态变化>
- Collaborators: <参与但不拥有该行为的依赖>
- Observable result: <证明成功的输出、状态、产物、UI、日志或副作用>  <!-- Contract Note 每点都须投影自此字段或 Failure visibility -->
- Failure visibility: <错误在哪里、以何种方式可见>
- Forbidden shortcuts: <违背意图的实现路径>

## Architecture Impact

- Impact: required | not-applicable
- Trigger check: <required 写命中的触发项；not-applicable 说明已检查全部触发项且均未命中的理由>
- Relevant decisions:
  - ID: D1
    Source: `.rope/adr/NNNN-slug.md` or `.rope/specs/<area>/<topic>.md` + 章节名
    Decision status: active | superseded | deprecated | provisional | unknown
    Scope: <覆盖的行为与边界>
    Decision disposition: inherit | extend | supersede | exception | not-applicable
    Inherited invariants:
      - <行为或依赖不变量>
    Affected public interfaces: <接口边界或 none>
    Forbidden shortcuts:
      - <虽能过浅层测试却违背意图的偷懒路径>
    Required evidence: <测试、集成检查、审查判断或文档>
    Applies to: issue | Slice N | e2e | verify
    Documentation update: pending-finish | updated-existing | added-new | no-new-decision | exception-recorded
    Unresolved conflicts: <none，或冲突来源和受影响行为>
- New decision candidate: none | <ID、范围、风险、已定决策 / 理由；找不到已有来源时，将其不变量 / 边界 / 证据映射到约束包>
- Constraint Bundle:
  - Decision sources: <ID 和路径>
  - Decision statuses: <来源状态>
  - Scope: <全 issue 及切片 / e2e / verify 映射>
  - Invariants: <ID 或精简列表>
  - Public seams: <已确认边界>
  - Forbidden shortcuts: <ID 或精简列表>
  - Acceptance evidence: <测试、集成、审查或文档证据>
  - Open conflicts: <none 或明确冲突>

## References

- Research: `.rope/research/<topic>.md#<anchor>`
- Spec: `.rope/specs/<area>/<topic>.md`
- ADR: `.rope/adr/NNNN-slug.md`

## Open Questions / Human Gates

- <问题或授权项>

## Gate Decisions

- Gate: <验证名称>
- Decision: approved | skipped | user-run | blocked | not-run-waived
- Approved action: <动作而非精确命令；已批准 agent-with-gate 必填>
- Scope: <仓库 / 环境 / 资源边界>
- Risk: <需要授权的理由>
- Pass criteria: <可观察的成功条件>
- Failure report: <失败时用户或 agent 应报告的内容>
- Forbidden out-of-scope actions: <需要重新批准的动作>
```

## `tasks.md`

```md
# <issue 标题> Tasks

Execution mode: worktree | shared   # shape 探测；go 使用，可降级但须记录原因

## Graph summary

<报告执行者编译出的图，不手算：初始就绪数、各层宽度、最长阻塞链、跨层偏好边。n 层链无论窗口多大都需要 n 轮串行。>

## Behavior Matrix（issue 行为规范 — BDD）

| 行为（适合时使用 Given/When/Then） | 适用？ | 验证位置 |
| --- | --- | --- |
| 主路径 | yes/no | 工单 TDD / issue 结束审查 |
| 其他输入或入口 | yes/no | 工单 TDD / 审查 |
| 空或缺失输入 | yes/no | 工单 TDD |
| 无效或格式错误输入 | yes/no | 工单 TDD |
| 依赖不可用或未就绪 | yes/no | 工单 TDD |
| 重复或幂等情形 | yes/no | 工单 TDD |
| 边界或限额情形 | yes/no | 工单 TDD |
| 已有行为兼容性 | yes/no | 审查 |
| 真实入口行为（真实 API / 环境语义） | yes/no | e2e.md + 审查探测 |

## Slice 1: <标题>

- Status: pending
- Kind: vertical | contract | wide-refactor-expand | wide-refactor-migrate | wide-refactor-contract
- Goal: <切片实现的用户视角端到端结果，不是层列表>
- Demo path: <切片落地后可演示的行为，不能是层名>
- Blocked by: none | Slice N, … (<逐边标记：file-overlap | seam-required | methodology-order>)
- Scope: <路径 / 区域边界；并行时与同批切片不相交>
- Owned files: <明确拥有文件；shared 同波次归属唯一；已记录 worktree 模式允许重叠，用 file-overlap 边表示>
- Size cap: <默认约 400 行 diff 或 4 个拥有文件；超出则拆分>
- Matrix rows:
- Constraint IDs: <必填：适用全局及切片 ID；或 none 及已核验不适用理由>
- Required reading: <必填：对应 ID 的生效来源路径及章节，含状态 / 范围上下文；或 none 及理由>
- Required evidence: <矩阵证据 ID + 架构证据 ID；前者引用证明的行，后者引用约束 ID；包括来源阅读、Architecture landing、受影响检查 / 例外差异证据>
- Public behavior: <用一句话说明切片完成后用户可见的能力>
- Tests: <Testing Decisions 已定边界，以及证明本片 Public behavior / 矩阵行的可观察结果>
- Implementation notes:
- Verification: <本片可能影响的聚焦边界测试和检查，不跑全量套件>
- Stop conditions:

## Architecture execution evidence（go 期间填写）

- Per-slice reading / landing: <切片及证据 ID → 实际来源阅读记录及编辑前落点记录；适用时写有理由的 none，或如实记录遗漏 / 补救>
- Architecture guards: <接受提交、覆盖、命令、退出状态、输出路径；或缺失记录及人工审查结果>
- Exception delta: <比较基线 → 接受提交；逐项新增 / 删除 / 修改写路径、原因、约束 ID、处置 / 确认、到期或失效条件；或 none>
- Architecture review: <审查者身份、来源阅读引用、归属 / 边界 / 不变量 / 例外结果>
- Conflicts / changed dispositions: <解决结果及所需用户确认引用；或 none>
```

所有切片都必须能在一个全新上下文窗口内完成。超出大小上限时，在 shape 阶段重新拆分，不得带着超量切片进入交付。

Architecture landing（架构落点）最多三行，说明复用的已有职责、使用的公共边界，以及保留的职责归属和依赖方向。实现者必须在读完来源后、写代码前记录，并将记录作为证据返回。填写 `none` 时，必须附已核验的不适用理由。该记录不增加批准轮次。见[整包就绪检查](architecture-continuity.md#package-readiness-gate)。

`Verification` 默认**聚焦**于本片可能影响的边界测试和检查，耗时应为秒而非分钟。全量套件属于 **issue 级**检查（go 基线回退、结束组装检查）；写进切片会让每个叶子承担全包成本。保行为重构若需完整安全网，在 Testing Decisions 说明理由，并在 issue 级执行，不逐片运行。

## `e2e.md`

```md
# <issue 标题> E2E

## E1 <验证名称>

Architecture evidence: <约束 / 决策 ID 及本项验证的行为或不变量>
Mechanism: browser-walk | cli | api | file-inspect | judgment | credentialed | unreachable
Executor: agent | agent-with-gate | user | not-run   ← go/verify 按宿主能力探测确定，不在 shape 固化
Risk: local-readonly | local-write | remote-readonly | remote-write | production | human-judgment
Gate Decision: not-required | approved | skipped | user-run | blocked | not-run-waived
Approved Action: <动作而非精确命令；已批准 agent-with-gate 必填>
Scope: <仓库 / 环境 / 资源边界>
Command or Steps:
- <命令或步骤>
Pass Criteria:
- <可观察通过条件>
Failure Report:
- <失败时应采集或报告的内容>
Forbidden Out-of-Scope Actions:
- <需要重新批准的动作>
Result:
- pending
```
