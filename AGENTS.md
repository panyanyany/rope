# AGENTS

## Rope

本仓库使用 `.rope/` 作为本地代理知识层。

开展 shape 或实现前：
- 读取 `.rope/CONTEXT.md` 了解项目语言。
- 读取 `.rope/routes.md` 了解导航。
- 改代码前读取相关 `.rope/specs/`。
- 改架构前读取相关 `.rope/adr/`。
- 外部或平台事实读取引用的 `.rope/research/`。
- 需要代码上下文时，先读相关 `.rope/specs/` / `.rope/adr/` / `.rope/research/`，不要只靠文件名或 grep 结果推断架构。
- 完成代码变更后，若沉淀出可复用架构规则、adapter 契约、配置契约、部署约束或踩坑修复，更新最小相关 `.rope/specs/` / `.rope/adr/` / `.rope/research/` 后再收尾。
- 除非用户另有要求，本地工作记在 `.rope/issues/`。

## Skill 正文可移植性（分发约束）

`skills/` 下的文本会被 `rope add` 完整分发到别人的 agent 里，写规则时必须自包含：

- 禁止悬空的 `ADR NNNN` 编号标签：本仓库的 `.rope/adr/` 不会被安装。规则的“为什么”用行内一句话写清；演进史（“由……修订”“从……提升”）不进 skill 正文，留在 ADR 的 背景 / 后果 里。
- 禁止指向本仓库专属产物的路径（如某个具体 `.rope/research/<topic>.md` 文件）。指向目标项目自身目录约定的引用（`.rope/`、`.rope/adr/`、`.rope/research/` 本身）是合法的——安装后那些目录属于目标项目。
- 禁止本机/个人特化内容：具体代理地址/端口、个人 session 的日期与次数类证据。把这类现场证据换成可推广的因果表述，出处细节留在 `.rope/adr/`。
- 动过 `skills/` 后收尾前自检：`grep -rn "ADR [0-9]" skills/` 应为 0；冒烟测试保持绿。

## Skill 修改

- 不可以直接改我全局的 skill（`~/.agents/skills/`）。要改全局 skill 时，
  先在本地改，我确认后再安装回全局。
