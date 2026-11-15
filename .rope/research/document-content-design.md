# GOV.UK 与 ASD-STE100 的中文应用

## 核验问题

如何让 Rope 的中文文档便于查找和执行，同时保留流程契约及机器字段？

## 已核验事实

### GOV.UK：以用户任务组织内容

- 事实：内容需要服务于可识别的用户需求。重要信息应放在前面，标题应帮助读者定位内容。
- 来源：[识别用户需求](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/identify-user-needs/)、[建立清晰结构](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-structure/)。
- 核验方式：读取官方页面。
- 影响：README 先给安装及使用方法；流程说明先给操作，再给背景。

### GOV.UK：使用清晰语言

- 事实：专业读者也需要易懂的文字。必要术语应在首次出现时解释；主动表达和短段落有助于理解。
- 来源：[使用清晰语言](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/)。
- 核验方式：读取官方页面。
- 影响：删除口号与含糊简称，写清角色和动作，统一术语。

### ASD-STE100：采用可迁移的表达原则

- 事实：官方 FAQ 说明，短句、单一主题和主动表达可以用于其他写作场景。第 9 版规则 5.2 通常要求一句只写一项指令；同时发生的动作可以合写，操作顺序应明确。
- 来源：[官方 FAQ](https://asd-ste100.org/STE_faq.html)、[第 9 版 PDF](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf)，Part 1，规则 5.2。
- 核验方式：官方 FAQ 和 PDF 正文直接访问返回 403；通过搜索服务读取官方域名的索引正文，未依赖转载内容。PDF 索引页标注版本日期为 2025-01-15。
- 影响：中文步骤采用明确动词，拆开独立指令。需要先判断条件时，把条件放在操作前。

## 本仓库采用方式

[中文文档写作规则](../../skills/rope-grill/references/content-design.md)规定具体做法。这是结合项目需求制定的中文写作规则，不是 ASD-STE100 中文合规声明。

保留英文协议名称和原有行数预算。英文词数限制不转换成中文字数。文档修改只改变表达，不新增流程授权或验收门槛。

## 稳定性与未决项

原则较稳定；官方地址、版本和详细条款可能变化。需要引用新条款或声明版本符合性时，应重新核验官方文本。当前没有阻塞本次中文修订的未决项。
