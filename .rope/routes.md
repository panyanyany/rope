<a id="routes"></a>
# 仓库导航

供代理在本仓库定位的导航图，保持精简且有证据。

<a id="repo-shape"></a>
## 仓库形态

- 源码根目录：
  - `skills/` — 随包分发的 Rope 技能 (`SKILL.md` + `references/`)
  - `bin/rope.js` — 把技能安装到代理技能目录的 CLI
- 测试根目录：
  - `tests/` — `node --test`, 无外部依赖： `tests/smoke.test.mjs`
    （元数据、引用解析、CLI 安装）
- 构建 / 测试命令：
  - `node --test tests/*.test.mjs` — 全部测试
  - `node bin/rope.js --help` — CLI 用法
  - `node bin/rope.js add --target <dir>` — 安装随包技能
  - `python3 /path/to/skill-creator/scripts/quick_validate.py skills/<skill>` — 技能验证，外部工具路径，不在本仓分发
- 包标记：
  - `package.json` (`@wufei/rope`, bin `rope` → `./bin/rope.js`)
- 根代理文档：
  - `AGENTS.md`
- 已有长期文档：
  - `README.md`
  - `.rope/CONTEXT.md`
  - `.rope/adr/`
- Worktree setup: host-managed — 纯 Markdown 规则仓 + 零依赖 Node 测试，`node --test`
  在新 worktree 中可直接运行，无需安装。叶子工作者在新 worktree 中运行该切片
  的聚焦测试（通常是 `node --test tests/<file>.test.mjs`）加结构检查。
- Test tiers: quick: `node --test tests/*.test.mjs`（~0.1s，3 用例，2026-09-23 实测）；
  full 未单独定义 —— 本仓无更大型套件，quick 即全部。派生于 shape 2026-09-11
  （routes Test roots 改为 `tests/`；2026-09-23 内核测试随 ADR 0016 退役删除）。
- Test policy: fast-iteration — 本仓没有"freeze 必须全量"的要求；go 按影响选测，
  冻结点只跑声明的 freeze 检查。本仓全部套件即 quick，故实际上等价。

<a id="common-work-routes"></a>
## 常用工作路径

修改中文文档前，读取[内容设计规范](specs/guides/content-design.md)及其引用的[写作规则](../skills/rope-grill/references/content-design.md)。

<a id="change-or-add-a-skill"></a>
### 修改或新增技能

先读：

- `README.md`
- `skills/<skill-name>/SKILL.md`
- `skills/<skill-name>/references/` （如有）
- 改变流程语义时读取相关 ADR 和 CONTEXT

验证：

- `node --test tests/*.test.mjs` — 离线冒烟：元数据、引用解析、安装；跨技能断链会失败
- `python3 /path/to/skill-creator/scripts/quick_validate.py skills/<skill>` skill-creator 可用时运行
- 人工通读流程与护栏

说明：

- 项目本地安装通常为 `./.agents/skills`
- rope add 覆盖随包技能，保留已有 settings.json

<a id="change-the-installer-cli"></a>
### 修改安装 CLI

先读：

- `bin/rope.js`
- `package.json`
- README 安装章节

验证：

- `node bin/rope.js --help`
- `node bin/rope.js add --target /tmp/rope-skills-smoke` （或其他临时目录）

说明：

- CLI 目前支持 `add` / `install-skills` 及 --target

<a id="update-project-language-or-architecture-decisions"></a>
### 更新项目语言或架构决策

先读：

- `.rope/CONTEXT.md`
- `.rope/adr/`
- `.rope/specs/`
- `.rope/routes.md`

变更 issue 流程还须读取：

- `.rope/adr/0002-architecture-decision-continuity.md`
- `.rope/adr/0004-risk-tiered-review-mode-and-lean-briefs.md`
- `.rope/adr/0005-plan-artifact-reader-layering.md`
- `.rope/adr/0013-test-cost-tiering.md`
- `.rope/specs/guides/architecture-continuity.md`
- `skills/rope-shape/references/architecture-continuity.md`
- `skills/rope-clear/references/current-docs.md` — 现行事实及文档维护
- `skills/rope-clear/SKILL.md` — 经批准的整理流程

验证：

- Unknown，纯文档；未发现独立自动文档测试

<a id="run-the-agent-mode-e2e-acceptance-stage"></a>
### 运行 E2E 验收阶段

先读：

- `.rope/adr/0015-agent-mode-e2e-acceptance-stage.md`
- `skills/rope-go/references/execution-rules.md` （E2E 验收阶段章节）
- `skills/rope-harness-presets/references/role-schema.md` （runner 角色）
- `.rope/CONTEXT.md` （结束审查、E2E runner 术语）

验证：

- 文件检查：execution-rules、ADR 0015、CONTEXT、角色契约引用闭环
- 再生成预设安装到全局前需用户确认（AGENTS 规则）

说明：

- 本阶段属于 go 结束审查流程，不是独立技能。
- runner 预设： `rope-e2e-runner` 由宿主清单引用
  (`rope-harness-presets` 重新生成 `~/.pi/agent/agents/rope-*.md`).

<a id="harvest-matt-pocock-upstream-inspiration-maintenance"></a>
### 采收 Matt Pocock 上游灵感（维护）

先读：

- `.rope/CONTEXT.md` （上游灵感采收术语）
- `.rope/research/upstream-inspiration-sources.md`
- `.rope/upstream/mattpocock-skills/source.md`
- `.rope/upstream/mattpocock-skills/correspondence.md`
- 最新文件位于 `.rope/upstream/mattpocock-skills/reviews/` 如有
- 对应表指定的相关技能

验证：

- 结构检查： `.agents/skills/upstream-harvest/SKILL.md` 存在，不在 `skills/`
- 人工审阅采收简报，位于 `.rope/upstream/mattpocock-skills/reviews/`

说明：

- 技能路径： `.agents/skills/upstream-harvest/` （用户调用，不是分发产品技能）
- 不随 rope add 分发
- 固定方式为本机克隆及上次已审 SHA，不用子模块
