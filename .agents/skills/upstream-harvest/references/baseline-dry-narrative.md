<a id="baseline-dry-narrative-offline-fixture-checklist"></a>
# 基线离线演练（测试样例检查清单）

无需真实网络，核验空 SHA → 基线 → 关闭 / 放弃。代理与审查者可用技能正文和虚构 tip 逐项检查。

<a id="fixture-inputs"></a>
## 样例输入

| 字段 | 值 |
| --- | --- |
| `source.md` 的 Last reviewed SHA | 空 / `_(none yet — establish on first harvest baseline)_` |
| `source.md` 的 Last reviewed at | `_(none)_` |
| 逻辑克隆路径 | `~/.cache/rope-upstream/mattpocock-skills` |
| 默认分支 | `main` |
| 虚构已审 tip，假设 fetch 成功 | `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` |
| Shortsha | `aaaaaaa` |
| 简报日期 | `2026-04-08` |
| 预期简报路径 | `.rope/upstream/mattpocock-skills/reviews/2026-04-08-aaaaaaa-baseline.md` |

<a id="path-a--empty-sha--baseline-brief--human-close"></a>
## 路径 A：空 SHA → 基线简报 → 人工关闭

| 步骤 | 动作 | 可观察检查 |
| --- | --- | --- |
| A1 | 读 `source.md`，SHA 为空 | 走 **Baseline**，不是错误 |
| A2 | 确保克隆并 fetch，或模拟上述 tip 成功 | tip 为完整虚构 SHA；真实失败应**停止** |
| A3 | 用基线模板写预期路径 | 文件名 `*-baseline.md`，页眉区间 `none (baseline) → aaaa…` |
| A4 | 检查简报正文 | **没有** adopt/adapt 推荐清单，可列允许技能名称快照 |
| A5 | 等待，人工说“关闭这次采收” | 仅关闭语句触发 |
| A6 | 简报设 `Status: closed`，填 `Closed at` | 状态不留 open |
| A7 | 更新 `source.md` | `Last reviewed SHA: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`，已记时间 |
| A8 | 产品技能 | `skills/rope-*` 未改 |

**A 通过条件：**仅明确关闭后的 A7 推进 SHA，简报没有采纳清单。

<a id="path-b--empty-sha--baseline-brief--abandon"></a>
## 路径 B：空 SHA → 基线简报 → 放弃

| 步骤 | 动作 | 可观察检查 |
| --- | --- | --- |
| B1–B4 | 同 A1–A4 | 有 open 基线简报 |
| B5 | 人工放弃 / 没有关闭语句 | 不算关闭 |
| B6 | 保持 `source.md` | SHA 仍为空 / 占位符 |
| B7 | 简报 | `Status: open` 或注明放弃，草稿可留 |

**B 通过条件：**不写 SHA，不伪造固定版本。

<a id="path-c--idempotent-re-close--re-run"></a>
## 路径 C：幂等重复关闭 / 重跑

| 步骤 | 动作 | 可观察检查 |
| --- | --- | --- |
| C1 | 路径 A 已对 `aaaa…` 关闭 | SHA 已写 |
| C2 | 人工再次关闭同一 tip | 不改 SHA，不建第二份同 tip 基线 |
| C3 | SHA 仍为空，同 tip 已有 open 简报时重跑 | 复用，无重复文件 |
| C4 | SHA 为空，关闭前 tip 变为 `bbbbbbb…` | 更新 / 替代 open 简报，关闭前 SHA 仍为空 |

**C 通过条件：**重复关闭 SHA 稳定，同 tip 不重复建基线。

<a id="path-d--clonefetch-failure-no-fake-success"></a>
## 路径 D：克隆 / fetch 失败（不虚报成功）

| 步骤 | 动作 | 可观察检查 |
| --- | --- | --- |
| D1 | SHA 为空，代理 / 认证 / 网络造成克隆或 fetch 失败 | 停止并明确原因 |
| D2 | `source.md` | SHA 仍为空 |
| D3 | 代理输出 | 不称“最新”，不编 tip |

**D 通过条件：**失败可见，固定版本不变。

<a id="grep--structural-anchors-skill-package"></a>
## 文本与结构检查点（技能包）

切片 2 后确认这些文字或含义存在：

- SKILL.md：空 SHA → Baseline，不是错误。
- SKILL.md / close-gate：仅关闭推进 SHA，放弃仍为空。
- brief-template：基线禁止 adopt/adapt 清单。
- clone-and-git：已审 tip 为 fetch 后的 `origin/<default-branch>`。
- clone-and-git：代理 / 失败必须可见。
- 本文件：保留 A–D 路径。
