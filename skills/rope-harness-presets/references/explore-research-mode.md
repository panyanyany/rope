<a id="explore-research-mode"></a>
# Explore 调研模式

外部调研由 rope-explore 执行，简报必须声明调研模式。该模式允许查询外部来源，并将结论写入指定文件。它不增加新的代理角色。

explore 预设不限制工具可用性，具体读写边界由模式契约规定。限制预设工具可能导致调研无法保存结论。

<a id="mode-contract"></a>
## 模式契约

**简报就是契约：**派发提示明确任务问题、来源、输出路径、返回格式，叶子逐项履行。

- 默认派发（调查、验证、结束规范扫描）：不改产品代码 / 测试。验证可运行简报命令并按[交接契约](role-schema.md#exploration-and-validation-handoff)保存日志。不借用调研权限、不重写项目文档。
- 调研派发，简报指定 `.rope/research/` 结论路径：可 web/search/fetch，仅写 `.rope/research/**` 范围内一个产物，不写别处。不碰产品、测试、分支，不派生代理。
- 两模式都把无法满足的要求记为 **unknowns**，附已尝试内容。静默遗漏违反契约，不是更精简的回答。
- 已审查代码不受调研写入影响；调研只写文档，扫描简报不要求写入。

<a id="research-brief-shape-minimal"></a>
## 最小调研简报

1. 问题及重要性，1–2 句。
2. 一手来源要求：厂商文档 / 固定提交的上游仓库。
3. 输出路径及必需章节：Question、带来源的 Verified Facts、Assumptions、Implications。
4. 返回：文件路径、≤300 词摘要、置信度。

<a id="degradation"></a>
## 降级

预设不限制工具，通常无需降级。只有宿主完全无法授予 web/write 时才用通用叶子，**记录实际类型**。不改 schema、排名或清单，三个核心角色不变。
