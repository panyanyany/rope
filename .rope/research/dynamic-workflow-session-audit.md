<a id="dynamic-workflow-session-audit"></a>
# 动态工作流会话审计

<a id="scope--evidence"></a>
## 范围与证据

历史 pi 会话：`01a084fa-6712-72b3-9f89-5f0e6cafaa6e`。
来源：`/home/wufei/.pi/agent/sessions/--home-wufei-herdr-agent-workbench-fix-role-profile-version-friction--/2026-09-09T07-03-18-035Z_01a084fa-6712-72b3-9f89-5f0e6cafaa6e.jsonl`。
以下是历史证据，不是当前操作规则。当时规则位于 `skills/rope-go/references/dynamic-workflow.md` 与 `skills/rope-clear/references/current-docs.md`；前者现已随动态内核退役。

<a id="findings-retained"></a>
## 保留的发现

- **grill 调研前读过配置。**父核验 JSONL:19 的 `cat ~/.rope/config.toml 2>/dev/null || echo "NO_CONFIG"`，JSONL:20 返回 `default = "dynamic"`。“没读配置”的说法被证伪。
- **最初技能来自 worktree。**JSONL:15 带内联 `.agents/skills/rope-grill/SKILL.md` 路径。当前副本相等不能证明历史新鲜度；旧安装假设未证实。
- **运行文档未分发。**修复前 go 链接本 Rope 仓库 `.rope/specs/`，但 `bin/rope.js` 只安装 `skills/`，`package.json` 只分发 `bin/` 与 `skills/`。源码检查独立证明该缺陷，不取决于历史代理是否读取过文件。
- **调研确实并行。**JSONL:27–30 有同一批三个 explore 调用，仅代理数不足以证明覆盖缺失。
- **shape 范围包含前端。**JSONL:101,110 有设置 UI 的版本 / 消息变化；JSONL:241 要求审查跑 `npm test`。未确认完整前端全套结果；报告的 4,133 项属于 Python，不是 Vitest。
- **模型证据有边界。**子会话检查报告六个实现会话记录 `openai-codex/gpt-5.6-luna`，但未建立逐 workflow 调用映射；当前预设不能证明历史调用。用户未继续模型显示工作。
- **错误类别不同。**调查者报告缺测试模块、旧快照 / 版本断言、最终审查发现后修复的三个 WebUI 回归，不全是宿主缺陷。精确匹配编辑被拒本身也不能证明宿主缺陷。

<a id="limits--disposition"></a>
## 限制与处置

报告对历史 worktree 可用性意见不一，因此不把当前树形态和宽泛根因结论保留为证明。未识别具体 Matt 推文。首轮外部链接未捕获充分段落，不用外部主张论证此次变化。清理策略是用户决策，不冒称已证明自动检索能解决。

确认选择与 ADR 处置见 `../issues/dynamic-docs-and-clear/quick.md`。中间调查笔记已从知识层移除，仅保留为临时审计产物，不是额外现行规则来源。
