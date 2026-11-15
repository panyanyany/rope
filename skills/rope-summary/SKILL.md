---
name: rope-summary
description: 将刚完成工作中的可复用契约、adapter 边界、配置规则或修复经验沉淀进 .rope 文档。用户要求总结或沉淀当前工作时按名称调用。
disable-model-invocation: true
---

<a id="rope-summary"></a>
# Rope Summary：经验沉淀

把已验证的实现经验沉淀到 `.rope/`，保持代码事实、架构契约和代理指令一致。

写入说明、简报或记录时，遵守[中文文档写作规则](../rope-grill/references/content-design.md)。

<a id="workflow"></a>
## 工作流程

1. 检查仓库状态：`git status --short`，以及刚完成工作涉及的变更文件 / 最近提交。
2. 写前读取 `.rope/GLOSSARY.md`（旧文档查找见[现行文档契约](../rope-clear/references/current-docs.md#project-language)）、`.rope/routes.md`、相关 specs / adr，以及引用的 research。
3. 判断是否更新：
   - 有 issue 则读 Architecture Impact 与 Constraint Bundle。
   - 形成或澄清可复用架构规则、adapter / 配置契约、部署约束、验证模式、反复失败模式时更新。
   - 一次性工作、私有实现细节或已有文档覆盖时跳过。
   - 区分 `pending-finish` 文档闭环与未确认新架构变化，后者暂停交父编排器 / 用户处置。
   - **完成标准：**自 shape 提交以来每个变更文件均对照 specs / adr / research / 术语表四处归属考虑过，更新或明确说明跳过原因。任何文件未考虑都不能宣布完成。
4. 读[现行文档契约](../rope-clear/references/current-docs.md)，原位更新最小长期文档。已确认处置保留其来源、状态、范围、不变量、例外边界、证据，不在总结时发明新处置：将稳定实现契约和必需测试写入 specs，将架构取舍写入 adr，将外部或平台事实写入 research。只有领域语言发生变化时，才更新 GLOSSARY。
5. 依据证据写作。需要时链接代码、测试和日志。不得编造产品事实或未来运行流程，也不得粘贴密钥、原始提示、base64 或大载荷。
6. 目标仓库要求提交纪律时，做轻量文档 / diff 检查并提交；只提交文档更新，除非用户要求合并提交。

<a id="agent-doc-rule"></a>
## 代理指令规则

使用 Rope 的仓库，根代理文档应包含：

```md
- 需要代码上下文时，先读相关 `.rope/specs/` / `.rope/adr/` / `.rope/research/`，不要只靠文件名或 grep 结果推断架构。
- 完成代码变更后，若沉淀出可复用架构规则、adapter 契约、配置契约、部署约束或踩坑修复，更新最小相关 `.rope/specs/` / `.rope/adr/` / `.rope/research/` 后再收尾。
```

<a id="output"></a>
## 输出

返回更新文件、保留的规则 / 事实、验证结果或跳过原因，以及已提交时的提交号。
