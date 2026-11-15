<a id="review-cost-optimization--spec"></a>
# 结束审查成本规范

来源：ADR 0010；语义见 0007，矩阵规范见 0009，产品运行分离见 0015。已替代不再存在的 ADR 0004 review frontmatter 制度。

<a id="shape-two-parallel-leaves-one-gate"></a>
## 结构（双叶子并行，一个审查点）

- explore 规范扫描器与行为审查者同消息派发，响应时间取两者最大值，不相加。
- 两个工作者只读代码。结论为 approve 后，才进入操作产品的 E2E 阶段。父编排器负责共享服务栈及其端口和进程，runner 使用该服务栈。
- 机械取最差结论，approve < changes_requested < blocked；父编排器不重排、合并发现或重判。

<a id="scanner-budget"></a>
## 扫描器预算

- 简报：排除噪声的 diff、提交、规范来源、全局不变量、异味基线，约 35 行。
- 先 lint/typecheck/build，跳过工具已保证项。
- 返回 clean 或 ≤200 词 severity/path:line/issue/fix。

<a id="reviewer-budget"></a>
## 审查者预算

- 简报：同样 diff、提交、矩阵行、只读高风险用 e2e 路径、内联不变量。不带 map；架构来源 / 包按现行必需阅读契约提供。
- 只读组装 diff，对照矩阵与高风险边界，不启动产品。

<a id="e2e-stage-budget-adr-0015"></a>
## E2E 阶段预算

- 每个 issue 只使用一套共享服务栈。父编排器负责启动、探测就绪和关闭；每个 runner 只读代码，并执行一条用户旅程。
- 资源不相交用隔离会话并行，共享账户 / 可变状态串行。修复后差量复审，在新 HEAD 重跑受影响旅程，证据引用提交。

<a id="diff-hygiene"></a>
## Diff 清理

```md
git diff <base>...HEAD -- . ':(exclude)*lock*' ':(exclude)*.snap' ':(exclude)dist/'
```

按仓库排 vendor、构建、生成文件；锁文件 / 快照常占 20–50% diff，两叶子都承担成本。

<a id="fix-protocol"></a>
## 修复协议

- blocking/note 二级；note 仅记 tasks，不进入修复。
- 每发现带 path:line 及一句修复，简报原样转录阻塞项，无待探索内容。
- 每轮须缩小阻塞集合；首个无进展轮次触发人工升级停止。此规则于 2026-10-08 替代最多两轮计数。
- 只差量复审：扫描修复提交，行为审查只检查受影响路径，不重做全量。

<a id="forbidden-shortcuts"></a>
## 禁止捷径

- 扫描器运行产品。
- 父编排器重排 / 合并轴发现，变第二审查者。
- note 进入修复、修复后全量复审。
- 审查简报带 map，或不按限定来源而全量深读约束包。
- 任何形式逐片审查。
