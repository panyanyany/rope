---
name: rope-review-fix
description: 审查本次改动集的可维护性，输出分级发现，并只修复必修和应修项。用户要求审查或清理当前改动时按名称调用。
---

# Rope Review Fix：改动审查与修复

审查本次改动集：先记录发现，再逐项处置，最后只实施必修和应修项。

## 步骤

1. 确定审查范围。读取工作区改动；用户指定 base 或提交范围时，以用户指定为准。范围不明确时先问用户，不要自行假设。
2. 委派子agent执行发现流程。按 [review-checks.md](references/review-checks.md) 检查改动及其上下游调用链，把发现写入 `.rope/reviews/<YYYY-MM-DD>-<head-sha>/findings.md`。然后输出总结报告。
3. 委派子agent执行处置流程。重新读取 `findings.md`，按 [disposition-rules.md](references/disposition-rules.md) 给每项定级，把结果写入同目录的 `decisions.md`。
4. 委派子agent重新读取 `decisions.md` 并实施修复。只修改必修和应修项。完成后报告已实施项、未实施项及原因。

## 产物

- `findings.md`：文件开头记录审查范围和基线；每项从 `F-01` 起编号，附 `path:line` 和一句修复建议。
- `decisions.md`：逐项记录处置级别、理由和修复建议。

`<head-sha>` 是审查开始时 `HEAD` 的短 SHA。产物目录不存在时创建；目录已存在时追加 `-2`、`-3`，不要覆盖上一轮。不在 Git 仓库时，目录名只用日期。
