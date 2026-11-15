<a id="rope-grill-document-formats"></a>
# Rope Grill 文档格式

写入模板内容时，遵守[中文文档写作规则](content-design.md)。保留协议字段名和枚举值，使用中文说明具体要求。

写入长期文档前，先读[现行文档契约](../../rope-clear/references/current-docs.md)。遵守原位替换与来源状态检查。下列格式用于选择归属，不能成为另建副本的理由。模板字段名保留英文，说明及填写内容使用中文。

## `.rope/GLOSSARY.md`

只用于项目特有的领域语言。

```md
# Glossary

## Language

**<规范术语>**:
<用一两句话定义它是什么。>
_Avoid_: <歧义同义词>, <错误用词>
```

规则：

- 只有在讨论中确定，或从文档 / 代码核验后才添加术语。
- 不加入实现步骤、文件路径、工单或临时事实。
- 优先使用规范词汇，列出应避免的替代用词。

## `.rope/adr/NNNN-slug.md`

仅在以下三项同时成立时使用：

- 难以逆转。
- 脱离上下文会令人意外。
- 可信方案之间存在真实取舍。

```md
# <决策标题>

<用 1–3 句话先说明决定和原因，再补充必要背景。>
```

仅在有用时添加可选章节：`Status`（状态）、`Considered Options`（考虑过的方案）、`Consequences`（后果）。

## `.rope/research/<topic>.md`

用于能跨 issue 复用的外部、平台或服务事实。

```md
# <调研主题>

## Question

<核验了什么事实？>

## Verified Facts

### <稳定锚点>

Fact: <已核验事实>
Source: <官方文档、一手来源、命令或代码位置>
Verified by: <命令 / 搜索 / 来源访问方式>
Stability: low | medium | high
Implication: <如何影响规划或实现>

## Assumptions

- <临时假设，如有>

## Open Questions

- <需要人工决定，或受环境限制尚无法回答的问题>
```

## `.rope/specs/<area>/<topic>.md`

用于稳定的实现契约和易踩坑。

```md
# <规范标题>

## Scope

<适用条件。>

## Contract

- <签名、载荷结构、不变量或边界规则>

## Tests Required

- <必须测试的可观察行为>

## Wrong vs Correct

### Wrong

<错误做法>

### Correct

<安全做法>
```
