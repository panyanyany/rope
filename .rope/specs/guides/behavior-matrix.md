<a id="behavior-matrix-guide"></a>
# 行为矩阵指南

shape 或实现 issue 时，用行为矩阵显式列必需场景，并指定验证路径。

<a id="purpose"></a>
## 目的

- 对常见行为类别明确 yes/no。
- 每适用行绑定真实测试、冒烟或有理由的明确豁免。
- 防止只有成功路径的切片算完成。

<a id="default-rows"></a>
## 默认行

| 行 | 要问的问题 |
| --- | --- |
| 主路径 | 主要成功流程是否端到端成立？ |
| 其他输入 / 入口 | 是否覆盖其他合法入口？ |
| 空 / 缺输入 | 缺少必需输入会怎样？ |
| 无效 / 畸形输入 | 是否可见地拒绝错误输入？ |
| 依赖不可用 / 未就绪 | 缺失或不可用依赖怎样失败？ |
| 重复 / 幂等 | 重放是否安全，或正确拒绝？ |
| 边界 / 限额 | 是否处理边缘和上限？ |
| 已有行为兼容 | 相邻行为是否保持？ |
| 真实入口 / 集成 | 是否实际走入口，而非只测单元边界？ |

<a id="rules"></a>
## 规则

- 仅适用行标 yes，每个 yes 都有测试、冒烟或有理由豁免。
- tasks.md 声称不算证据，必须有代码或记录的运行输出。
- 测试接口的证明范围在[Testing Decisions 和切片测试](../../../skills/rope-shape/references/issue-package.md)声明；[行为审查](../../../skills/rope-go/references/execution-rules.md#reviewer-brief)判断是否证明切片承诺。[E2E 修复](../../../skills/rope-go/references/execution-rules.md#e2e-acceptance-stage-after-review-approve)区分代码回归与环境 / 部署验证。
- issue verify 只查 go 后已记录审查 / E2E，不判代码 / 产品，不仅凭切片自报验收。
