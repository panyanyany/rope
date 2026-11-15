<a id="0012-worktree-verified-full-demotion-of-file-overlap-edges"></a>
# 0012 经核验 Worktree 模式下完全降级 file-overlap 边

**状态：**active，细化 [0011](0011-edge-classification-and-acceptance-gates.md)第 1 项，扩展 [0008](0008-slice-ready-worktree-execution.md)。

日期：2026-09-01。

<a id="decision"></a>
## 决策

1. shape 验宿主隔离派生能力，tasks 头记 Execution mode: worktree/shared 及证据；go 消费记录，能力不符降 shared 并记理由。旧包仍按宿主及仓库准备行推导。
2. 已核 worktree 的 file-overlap **从不阻派**，可并发，只约束串行合并顺序，每冲突对重派一次。seam-required 两模式始终阻派，尚无边界属于不可用，不是冲突。shared 不变。
3. 大重构仍先 prefactor、expand-contract。整批重命名 / 类型重塑是 shape 问题，不能靠降级掩盖。
4. 冲突在未合并分支处理，将已落地相邻分支 merge/rebase 进来；未合并简报 / 提交是主要意图来源，创作者通常最便宜解决。

<a id="context"></a>
## 背景

隔离已有独立索引 / HEAD 防写破坏，但 0011 所有模式的重叠边还压启动宽度。上游 implement-spec 不以重叠阻派，冲突 FAQ 建议大重构优先，而非阻所有同文件并行；创作会话负责合回。无条件准备第 0 步移除环境不确定性。用户 2026-09-01 选择完全降级而非仅小重叠，保留拥有文件事实，以一次冲突重派换最大反链。

<a id="consequences"></a>
## 后果

启动宽度由仅 seam-required 图反链决定；重叠成本移合并。密集重叠可能合并串行 / 重派增加，shape 用前置重构、扩展收缩、真实边界标签缓解。标签名及判据不变，只重叠效果随模式变；拥有文件唯一性仅限 shared 同波。
