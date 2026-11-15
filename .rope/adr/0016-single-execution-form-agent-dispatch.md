<a id="0016-single-execution-form--parent-agent-dispatch"></a>
# 0016 唯一执行形态：父代理派发

**状态：**active，完整替代 [0014](0014-workflow-execution-mode.md)：dynamic、go-execute.js 内核、execution-template 计划 / 记录、全局配置 execution 解析、L1/L2/L3 菜单及并行配额全部退役。[0008](0008-slice-ready-worktree-execution.md)、[0012](0012-worktree-verified-full-demotion-of-file-overlap-edges.md)不受影响，worktree/shared 是隔离模式，不是执行形态。[0015](0015-agent-mode-e2e-acceptance-stage.md)仍生效，为唯一 E2E 路径。

日期：2026-09-23。

<a id="context"></a>
## 背景

0014 内核未达生产质量：合并分类已知缺陷、离线冒烟未绿、机器配置始终 agent 并注“修好前禁用”。确定性形式承诺节约上下文、机械检查，却让每技能承担双路径、启动契约、479 行计划 schema 成本，实际使用始终派发。

<a id="decision"></a>
## 决策

彻底退役 dynamic。父模型直接按 execution-rules 管切片、队列、结束审查、E2E。整体集成由矩阵组装审查加 E2E 覆盖，不把旧 L1/L2/L3 和机械双断言另抄成文字；父原生持状态，遗漏在审查 / E2E 暴露。

grill/shape/go 单路精简，删除启动解析与内核引用。未来确定性执行者若回归，必须新 ADR 且到来时测试全绿。

<a id="consequences"></a>
## 后果

只剩一路文档、测试、阅读，包无执行形态维度。父上下文保护只靠引用简报、摘要而非轨迹。失去确定性回放 / 前缀缓存续跑及退出码 gate，但宿主原生 runner 仍可独立使用，Rope 不依赖。
