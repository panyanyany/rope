# Matt Pocock 上游 context / material loading 调研

## Question
Matt 上游是否处理项目级上下文巨大/全文加载问题？grill、shape、tdd 如何探索并读取材料？自 Rope pin 后有何相关变化？哪些对比 Rope !124 全文 CONTEXT、!123 加载 execution+tdd+architecture 可参考？

## Verified facts with primary citations

本次核验官方 `mattpocock/skills` HEAD `5beb35b040e3de97e54fa9e386d7e42d15c295c2`，提交时间 2026-10-19T16:51:40+01:00；GitHub clone/fetch 页面可达。固定 SHA 文件引用如下。

- **项目级知识层：有，但不是完整材料加载策略。** 上游仓库根有 `AGENTS.md`（列 skill repo 自身维护约定）与 `GLOSSARY.md`（项目词汇）。`domain-modeling` 明确规定：常规项目为单一 context；若存在 `GLOSSARY-MAP.md` 则多 context，map 指向各自 glossary/ADR（[domain-modeling SKILL.md](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/domain-modeling/SKILL.md#L12-L34)）。这是明确的组织约定，不是全文加载或截断治理规则。
- **未找到“入口巨大、全文读取或随手截断”的问题陈述/解决机制。** 在已查根级知识文件、grill-with-docs、to-spec、to-tickets、TDD、domain-modeling 中没有发现基于长度自动选读/摘要/切块的规定。不能据此推断 Matt 其他所有材料绝无此讨论。
- `grill-with-docs` 本身只是调用 `grilling` 和 `domain-modeling` 两技能（[SKILL.md](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/grill-with-docs/SKILL.md#L1-L7)）。没规定父读/子代理读，也没要求全文读取相关代码/文档。
- `to-spec` 合成当前对话与代码库理解；如尚未探索则探索 repo；用项目 glossary 词汇、尊重相关 ADR；勾画并与用户确认测试 seam（[SKILL.md](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/to-spec/SKILL.md#L7-L19)）。具体读什么由“相关”驱动，没有父/子代理安排或必读全量规则。
- `to-tickets` 优先复用已有对话 context；若给了 spec/issue reference，读取其 full body and comments；只有尚未探索 repo 时才可选探索，并遵循相关 glossary/ADR（[SKILL.md](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/to-tickets/SKILL.md#L13-L23)）。这条明确的全文要求仅针对用户传入的单个引用材料，不等于全文读取整个知识库。
- TDD 要求探索代码库时读 `GLOSSARY.md`（若存在）并遵守相关 ADR；codebase-design 是接口形状有疑问时按需 consult 的 reference，而非启动一场 session（[SKILL.md](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/tdd/SKILL.md#L8-L26)）。这是明确按需参考的例子，但不是代理分工政策。

## Changes vs last-reviewed

本地 pin 为 `6654f6b60cd9d5be8b54c6fafe44346dabeb3b76`（source.md 记录 2026-09-01）；核验 HEAD 为 `5beb35b040e3de97e54fa9e386d7e42d15c295c2`。更正前版含糊表述：此前**没有成功执行 pin..HEAD 的 git log/range**，因为本地缓存只有旧历史，新抓取的临时 clone 不含旧 pin 对象；故不能声称完整筛过该区间的相关提交。现已确证 #1304 是区间内实际相关变化，提交 `b30058317f73465dea16a7889e95b17ef6e270bc`（父提交 `49dd158d1076134a641b33efb035946536778336`）。其 diff 仅改 `skills/in-progress/chief-of-staff/SKILL.md` 和 changeset（[固定 SHA diff](https://github.com/mattpocock/skills/commit/b30058317f73465dea16a7889e95b17ef6e270bc.patch)）。官方 PR #1304 说明这是 Matt 要求为 chief-of-staff 建立 LLM wiki，基于 Karpathy gist，明确不采用 `log.md`；skill 属 in-progress、未随插件发布（[PR #1304](https://github.com/mattpocock/skills/pull/1304)）。父版只强调子代理通过 research notes/previous commits 等 context pointers 沟通；新版本加 wiki pages。变化并非领域词汇表，而是长目标协调器跨 session 的持久记忆：先约定 wiki 位置，`index.md` 链接分主题页面；Ingest 更新受影响页和索引，Query 决策前读索引及指向页，Lint 找矛盾/孤页/缺链/过时事实。它**确实包含索引查询的入口机制**，不可因其非 CONTEXT 命名而排除，但目标是长期项目记忆，不是 Rope 所有 agent 每轮任务上下文。

## Unknowns

官方 commit/PR/diff 及当前 chief-of-staff 正文均已核实；PR 只有 Changeset bot 评论，无需据此推断更多作者解释。由于旧 pin 对象不在两个可用 clone，未取得全程可遍历的 git range，因此本报告只确认了 #1304 这一相关提交，不宣称区间穷尽。没有发现 #1304 定义 wiki 页面大小、查询是否必读全文、按任务选择具体页的条件，也没有规定子代理与父代理分别读/维护哪些页面。不能证明 Matt 在仓库外（社媒、课程、未索引讨论）没有其他做法。

## Implications (candidates, not decisions)

- 可参考的明确规则：仅当上下文尚未建立才探索；围绕指定 reference 读取其完整内容；代码探索读取 glossary 并遵守相关 ADR；设计参考按需 consult。
- 可借鉴的结构候选：按主题拆持久页面 + 短索引/链接；决策前读取索引及其指向页面（原文未明确限定只读相关子集）；信息有持久价值才回写，原始来源引用而不复制；用日期/commit 标注历史事实并追加 supersede，而非覆盖“当前状态”。这些是 chief-of-staff 的明确规则，不是对 Rope 的决定。
- 仍无覆盖：该 wiki 没有说明如何对每个临时任务选择必要材料、如何避免读取索引后把所有页面全文载入，也没有父/子代理读写分工；更没有比较 CONTEXT 与 execution+tdd+architecture 常驻加载。故 #1304 可作为“跨 session 长期记忆采用索引查询”的相关案例，但不能直接回答 !124/!123 的加载组合或把领域词汇/ADR 与长期工作记忆等同。
- 原文对照：父版 `research notes, previous commits, and others` → 新版加入 `wiki pages`（[parent](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/in-progress/chief-of-staff/SKILL.md) / [new](https://github.com/mattpocock/skills/blob/b30058317f73465dea16a7889e95b17ef6e270bc/skills/in-progress/chief-of-staff/SKILL.md)）；新增规则 `Before a decision, read index.md and the pages it points to`，`Sources ... are never copied in ... Pages cite them`；目标原文 `Tribal knowledge that lives only in your context is lost at compaction`。这是跨 session wiki 维护，不是防止当前项目入口文件过长。

## 初始化与迁移职责

### 核验范围

基于已核实上游 HEAD `5beb35b040e3de97e54fa9e386d7e42d15c295c2`，只读检查候选 `setup-matt-pocock-skills`、`domain-modeling`、`chief-of-staff`、一个专用迁移 skill `migrate-to-shoehorn`，并对照本地 rope-init/rope-clear 与 init 模板；未穷尽全部技能或 issue/PR。没有找到一个直接对应“扫描已有 .rope 并按最新 Rope 规范迁移”的上游 skill；最接近的是 setup，而非 upgrade/migration。

### 上游做法（原文事实）

- **Setup 的职责是首次配置，不是升级。** `setup-matt-pocock-skills/SKILL.md` 3、9-15 行：`Run once before first use`；prompt-driven，先 explore 再展示发现、确认后写。21-30 行检查现有文件、既有输出、monorepo 信号；59-61 行默认单 context，仅有 monorepo 信号才提出 multi-context；63-82 行先预览确认，in-place 更新已有块、不覆盖周边内容。固定引用：[setup skill](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/setup-matt-pocock-skills/SKILL.md#L19-L30)。
- **Domain-modeling 有单/多 glossary 的布局约定，没有迁移步骤。** 12-40 行列出 root glossary / map + per-context glossary，且 lazy-create；没有要求把旧文件搬迁、合并或逐版升级：[domain-modeling](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/domain-modeling/SKILL.md#L10-L40)。
- **chief-of-staff wiki 是长期记忆维护，不是项目初始化/规范迁移。** 36-38 行 Ingest：持久信息更新所有相关页和 index；Query：决策前读 index 及其指向页；Lint：找矛盾、孤页、缺链、过时来源并建议周期执行：[chief-of-staff](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/in-progress/chief-of-staff/SKILL.md#L26-L47)。它给持久知识的维护/查阅方式，不定义规范版本迁移。
- 小型专用迁移例子 `migrate-to-shoehorn` 是明确限定对象与前后模式的技术迁移，不是通用知识库升级：[skill](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/misc/migrate-to-shoehorn/SKILL.md#L1-L27)。

### 对 Rope 的类比候选（不是上游规定/决策）

现有 rope-init 明确是初建 `.rope/`；其模板 Agent block 要读 CONTEXT/routes 及相关 specs/ADR/research，并写明 CONTEXT 与 root GLOSSARY 指针避免双份词汇（`skills/rope-init/SKILL.md:13-59`; `references/templates.md:3-21,69-85`）。rope-clear 已具备有批准门槛的整理/迁移流程（`skills/rope-clear/SKILL.md:11-51`），与“老知识层按当前规范迁移”比 Matt 的 setup 更接近。可类比 setup 的“检查已有状态→报告差异→确认→原位修改”和 chief-of-staff 的“索引/引用/维护一致性”；但 Ingest/Lint 不能被说成升级流程，domain-modeling 也没有 glossary 格式迁移规则。是否在 rope-init 扩展既有状态支持、或另设迁移入口，需 Rope 自己确定；上游不给直接答案。
