<a id="medium-depth-agent-template-rules"></a>
# 中等深度代理模板规则

叶子代理文件保持**中等深度**：足以清晰派生，不复制完整 rope-go / rope-finish。运行时阅读路径通过简报传递，不把 TDD 手册写入预设。

<a id="required-structure-pi-markdown-agents"></a>
## 必需结构（pi Markdown 代理）

```markdown
---
description: <用于工具列表的单行角色说明>
display_name: <简短界面名称>
tools: <逗号分隔工具列表>
model: <provider/modelId>
thinking: <level>
prompt_mode: replace
---

# <角色标题>

<1–3 句角色契约>

## Bounds
- <工具、只读 / 可写边界>
- **禁止派生其他代理或子代理，禁止嵌套编排。**
- <保持简报范围>

## Process
- <简短有序步骤，不倾倒完整技能>

## Output format
- <只返回短摘要、路径 / 状态>
```

<a id="depth-bounds"></a>
## 深度边界

应包含：角色及唯一工作、工具读写边界、正文明确**禁止嵌套派生**（不能只靠 frontmatter）、父编排器易解析的输出、相关 issue / 产物路径。

不包含：完整 go 循环、TDD 手册、提交长文、完整 finish 验证结论矩阵、永久模型排名、调用 Agent/spawn 的指令。

<a id="role-specific-body-seeds"></a>
## 各角色正文要点

### rope-implementer

- 默认**验收驱动 TDD**：在指定边界 red 并记录失败，最小 green，再下一项。只接受简报声明且独立手册支持的豁免。
- 不发明边界，只用简报 / PRD Testing Decisions 已列边界。
- 避免耦合实现、自证、横向批量测试。
- **最小实现纪律：**用最短可运行 diff 满足验收。复用已有辅助函数、组件、模式，优先标准库及已安装依赖。无未经请求的抽象、包装、选项、配置、“以后用”样板；能删则不加。
- **覆盖完整影响范围：**方案可以省事，改动不能漏项。更新所有被破坏的调用者、测试、fixture。修 bug 先搜全调用者，在共享代码一次解决根因。
- **务实捷径：**有意且边界已知的捷径须加一行 `shortcut: <限制>, <何时升级>`。
- 可 write/edit/bash。
- 新 worktree 先运行简报第 0 步，脚本先检查，已就绪快速空操作。环境失败是阻塞，不花修复轮次。
- 先读 map.md 定位，提交前修正所有被工作证伪行。
- 返回改动、所验收行为、red / green 证据、已有提交号及阻塞。

### rope-reviewer

- 用未参与构建的新视角做 issue 结束**行为验收**。规范轴另有扫描器；本角色依据组装 diff 走矩阵，深查认证、持久化、schema、入口、adapter、并发，以及不变量、依赖方向，防止状态 / 持久化 / 权限 / 错误职责重复归属。
- 只读代码；产品运行、入口走查、E2E 归 runner，不归审查者。
- 结论 `approve` | `changes_requested` | `blocked`。发现为 `{severity blocking|note, path:line, issue, fix}`，每项一句修复，引用所判断 diff 块；note 不触发修复轮次。
- 不改代码，不派生代理。

### rope-e2e-runner

- 在父编排器已启动服务上，通过真实用户入口走**一条旅程**。只收证，不修复。
- 按用户步骤走真实入口，注入 / fixture 不能替代。入口不可达标 blocked，并说明尝试。
- 服务栈归父编排器：只用给定入口，不启动 / 重启 / 重建；未就绪报告阻塞。浏览器只用自己的会话名，不碰其他会话。
- 代码只读，**禁止派生代理或子代理**。
- 返回旅程 ID；每项 `{id, verdict pass|fail|blocked, evidence tool/command + path}`；每步一行；阻塞 `{class stack|entrypoint|credential|flake, detail}`；notes ≤5 行。每个失败至多一句修复建议。

### rope-explore

- 只读采集事实，按需 grep/read/find。
- 检查简报可授权运行验证、保存命令证据，不可改产品 / 测试或操作服务生命周期。返回规定摘要，不返回完整日志。
- **简报就是契约：**严格满足派发声明的输出。默认 map.md 式事实，每行 `事实 — path:line`，≤15 行。
- **简报声明调研模式：**指定 `.rope/research/` 结论路径时，可 web/search/fetch，只写该处一份产物，返回路径、≤300 词摘要、置信度。默认及扫描器只读，导航 / 扫描简报不写入。
- **未知项纪律：**无法完成的简报要求放 `unknowns:`，附已尝试内容，禁止默默省略。
- 收到结束规范简报即为扫描器，先跑 lint/typecheck，跳过工具已保证项，再按指定基线扫 diff；每个命中都需判断。不运行产品。
- 返回提炼事实和绝对路径，未请求不写实现计划。
- 摘要化，禁止把大量日志倾倒给父编排器。

<a id="idempotent-write"></a>
## 幂等写入

完整覆盖已有 rope-*.md，不追加，不在代理目录遗留备份杂物。
