# Matt Pocock 上游实践观察：E2E、browser、并行与 handoff

观察日期：2026-09-23。范围：`mattpocock/skills` 的 GitHub `main` 与可定位的一手技能文档；不是 Rope 规范或建议。

## 上游版本与变化

- 远端 `main` 当前 SHA：[`c55ee46073ed923f86ce59a5eb3b6d895095d1b7`](https://github.com/mattpocock/skills/commit/c55ee46073ed923f86ce59a5eb3b6d895095d1b7)，提交日期 2026-09-18，标题 “Modified the PR body template to make it easier to scan”。本地缓存原先落后于 2026-09-01 pin；已只 fetch 上游引用核实，并未改本地 pin 或工作区文件。
- 自 2026-09-01 pin `6654f6b` 后，触及相关执行/testing/browser/handoff 文件的实质变化很少；`skills/in-progress/pr/SKILL.md` 是新增实验技能。区间内没有发现 browser/E2E 专门 skill，也没有发现 `implement-spec`、handoff、`tdd/tests.md` 改动。完整区间技能统计不能推成 Matt 本人所有公开观点。

## 可直接确认的教导

### E2E / 测试栈

- `skills/engineering/tdd/tests.md` 主张 integration-style：通过真实公共接口测用户/调用方可观察行为，少测内部协作者；反对 mock 内部依赖、私有方法、调用次数/顺序断言、绕开接口直接查数据库，以及与实现同构的 tautological expectation。它没有指定 Playwright/Cypress、浏览器驱动、浏览器 MCP、测试金字塔或独立 E2E 策略。来源：[tests.md](https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/tdd/tests.md)。
- 因此“真实接口”只能支持集成测试取向，不能据此声称上游明确要求 browser E2E。`main` 在本次检视范围内没有 browser/E2E 运行器或 stack 选择教学。

### 角色、并行与隔离

- 实验中的 `implement-spec` 把 tickets 定义为 task graph（不是步骤列表），按 blocker 形成 frontier；每个 implementer subagent 用独立 worktree、独立 branch；完成后由 merger subagent 合进 PR branch，frontier 改变即补充派发可运行票，以提高并发。全部完成后跑 code-review，由一个 implementer 统一修 review 问题。来源：[implement-spec/SKILL.md](https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/in-progress/implement-spec/SKILL.md)。该技能标记 `in-progress`，应视为实验方案而非成熟/默认工作流。
- 并行沟通要求 sparse，主要传递 spec/ticket/research/commit 等 context pointers；探索 subagent 可将笔记放在 repo 外、供后续 agent 共用，令 implementer 聚焦实现。同上来源。
- `handoff` 明确要求把交接文档放到操作系统临时目录（不在当前 workspace），引用已有 artifact 而不复述；包括 suggested skills，并清理敏感信息。来源：[handoff/SKILL.md](https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/productivity/handoff/SKILL.md)。

### 验证证据与 PR

- 新增 `pr`（仍在 `in-progress`）给出 PR body 模板：Summary 可用伪代码/调用树/组件树/文件树/Mermaid/diff；Evidence 要求 before/after 对照，优先环境合适时的截图，其次执行证据（测试/控制台输出），并用伪代码展示确切失败与通过的测试。另记录 Merge Danger（可逆性门/单向门）与 blast radius。来源：[pr/SKILL.md](https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/in-progress/pr/SKILL.md)，提交 [d75dcf1](https://github.com/mattpocock/skills/commit/d75dcf1c5bccfab736ab79f494fa248980546d45) 起草，9/17 多次迭代；9/18 最新提交微调 PR body 易读性。
- 这是 PR 证据呈现惯例，不等于要求每个变更必须运行 E2E，模板也没有规定证据由独立角色产出。

## 本地既有研究的背景（非本次新核验结论）

`.rope/research/mattpocock-skills-slicing-and-parallelism.md` 与 2026-09-01 review 已记录：上游主线 implement 单票/单 session 与手动调度、实现完成后关票职责等内容。本报告不把旧 pin 内容重新冒充本次 main 最新变更；`implement-spec` 的并行模式仍属于未发布实验桶。

## 2026-09-01—23 一手讨论补查

以下是 GitHub issue/PR 的一手页面内容；注意议题发起人不等于 Matt，不能将提问者立场署名给 Matt。

- Issue [#397](https://github.com/mattpocock/skills/issues/397) 标题 “Implementation calling it done without UI”。作者报告其项目中服务/API 集成测试加 harness 被误当成用户功能完成，建议 user-facing slice 至少有一个驱动真实 route 的 Playwright browser acceptance criterion。它是用户提出的源头问题，不是 Matt 的教导。页面搜索摘录未能确认 9/1—23 Matt 对此 issue 的评论/采纳结论；不能将该建议视为上游已接受政策。
- Issue [#529](https://github.com/mattpocock/skills/issues/529) “Question: TDD, should it exclude browser tests?” 发起人称浏览器测试设置/重复运行成本高，倾向实现后或任务后再跑；这同样是提问者意见，不是 Matt 的定论。页面内容可核实问题描述，但未核实 9/1—23 Matt 作者评论或最终处置。该议题明确体现“浏览器 E2E 是否适合 TDD 循环”存在待决疑问，不能把 `tdd/tests.md` 集成测试原则代答。
- PR [#393](https://github.com/mattpocock/skills/pull/393) 是 Matt 的 TDD 文档重塑（提交/PR 早于本次时间窗），明确测试放在预先与用户确认的 seam；但它不定义 browser E2E，也不构成所要求时间窗内的近期观点。仅作上游当前文件沿革佐证。
- 本轮范围/关键词：GitHub `mattpocock/skills` 的 issues、pull requests、discussions 搜索结果，关键词 `E2E`, `browser`, `Playwright`, `real route`, `acceptance`, `UI`, `handoff`, `parallel test`；另查上述 #397、#529、PR #393 页面。GitHub GraphQL 批量拉取尝试超时；讨论区未取得可核验结果，故无法声称穷尽所有评论/讨论。
- 截止 2026-09-23，未发现能准确引用并确认作者为 Matt、日期在 9/1—23、且直接谈以下内容的原文：真实用户路径必须 E2E；独立验收 agent/角色；并行跑 browser tests 的策略或测试栈。搜索 Matt 本人公开观点时使用了 `site:x.com/mattpocockuk E2E` 与 `browser testing` 等检索，但结果噪声大、没有可定位的合格原文，因此不引二手摘要。

## 一手资料与边界

- GitHub source：[`mattpocock/skills`](https://github.com/mattpocock/skills)，核验 SHA 如上；具体链接均固定到该 SHA。
- 近期本人公开发言：本次 web 检索未找到可可靠核验且直接讨论 E2E/browser 的 Matt 本人一手发言；搜索结果噪声较大，故不引用二手概述。
- 未覆盖：PR 讨论/issue 的完整时间线、账号所有社媒平台、Matt 的付费课程或直播内容。结论限于仓库技能正文与本次可验证提交；对“没有教导”的表述仅指所检仓库内容，不代表本人从未谈过。
