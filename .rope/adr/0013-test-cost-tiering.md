<a id="0013-test-cost-tiering--impact-before-suite-size"></a>
# 0013 测试成本分层：影响优先于套件大小

**状态：**active，经 dynamic-docs-and-clear/quick.md 用户确认修订原全量频率。补 [0009](0009-ticket-tdd-issue-bdd-layering.md)，细化 [0011](0011-edge-classification-and-acceptance-gates.md)，保留 [0007](0007-graph-driven-go-single-review.md)单审查及 [0008](0008-slice-ready-worktree-execution.md)不逐合并测试。

2026-09-23 范围说明：内核通过 run-check.sh 执行 l2/l3 的机械部分随 [0016](0016-single-execution-form-agent-dispatch.md)退役。影响选择、一次运行显示失败、full 指范围、偶发失败纪律仍在 go 规则生效。

<a id="context"></a>
## 背景

agent-workbench MR 57 有 18 条逐片全量验证。重复发现、管道丢退出状态、并发 CPU 争用放大重跑；后续 dynamic 把上限误写成“恰好两次”，违背基线复用，按阶段跑无关套件。阶段本身不是依赖证据。

<a id="decision"></a>
## 决策

1. 按行为、共享消费者、不确定性选测试。切片聚焦，集成覆盖受影响边界，结束按矩阵与真实入口验收。共享基础设施、未知影响、观察耦合、仓库明确要求才扩大，理由进 Testing Decisions。
2. 全套是 issue 级证据，不逐片必跑。基线和结束是选择点，不是必执行点。后端局部不自动跑前端，改共享契约才纳相关消费者。
3. 复用同 HEAD、范围环境匹配的通过证据；否则 quick / 聚焦，再按影响扩大。子集通过不等于全仓通过。输出及退出码只保存一次，再解析。
4. 保留 routes 的 Test tiers 和自动推导 quick。操作标准 / 预算 / 阶梯仅在[执行规则](../../skills/rope-go/references/execution-rules.md)。
5. 并发负载失败先诊断 / 重跑失败项，扩大须理由。缺证据退叶子，不由父补跑或静默替代。

<a id="consequences"></a>
## 后果

全套不随片数线性增长，也不为配额执行。聚焦可能晚发现无关失败，证据如实限定范围，不明影响保守扩大。明确仓库全套政策仍遵守，不为省时覆盖。无新缓存服务或选择运行时，依据仓库命令和验收判断。

<a id="addendum-2026-09-11-the-check-timetable-evidence-reuse-and-the-repo-policy-field"></a>
## 附录：检查时序、证据复用及仓库政策（2026-09-11，机械部分已退役）

原选择原则正确但缺传递机制。首次 dynamic 约跑 11 次全套，占 73 分钟中的 38 分钟；后审计又在零合并检出运行集成门。以下记载当时机制，退役范围见开头。

<a id="decision-1"></a>
### 决策

1. 检查是带 merge/l2/l3/freeze 阶段的数据，父从 routes 编译，内核通过 run-check.sh 获退出码，不信代理口述。
2. 复用键为 scope@integrated commit set，同状态复用证据，新范围 / 提交失效。每批在派发排空后运行，不与叶子并行；merge 廉价因在 L2 前，不是因重叠。
3. 新增 Test policy: fast-iteration / full-at-freeze，仓库自行声明，缺省合法、由阶梯判断，shape 复制 Testing Decisions。
4. 父不补缺证据，明细在证据文件，切片缺项按返回检查退叶子。

<a id="consequences-1"></a>
### 后果

当时通过产物保证“full 是范围而非频率”；昂贵重复需改键或删证据。证据存 issue/evidence，delivery gate 的 --evidence 排除及仓库 ignore 保持状态真实，不躲在 .git。人工检查不进 checks，仍在 E2E 显示 blocked_on_user。
