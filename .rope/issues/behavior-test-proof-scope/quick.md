# Behavior-test proof scope

status: done

## Request and scope

用户要求最小澄清 shape 测试规划、go TDD、现有行为评审和 E2E 修复规则，
不新增阶段、角色、文档类型或审批门禁，不让 implementer 启动真实栈或执行 E2E。
尚未逐项核对 Agent Workbench 的历史测试，不能把背景中的问题统归为 TDD 缺失。

## Source check

核对 Matt Pocock 原文：
https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd
（读取版本 `5beb35b040e3de97e54fa9e386d7e42d15c295c2` 的
`SKILL.md`、`tests.md`、`mocking.md`）。

- 原文：测试经过约定公开接口；每个 seam 说明 catches/misses；用可观察行为而非
  内部调用次数/顺序断言；不 mock 自有模块；逐条 red → green，非批量先写测试。
- Rope 已覆盖接口确认、逐条红绿、独立预期值、禁止 mock 内部实现及真实环境 E2E。
- 缺口：接口证明范围及真实环境余项、切片 Tests 提示、行为评审的证明充分性判断、
  E2E 代码缺陷的接口回归要求。真实环境验证的角色分工来自 Rope，不归因于 Matt。

## Changes

- `skills/rope-shape/references/issue-package.md`：在现有字段明确接口的证明范围、
  真实环境余项及切片可观察结果；足够证明行为即可，不强制系统顶层入口。
- `skills/rope-go/references/tdd.md`：澄清通过公开接口触发及观察，明确内部调用次数/
  顺序不能替代结果；沿用既有红绿和 mocking 规则。
- `skills/rope-go/references/execution-rules.md`：brief 要求读取既有 TDD playbook；
  既有行为 reviewer 判断测试是否证明切片承诺（含承诺中的调用接线），不要求 mutation
  testing；E2E 修复区分代码回归与环境/部署验证；修正 reviewer 走真实入口的旧角色表述。
- `.rope/specs/guides/behavior-matrix.md`：链接规则的唯一落点；澄清 verify 只查记录。
- 无架构、角色或接口所有权变化；继承既有 TDD、单次代码评审、parent/runner E2E 分工。

## Verification

- Docs-only，红绿豁免；未新增运行时代码或措辞断言测试。
- `node --test tests/*.test.mjs`：3/3 通过（frontmatter、相对引用、CLI 安装）。
- `grep -rn 'ADR [0-9]' skills/`：0 命中；改动未引入仓库专属路径或个人环境要求。
- `git diff --check`：通过。
- 通读 diff 并检查 shape/go 入口、brief、preset seeds/role schema：沿用逐条红绿和
  禁止 mock 自有实现；规则通过现有模板和 brief 可达，无需刷新 preset。
- 未逐项审计背景项目历史测试，未启动真实栈；本次只验证文档结构及规则一致性。
- 不修改全局 skill、已安装副本、上游 reviewed pin；不 push 或发布。
