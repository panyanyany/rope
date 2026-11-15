<a id="rope-verify-rules"></a>
# Rope Verify 验证规则

verify 在 `rope-finish` 第一阶段执行；下文的 verify 均指该阶段，其结论决定能否进入收尾。

<a id="verdict"></a>
## 结论

- `PASS`：文书完整，审查已记、E2E 终态、工作树干净、架构继承和检查 / 例外记录齐全。不宣称产品真实正确；产品判断来自结束审查及 E2E 证据。
- `CHANGES_REQUESTED`：需 go 修复循环补齐的文书缺口，如漏记审查、E2E 漂移、缺提交。
- `BLOCKED`：需要人工决定，如审查记录的真实环境失败、PRD 冲突不明、缺凭据。列出阻塞，不编造结论。

<a id="finding-severity"></a>
## 发现严重度

- `must-fix`：阻塞 finish，例如缺审查记录、E2E 漂移、脏树。
- `nice-to-fix`：记录，但不阻塞。

<a id="document-fixes-verify-may-edit-issue-docs-only"></a>
## 文档修正（verify 只可改 issue 文档）

对于 tasks.md 空结论 / 状态、e2e.md 空 Result、过时 Open Questions，只依据已有核验证据补齐，不能只凭完成声称。在 Document Fixes Applied 记录文件、变化和理由。绝不改代码。

<a id="drift"></a>
## 漂移

verify 要抓的失败模式：`agent_failed` 或 `pending` E2E 未经复验，却随切片被算完成。逐项查找。`agent_passed` 只核验证据和已记录命令，不重跑。

<a id="verifymd-format"></a>
## `verify.md` 格式

每次运行追加一轮，不覆盖旧轮次。保留模板字段名，内容用中文：

```md
# <issue 标题> Verify

## Round N — <日期>

### Verdict
PASS | CHANGES_REQUESTED | BLOCKED

### Checks
- Review recorded: <结论行、身份、修复轮次，或发现>
- E2E terminal / drift: <状态扫描结果>
- Commits / tree: <结果>
- Architecture inheritance: <包映射、实际来源阅读记录、编辑前落点证据；适用时有理由的 none>
- Architecture guards / exceptions: <覆盖、命令 / 输出 / 提交、逐项差异理由 / 确认 / 审查结果；或缺失及人工审查>
- Integration reconciliation (when applicable): <目标 / 候选提交、决策、落地前检查 / 审查记录>
- Architecture docs: <结果归属>
- Matrix evidence: <抽查引用>

### Findings
- [must-fix|nice-to-fix] <发现> — evidence: <位置>

### Document Fixes Applied
- <文件>: <变化> — reason: <原因>
```

<a id="fix-loop"></a>
## 修复循环

结论为 `CHANGES_REQUESTED` 时，父编排器编写修复简报并派发实现叶子。修复后，只针对 must-fix 项追加 Round N+1。如果 must-fix 集合不变，或发现设计、需求缺陷，停止自动修复并交给用户决定。
