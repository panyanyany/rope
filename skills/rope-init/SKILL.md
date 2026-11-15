---
name: rope-init
description: 在仓库初始化 .rope 编程知识层，包括术语表、导航、规范、调研、架构决策与 issue 目录。一次性设置，按名称调用。
disable-model-invocation: true
---

<a id="rope-init"></a>
# Rope Init：初始化

将 `.rope/` 建为仓库本地代理知识层。输出模板见[初始化模板](references/templates.md)。

写入说明、简报或记录时，遵守[中文文档写作规则](../rope-grill/references/content-design.md)。

<a id="workflow"></a>
## 工作流程

1. 写入前检查仓库：
   - 根代理指令：`AGENTS.md`、`CLAUDE.md`。
   - 根文档：`README*`、已有术语 / 上下文文档、`docs/adr/`。
   - 已有 `.rope/GLOSSARY.md`、旧 `.rope/CONTEXT.md`。
   - 包 / 构建标记：`package.json`、`pyproject.toml`、`go.mod`、`Cargo.toml`、`Makefile`。
   - 可能的源码 / 测试根：`src/`、`app/`、`apps/`、`packages/`、`tests/`、`test/`、`spec/`。
2. 缺 `.rope/` 时按模板创建：
   ```text
   .rope/
     GLOSSARY.md
     routes.md
     adr/
     research/
     specs/
       index.md
       guides/
         behavior-matrix.md
         integration-boundary.md
     issues/
   ```
3. 新知识层的 GLOSSARY 保持空模板，除非用户已确定项目术语。保留已有术语表；已有 CONTEXT 时不动内容，由 `rope-clear` 迁移 / 合并，不能创建竞争术语表。init 负责创建目录和模板，clear 负责迁移已有内容。
4. 保守生成 `.rope/routes.md` 导航：仓库形态、源码根、测试根及已发现命令、从文件 / 脚本确认的常用入口。`Worktree setup:` 询问新 worktree 如何可测试，例如依赖链接脚本或安装命令；宿主准备则 `host-managed`。初始化可 `unknown`，`rope-shape` 会再问。无法确认的内容填写为 `Unknown`。
5. 保守生成 `.rope/specs/` 骨架：只放稳定通用指南，不靠文件名发明代码契约；只有用户明确要求深度初始化才起草代码规范。
6. 按 `## Rope` 模板原位更新根代理指令：优先 AGENTS，只有 CLAUDE 则编辑它；新增 / 更新 Rope 区块，要求读取 GLOSSARY（迁移前读旧 CONTEXT）、routes、相关 `.rope/specs/`、`.rope/adr/`、`.rope/research/`。

<a id="guardrails"></a>
<a id="护栏"></a>
## 执行限制

- 不替用户决定 `.rope/` 提交还是忽略。
- 不默认配置 GitHub/GitLab issue 跟踪；默认使用 `.rope/issues/` 本地 Markdown。
- 覆盖已有文件前必须读取并保留用户内容。
- 不执行破坏性命令、不安装依赖、不 push、不部署、不改根配置。
