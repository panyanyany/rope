<a id="matt-pocock-skills-subagent-dispatch-precedents"></a>
# Matt Pocock 技能的子代理派发先例

<a id="question"></a>
## 问题

Matt Pocock（`mattpocock/skills`）如何组织调研 / 执行子代理，包括固定版本 6654f6b（2026-09-01）后的变化与公开方法论？

<a id="verified-facts"></a>
## 已核验事实

- research 技能把工作交给**后台代理**，使调用者可继续；要求一手来源、逐项主张的引用，以及按仓库已有笔记约定保存的 Markdown 发现产物。不定义结构化提示模板、模型等级、重试协议或返回摘要格式。来源：[快照 `skills/engineering/research/SKILL.md`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/research/SKILL.md#L6-L12)。
- Wayfinder 将任务分为 `research`、`prototype`、`grilling`、`task`；research 是无需人在场的文档 / API / 本地资源事实调查，需要当前工作目录之外的知识时交给 `/research` 子代理。任务问题即简报；解决时记录结果并链接产物，不粘贴正文。来源：[Wayfinder 快照](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/wayfinder/SKILL.md#L55-L80)。
- Wayfinder 对每个新建调研任务并行派发，使用一次性 `research/<name>` 分支，带任务中的上下文指针。地图先低分辨率加载，按需获取任务正文。来源：[同一文件](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/wayfinder/SKILL.md#L103-L128)。
- 代码审查把不同维度分给两个独立并行代理，提示有边界：完整 diff / 提交列表、相关标准或规范、明确报告标准及少于 400 词的限制。没有规范时跳过对应代理；汇总保留各轴，不合并重排。没有廉价模型要求。来源：[code-review 快照](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/code-review/SKILL.md#L58-L80)。
- 固定 SHA 之后的增量：曾获取 `origin/main` 至 `c55ee46073ed923f86ce59a5eb3b6d895095d1b7`；变化涉及 PR 技能 / 模板、`retro`、README、安装脚本和元数据。没有文件新增 / 修订调研或子代理派发指引；`retro` 收紧确定性检查建议，优先机械护栏而非文字规范。来源：[版本比较](https://github.com/mattpocock/skills/compare/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76...c55ee46073ed923f86ce59a5eb3b6d895095d1b7)。
- 访谈文字稿摘要描述 Pocock 的“白班 / 夜班”与拆分上下文，让代理留在“聪明区间”；没有具体派发、重试、模型等级规则。来源：[Pragmatic Engineer 访谈](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock)（文字稿与时间戳；45:02 为聪明区间部分）。
- 一位实践者对 Pocock Sandcastle 工作流的二手介绍，建议按计划 → 压力测试 → PRD → issue 文件推进，核实 issue 是纵向切片，再给每个子代理一个 issue，声明允许文件、验收标准、停止条件。文中提到迭代预算耗尽及提高派发迭代 / 时间限制；这是作者的 Hermes 改造，不是 Pocock 本人要求。来源：[Danny Shmueli 的实践文章](https://dannyshmueli.com/2026/04/29/Matt-Pocock-Skills-Hermes-Subagents-Feature-Work)，尤其是 “Run the issues through Hermes sub-agents” 与 “One config change that helped” 两节。
- 公开搜索未找到可靠、实质性的一手表述来证明廉价模型并行派发或父代理负责重试。已找到材料支持上下文分区和有边界的 issue，不支持某个具体重试协议。搜索包含访谈、工作坊、X 子代理查询；YouTube 抓取未能提取视频内容。

<a id="assumptions"></a>
## 假设

- 要求的基线为给定的 6654f6b 固定版本；本地缓存仓库 HEAD 更旧，因此固定版本之后的结论依据已获取的 GitHub 比较，不依据本地 HEAD。
- 公开来源搜索仅用于发现；上述主张区分仓库作者指令与搜索结果摘要。

<a id="implications"></a>
## 启示

- Rope 可借鉴清晰工作类型、窄问题、明确产物位置 / 引用规则、并行独立审查轴和上下文指针。
- 不把通用重试 / 升级规则、强制廉价模型或返回摘要契约归于 Pocock；检查过的来源没有规定，Rope 如需应自行决策。
- 其地图模式通过低分辨率索引加按需细节保护上下文；持久调研产物是正式输出，不依赖聊天历史。

<a id="open-questions"></a>
## 未决问题

- 子代理停滞或失败后，Pocock 的父代理实际如何恢复？
- 私人流程或此次未找到的公开演讲中，是否对某些并行任务使用廉价模型？
- 能否用一手 X / 视频 / 播客文字稿核实更强的公开主张？
