<a id="windows-port-status-2026-09-19"></a>
# Windows 移植状态（2026-09-19）

本记录保留当时的移植证据；所述执行内核及回归套件已随 ADR 0016 退役，不代表当前测试状态。

fork 同步上游 `WufeiHalf/rope` 的 `fd94180`（合并为 `ea9508a`）时引入 go 执行内核及离线回归套件。套件在 Unix 开发，在 Windows（Git Bash / MSYS、Node 22）部分阻塞。完成以下修复后为 **21 通过 / 17 失败**，全部失败来自 `tests/gates.test.mjs`（13 项）与 `tests/kernel.test.mjs`（4 项）。

<a id="fixed-in-this-repo"></a>
## 本仓已修复

- `tests/harness/tmp-repo.mjs`、`tests/smoke.test.mjs` 使用 `new URL(...).pathname`，在 Windows 产生 `/C:/...`，使 `readFile` 收到 `C:\C:\...`。已改用 `fileURLToPath`。
- 原本没有 `.gitattributes`，fork 机器使用 `core.autocrlf=true`，所有检出文件变为 CRLF，导致冒烟的 frontmatter 正则失败、`.sh` 脚本带 CRLF。已加 `* text=auto eol=lf` 并完整重新检出；索引本就是 LF，因此无内容差异。

<a id="remaining-blocker-needs-upstream-scale-work-not-a-quick-fix"></a>
## 当时剩余阻塞（需上游规模工作，不适合 quick）

`run-check.sh` 及内核模板脚本层把检查批次作为 JSON **argv** 字符串传递。`JSON.stringify` 将 Windows 临时路径转义为 `C:\\Users\\...`；反斜杠在 bash → node argv 链中某处丢失，重新解析批次时报 `Bad escaped character in JSON`。其中 12 项 gates 失败及多数 kernel 失败（另有 `Cannot read properties of undefined (reading 'status')`）可追到该层或相邻 bash 语义。

正确方向是在 `skills/rope-go/scripts/run-check.sh` 与内核模板中，通过 **stdin 或文件路径**传 JSON，随后重新检查剩余 bash 语义失败。这属于内核脚本层的 Windows 移植，宜向上游提 PR，避免 fork 分叉。

当时的替代方案：在 WSL 下运行 `npm test`，预期该环境套件通过。
