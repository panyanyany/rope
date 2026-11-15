<a id="0004-risk-tiered-review-mode-and-lean-leaf-briefs"></a>
# 0004 按风险分层审查与精简叶子简报

> **状态：已由 [0007](0007-graph-driven-go-single-review.md)替代。**单次结束审查替代逐片 / 批量模式，精简简报纪律由 0005 延续。下文保留原决策历史。

原决策新增 shape 时用户选择的每 issue 审查模式 review: per-slice | batch，缺省逐片。batch 高风险片仍逐审，其余代码延到一次结束批审；go 去父整体审查，由 verify 保留父级组装判断。约束包改路径引用、ID、短全局不变量，父启动轻载元数据、契约、状态、包索引，按需深读。

<a id="context"></a>
## 背景

agent-workbench 101 issue 的 review-cost-token-efficiency 数据：377 required、67 self-check，至少 84 结论和 46 降级。发现集中安全 / 失败路径，其他低产出。verify 在片审和整体审均通过后仍抓安全、并发、E2E 漂移，如 pi-migration-toolset、agent-turn-concurrency-scheduler、webui-channel-integration。最贵是 verify 修复，单 issue 最多 13 轮，不是派发审查；批审必须先于 verify。中位五片包每轮简报复制约 18KB。

一手来源研究显示多数系统按交付 / 无人运行结束审，不逐内部单元派新审查，也不对同 diff 做两次同范围模型阅读；干净上下文和引用标准更便宜有效。

<a id="decision"></a>
## 决策

1. prd frontmatter 加 review: per-slice | batch，shape 手动选择，缺省逐片，与原 dynamic 可选方式一致。
2. batch 模式片标 required（公共接口、外部 adapter、认证 / 密钥、持久化 / schema、路由 / 组装、跨层、E2E 关键）、batch（其他代码）、self-check（文档 / fixture）。逐片模式仍二级。
3. 有 batch 片时父派一个全新 reviewer 审这些累计 diff，契约 / ID 引用加载，tasks 各片记录结论和身份。发现进入原最多两轮修复再人工停止。
4. 父不再 go Overall Review，组装判断进批审和 verify；go 只查提交、审查、E2E、无无关脏文件。
5. 简报带包路径、切片 ID、短全局不变量，叶子自读细节并逐 ID 确认 / 报冲突。不允许一句遵 ADR，也不复制完整包。
6. 父轻载 frontmatter、契约、Testing Decisions、影响、包索引、状态，派相关片时才深读条目。

<a id="why-this-split"></a>
## 理由

风险边界才有高审查收益；新视角组装审先抓集成缺陷，避免昂贵 verify 循环。go 整体与 verify 重复，保更强证据核验。实现 / 验收分离不变，批审是真只读叶子，不能实现者自审或静默降级。

<a id="consequences"></a>
## 后果

典型六片从约六次审查降两次，一高风险加一批审；简报 / 父增长放缓。verify 查批结论真实性。dynamic 并发、提交、禁嵌套不变；旧包无 review 保原行为。批发现同样修复 / 人工停止。

<a id="considered-options"></a>
## 考虑过的方案

缩全局风险清单不可逆；保两父审重复；合批审进 verify 使问题延后、修复贵；只换便宜模型不减次数、简报和父成本。均拒绝。
