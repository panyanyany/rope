# Rope TDD 与 Matt Pocock TDD 对照

## 范围与版本

Rope 源 `skills/rope-go/references/tdd.md` 与部署副本 `/home/wufei/.agents/skills/rope-go/references/tdd.md` SHA-256 均为 `790619cd…edc06b5`，`cmp` 一致。全局独立 `/home/wufei/.agents/skills/tdd/SKILL.md` 是与 Matt 上游 TDD skill 正文同文的独立技能；这不等同于 Rope playbook，不能把它误作 Rope 部署件。上游固定核验 SHA `5beb35b040e3de97e54fa9e386d7e42d15c295c2`（2026-10-19），来源均固定到该 SHA。范围限两边 TDD 入口及其直接引用 `tests.md`、`mocking.md`，并读 Rope go/brief/TDD 相关契约和 CONTEXT acceptance 定义；未执行测试、未扫用户 sessions、未递归读其他 references。

## 证据对照表

| 主题 | Rope 原文 | Matt 原文（固定 SHA） | 判断 |
|---|---|---|---|
| Red-green / 批量红 | `rope-go/references/tdd.md:53-58`：先运行并记录 red；每个 acceptance 一轮，禁止整 slice 先写完测试。 | [TDD SKILL.md](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/tdd/SKILL.md#L34-L38)：red first、one test→implementation；[tests.md](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/tdd/tests.md#L1-L20)：integration-style、一个逻辑断言。 | 核心一致；Rope把循环单位定义成 acceptance/slice，并强制输出失败证据，Matt称 tracer-bullet slice。无需重复加规则。 |
| 行为/接口、mock | Rope `tdd.md:21-26,37-39,72-89`：用户行为、公开 seam、拒绝内部耦合；只 mock system boundary。 | [TDD SKILL.md](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/tdd/SKILL.md#L12-L26)：行为经 public interface、预先同意 seam；[mocking.md](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/tdd/mocking.md#L1-L30)：system boundaries only，优先 test DB。 | 原则一致。Matt把特定 boundary 的接口设计/DI说得更具体；Rope简述足以定边界，不必复制示例。 |
| Seam 计划 / 未知 seam | `tdd.md:32-45`：shape 锁 seam；go 中新增须计划调整+人确认；接口形状问题回 shape；参考 seam-design。`.rope/CONTEXT.md:135-137` 定义 ticket-TDD/issue-BDD。 | 上述 TDD skill 18-26 行要求 pre-agreed seams，遇接口设计问题 consult codebase-design。 | 方向一致；Rope额外加阶段锁定与升级路径，是编排边界，不是重复政策。 |
| 重构 | `tdd.md:62-64`：微小 tidy 可在 green 后，其余独立 review/切片。 | TDD SKILL 34-38 行：refactoring 不属 red-green，去 code-review。 | Rope略允许 tiny tidy，Matt更严格；未见其造成问题证据，不建议仅为一致而收紧。 |
| 期望值/断言粒度 | Rope `tdd.md:55-61,74` 明确 one logical behavior、独立 oracle、反 tautology；按 acceptance 而非断言计循环。 | `tests.md:1-20` 写 one logical assertion per test；具体反例区分独立 literal 与重算算法。 | 一致的正确性原则；逻辑断言粒度不是 Rope 明文规则，可能是真差异，但尚无实际痛点证据。列为候选，不直接加。 |
| Red 记录 | Rope `tdd.md:53-54,77,110-119` 要记录失败；缺证据视 implementation miss。 | Matt只要求 failing test first（SKILL.md:34-38），未见同等 return-evidence 门。 | Rope额外要求有派工/审计理由，保留，不应因上游没写而删。 |
| 覆盖率 / 全量复跑 | Rope TDD 文档不设覆盖率门槛；`execution-rules.md:115-145` 聚焦影响范围、复用同 HEAD 绿证据、全量是 scope 而非频次。 | 已查的 Matt TDD 主文、tests、mocking 没有 coverage 门槛或全量复跑政策。 | 上游未覆盖，不能推成反对；Rope按影响面和issue级验收的规则是独立机制。 |

## 优先候选（最多三项）与不改项

1. **低优先、可不改：测试粒度。** Matt `tests.md` 明文 one logical assertion per test；Rope 已写 one logical behavior per cycle。差异是单个测试的表述粒度，不是缺少单行为原则。不能误改成每个测试只许一条 assert；实际缺陷未经核实，不建议单独新增规则。
2. **不需迁移：mocking、public behavior、独立 expected value、refactor 时机、按 acceptance 循环、seam 先确认**均已写入 Rope。Matt `tests.md` 的例子不值得拷进 playbook。
3. **保留 Rope 专属：**行为矩阵→切片 red-green→issue E2E assembled behavior、shape seam 锁定、人类变更计划、red/green 返回证据、style/docs waiver、focused tests/基线与全量频率。Matt 没有覆盖这些 Rope 父子派工约束。

## 叶子消费与表达检查

当前分层已有定义：`skills/rope-go/SKILL.md:17-19` 把 playbook作为独立阅读路径；`execution-rules.md:181-187` 要求叶读取它，brief仅携带 `TDD required/waived`、红绿命令/红定义等操作合同。故遵守已确认方向：规则细节留 playbook；每个任务的行为、seam、命令、waiver 放 brief；不复制整份 TDD 到 preset、父技能正文或brief。规则本身清晰，未发现需要“再加一句”的明显歧义；“one logical assertion per test”是细微粒度表述差别，Rope 已有 one logical behavior。不能直接将叶子的阅读入口换成全局独立 tdd：后者要求执行者写测试前向用户确认 seam，Rope 已在 shape 确认并要求叶子遇设计变化退回父，必须保留这个适配边界。

## Unknowns

无法从规则文本判断哪个实践在真实执行中更有效；未审阅每个具体 issue 的 brief 实例或运行记录（按题意不查 sessions）。`/home/wufei/.agents/skills/tdd/SKILL.md` 与上游正文相同，但没有核实该全局安装来源/更新时间。