<a id="frontend-tdd-decoupling-tests-from-styling-dom-binding-pain"></a>
# 前端 TDD：测试与样式解耦（DOM 绑定问题）

日期：2026-02-27。
触发：agent-workbench 将 Rope TDD 用于前端，测试绑定具体 DOM，导致纯样式变化也走 red→green。

<a id="sources"></a>
## 来源

- Matt Pocock `skills` 仓库的固定版本 `docs/engineering/tdd.md`：
  - 预先确认的测试边界必须遵守；重命名内部函数不破坏任何测试，是有效解耦的信号。
  - 未关闭问题 #746：技能决定边界放哪里，却没有规则决定某类改动是否值得跑整个循环，涉及配置 / 接线 / 胶水逻辑。Rope 对纯样式改动有同样缺口。
  - 浏览器 / E2E 测试不应先写；CLAUDE.md 规定行为工作后再写，因为慢循环不再划算。Rope 的 issue 级 E2E 已符合。
- Paul Hammond 的 “TDD works beautifully on the front end”：测试 DOM **行为并与美学解耦**，设计变化不应要求更新测试。评论者 M. Küsters 指出样式没有独立真值，必须看到才知结果，因此对样式做 TDD 易产生脆弱或自证式测试。
- Kent C. Dodds 的 “Testing Implementation Details” 与 Testing Library：从用户视角按 role / label 查询，不依赖 CSS 选择器或 DOM 结构。
- Playwright 最佳实践：按 role/text/label 定位，`data-testid` 兜底，避免绑定结构的 CSS/XPath。

<a id="conclusion-adopted-into-rope"></a>
## Rope 已采纳的结论

两层分工，已写入 `skills/rope-go/references/tdd.md` 与 `skills/rope-quick/SKILL.md`：

| 层次 | 流程 | 真值来源 |
| --- | --- | --- |
| 行为，含矩阵行、交互、数据、状态 | 在预先确认边界 red→green | 规范 / 已知字面量 |
| 纯样式，含颜色、间距、布局、打磨 | `TDD: waived (style-only)`，附截图产物或人工查看 | 视觉审查 |

- UI 测试绑定**无障碍契约**：role / accessible name / label，`data-testid` 兜底，不绑定 CSS 选择器、类或 DOM 结构。
- 新增反模式 **Aesthetic-coupled**：断言计算样式 / 像素值；行为未变，设计一改就失败。
- 分类难定时：若切片 Public behavior 那句话在改动前已成立，则为纯样式变化。

未采纳逐提交视觉回归基线（如 Chromatic）：对 Rope 目标仓库，其验证成本超过 quick/go 收益；有项目确需像素保证时再考虑。
