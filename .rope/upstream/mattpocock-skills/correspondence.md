<a id="correspondence-mattpocockskills--rope"></a>
# 上游对应表：mattpocock/skills → Rope

扫描策略 C1：默认只比较兴趣 high 的行；watch 供可选点名扫描，out 忽略。

| Matt 技能 | Rope 目标 | 兴趣 | 说明 |
| --- | --- | --- | --- |
| `grill-me` | `skills/rope-grill` | high | 核心访谈循环 |
| `grill-with-docs` | `skills/rope-grill` | high | 访谈与长期文档 |
| `grilling` | `skills/rope-grill` | high | 共享访谈方法 |
| `to-spec` | `skills/rope-shape` | high | 讨论转 PRD/spec，上游由 to-prd 改名 |
| `to-tickets` | `skills/rope-shape` | high | PRD 转纵向切片 / issue，上游由 to-issues 改名 |
| `to-prd` | `skills/rope-shape` | out | 上游已改名为 `to-spec` (基线 9603c1c) |
| `to-issues` | `skills/rope-shape` | out | 上游已改名为 `to-tickets` (基线 9603c1c) |
| `setup-matt-pocock-skills` | `skills/rope-init` | high | 仓库初始化约定，迁移独立处理 |
| `tdd` | `skills/rope-go` | high | go 切片内的 TDD 纪律，不是独立技能。边界设计术语由以下文档吸收： `skills/rope-shape/references/seam-design.md` (2026-09-01) |
| `triage` | _尚无_ | watch | 跟踪器接入状态机，不是默认路径 |
| `prototype` | _尚无_ | watch | 用临时代码回答设计问题，可选访谈支路 |
| `diagnosing-bugs` / `diagnose` | _尚无_ | watch | 调试循环，可作未来参考 |
| `domain-modeling` | `.rope/CONTEXT.md` / ADR 方法 | watch | 术语 / ADR 澄清，部分由 grill 吸收。上游于 2026-10-08 改名 GLOSSARY，当时用户决定保留 CONTEXT，init 带并存指针；后续迁移约定见 clear |
| `handoff` | go/verify 的叶子简报模式 | watch | 已部分吸收 |
| `ask-matt` | _无_ | out | 技能路由，Rope 由父编排器负责 |
| `zoom-out` / `teach` | _无_ | out | 提示 / 教学，不是产品流程 |
| `write-a-skill` / `writing-great-skills` | _无_ | out | 技能编写元工作，不在 v1 采收范围 |
| 非 Matt 本地技能 | _无_ | out | 如浏览器 / 前端工具 |

上游新增可映射技能时，先加行，再依赖默认扫描。
