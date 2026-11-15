<a id="gsd-gsd-quick-comparison"></a>
# GSD /gsd-quick 对比

<a id="question"></a>
## 问题

GSD 的 `/gsd-quick` 如何处理临时小任务？`rope-quick` 应采纳或拒绝哪些保证及缺省行为？

<a id="verified-facts"></a>
## 已核验事实

<a id="gsd-quick-scope-and-quality-stages"></a>
### /gsd-quick 的范围与质量阶段

Fact: `/gsd-quick` 定位为带 GSD 保证执行临时任务。质量阶段通过可组合的可选参数开启：`--discuss` 为计划前轻讨论；`--research` 派专注调研者；`--validate` 做最多 2 轮计划检查及执行后验证；`--full` 包含全部。默认仅执行。
Source: https://github.com/gsd-build/get-shit-done/blob/main/docs/COMMANDS.md
Verified by: 2026-03 抓取 COMMANDS.md。
Stability: medium，GSD 迭代快，v1.40+ 有命名空间路由。
Implication: GSD 默认的第二道检查是测试套件，更强保证须手动开启。

<a id="no-code-review-inside-quick"></a>
### quick 不包含代码审查

Fact: 即使 `--full`，`/gsd-quick` 也不做代码审查；审查属于独立质量门槛命令，如 `/gsd-code-review`、UI 审查、审计。`--validate` 增加计划检查和执行后验证，不派独立代理审 diff。
Source: 同一 COMMANDS.md；USER-GUIDE.md 的质量门槛命名空间。
Verified by: 内容抓取。
Stability: medium。
Implication: 调查到的快速路径没有自动附带审查叶子。

<a id="persistent-quick-task-state"></a>
### 持久小任务状态

Fact: 小任务有 slug，支持 `list` / `status <slug>` / `resume <slug>`，像小阶段一样可跟踪、恢复。
Source: 同一 COMMANDS.md。
Verified by: 内容抓取。
Stability: medium。
Implication: 小任务单页持久记录有上游先例；Rope 对应单个 `quick.md`。

<a id="no-entry-gate-no-mid-run-stop-rules"></a>
### 无入口门槛或运行中停止规则

Fact: GSD 文档不限制哪些任务进入 `/gsd-quick`，也未规定任务膨胀后何时停。GSD 没有更重的逐任务流程可退回：其单位是 phase，而 quick 不属于 phase。
Source: COMMANDS.md + USER-GUIDE.md 的操作说明与参数表。
Verified by: 内容抓取。
Stability: medium。
Implication: Rope 有更完整的 grill → shape → go → verify 流程，quick 需能交回，因此必须自定停止线。GSD 的沉默来自结构，不代表停止线无必要。此处 verify 是研究时的流程名称，现已并入 finish。

<a id="summary-for-the-decision"></a>
## 对决策的结论

GSD 支持无入口门槛、默认无审查、持久小任务记录，但无法回答 Rope 的停止线问题，因为它没有回退流程。Rope 自身 ADR 0004 的证据显示审查通过后 verify 仍发现安全 / 并发遗漏，因此交给人时不能毫无风险提示；rope-quick 用定向风险焦点辅助验收，没有照搬 GSD 的裸执行默认值。
