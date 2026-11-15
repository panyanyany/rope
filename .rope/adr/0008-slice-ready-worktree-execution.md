<a id="0008-slice-ready-worktree-execution"></a>
# 0008 按切片就绪的 Worktree 执行

**状态：**active，细化 0007 波次，切片哲学再由 [0009](0009-ticket-tdd-issue-bdd-layering.md)细化。

日期：2026-08-23。

<a id="decision"></a>
## 决策

1. 宿主可隔离叶子时，由波次改**切片就绪**：阻塞项全部合并即从最新合并 HEAD 切独立 worktree 派发。无波次屏障，图就是调度器。
2. 串行合并队列替代波次边界；父逐个合并，每次重算就绪，冲突带两分支重派一次实现者。
3. worktree 可测试是仓库契约，routes 一行 worktree-setup 命令或 host-managed。三层：宿主准备、声明命令、未声明。未声明先试 green，环境失败阻塞，不耗修复轮次，剩余转 shared。
4. worktree 的 map 归父，叶子摘要报证伪 / 所需行，父合并后写，禁止并发共享写。
5. 重叠片可并行，成本留合并冲突；拥有文件不相交仅 shared 安全规则，无隔离宿主回退 shared。
6. 两模式默认并发。2026-08-24 首次现场因摩擦串行唯一并行对后明确：每就绪片后台派发，一对也并行；收益小可影响准备成本权衡，不能单独成为串行理由。所有串行记录原因；修复不暂停其他就绪片。启动声明最大 X（最宽波 / 最大反链）、计划 Y，Y<X 给理由。

<a id="context"></a>
## 背景

共享检出只有一个 HEAD，波次是粗安全屏障。pi isolation: worktree、Claude --worktree 去除此约束，各叶子有独立最新基线。01a01ece 每片 7–32 分钟差异大，波次浪费等待，河流 shape 已识别。

worktree 不复制未跟踪依赖，所以必须准备。agent-workbench 的 herdr 在创建时链接依赖属 host-managed，其他仓库声明命令。

<a id="why-this-shape"></a>
## 理由

图才是真依赖，切片就绪收回时长差异造成空闲；隔离后冲突通常比丢并发便宜。不逐合并测：片 TDD、下游用已合并上游，组装审查接受整体。

<a id="consequences"></a>
## 后果

循环为查就绪 → 派 worktree → 合并队列 → 重复。仅 worktree 的 map 改由父写。安装 / 链接成本确实存在，但每仓一行，shape 可为旧仓补契约，无需重 init。

<a id="alternatives-considered"></a>
## 考虑过的方案

- 保波次、每河流一 worktree：未充分利用调度简化，替代。
- 每合并集成测试：重复下游 TDD 与结束审查，拒绝。
- 先等波次现场数据：用户决定能力探测后同时支持两模式。
