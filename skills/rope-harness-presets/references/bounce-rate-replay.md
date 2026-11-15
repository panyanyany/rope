<a id="planner-bounce-rate-replay-protocol"></a>
# 规划模型退回率回放协议

离线评估**规划窗口模型选择**：不执行真实 issue，测量候选规划模型退回叶子结果的情况。

<a id="inputs"></a>
## 输入

- 一个已提交 issue 包（`prd/tasks/e2e.md`），含行为矩阵及逐切片 Required evidence。
- 一组该包的叶子摘要，可来自过去运行，或含已知缺陷的合成样本，如缺证据、错边界、范围漂移。
- 至少两个候选模型及下方评分标准。

<a id="procedure"></a>
## 流程

1. 每候选在独立全新会话接收相同简报（切片、证据、矩阵行）及叶子摘要。
2. 每个返回输出 accept、bounce:<evidence ids> 或 escalate，附一句原因。
3. 按标准答案评分：正确接受、正确退回及 ID、误退有效工作、漏接缺陷。

<a id="output-report-per-candidate"></a>
## 每候选报告

| 指标 | 含义 |
| --- | --- |
| bounce precision | 退回中确有缺陷的比例 |
| bounce recall | 真实失败中被退回的比例 |
| false-bounce rate | 有效工作被拒，浪费修复轮次 |
| missed-defect rate | 无效工作被接收，后续返工 |

选择规则：精确率相同时优先误退率与漏检率之和最低的候选；完整表放 .rope/research/ 并关联 issue 证据。

<a id="guardrails"></a>
## 护栏

- 完全离线，不运行产品、不建 worktree、不执行代码。
- 所有候选输入相同；未控制顺序效应，交互评估时注明。
- 无法输出结构化判断的候选记 not-usable，不能记零退回。
