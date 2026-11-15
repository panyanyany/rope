---
name: upstream-harvest
description: 本仓维护技能，将 mattpocock/skills 的固定版本与思路变化整理为人工审查简报；不随 rope add 分发。
disable-model-invocation: true
---

<a id="upstream-harvest"></a>
# 上游灵感采收

比较已固定的 Matt Pocock 技能上游与上次已审版本，写人工审查简报、记录标记，**仅在人工明确关闭后**推进固定版本。这是本 Rope 仓库的 Upstream Harvest 维护流程，不是产品技能，不做文件合并或一次性迁移。

编写审查简报时，遵守[中文文档写作规则](../../../skills/rope-grill/references/content-design.md)。先说明需要审查的变化，再列证据、建议和待人工决定的事项。

<a id="state-read-first"></a>
## 状态（先读）

| 产物 | 路径 |
| --- | --- |
| 固定版本 / 克隆路径 / 上次已审 SHA | [`.rope/upstream/mattpocock-skills/source.md`](../../../.rope/upstream/mattpocock-skills/source.md) |
| C1 扫描允许清单与关注度映射 | [`.rope/upstream/mattpocock-skills/correspondence.md`](../../../.rope/upstream/mattpocock-skills/correspondence.md) |
| 审查简报 | [`.rope/upstream/mattpocock-skills/reviews/`](../../../.rope/upstream/mattpocock-skills/reviews/) |

可选调研背景：`.rope/research/upstream-inspiration-sources.md`。
本机 GitHub 网络说明：`.rope/research/github-access.md`。
术语：`.rope/CONTEXT.md` 中的 **Upstream Harvest**。

<a id="decisions-do-not-re-litigate"></a>
## 已定决策（不重新争论）

| ID | 规则 |
| --- | --- |
| **R1** | 输出人工审查简报，不自动合并产品技能 |
| **S1** | 本机克隆 + 上次已审 SHA，不使用 git 子模块 |
| **C1** | 只比较对应表关注度为 `high` 的行；人工点名时才纳入 `watch` |
| **A1** | **不修改** `skills/rope-*`；接受的变化经人工同意后另作普通编辑 |
| **B1** | 首次只建立 **Baseline** 基线，固定 SHA，不生成批量采纳清单 |
| **关闭门槛** | 仅在人工明确关闭本批后推进 `last-reviewed-sha` |

<a id="branch"></a>
## 分流

从 `source.md` 的 `Last reviewed SHA: …` 读取 `last-reviewed-sha`。值为空、缺失，或为 `_(none yet …)_` / `none` / `—` 占位符时视为**空**。

| 条件 | 分支 |
| --- | --- |
| 空 / none | **Baseline**，不是错误 |
| 存在完整 git SHA | **Delta** |

<a id="baseline"></a>
### 首次基线（Baseline）

空 `last-reviewed-sha` 表示首次固定版本，不是失败，也不是批量采纳（**B1**）。完整操作见[克隆与 git](references/clone-and-git.md)、[简报模板](references/brief-template.md)、[关闭门槛](references/close-gate.md)；离线演练见[基线检查清单](references/baseline-dry-narrative.md)。

1. **读状态。**从 `source.md` 读取 URL、默认分支、克隆路径、已审字段；确认 SHA 为空，走 Baseline。
2. **确保本机克隆存在。**默认 `~/.cache/rope-upstream/mattpocock-skills`，展开 `~` 并遵守 `source.md` 覆盖值。优先用 [`scripts/ensure-clone-and-tip.sh`](scripts/ensure-clone-and-tip.sh)，或按克隆说明操作。优先 SSH `git@github.com:mattpocock/skills.git`，或按 github-access / clone-and-git 配 HTTPS 代理。
3. **获取上游。**更新远端引用。克隆 / fetch 失败时**停止**，明确 git stderr 类型、路径、网络原因，不虚报成功、不编造 tip。
4. **解析已审 tip。**成功 fetch 后，tip 为 `origin/<default-branch>` 的完整 SHA，这是基线中“已审 tip”的唯一定义；shortsha 为前 7 个十六进制字符。
5. **写中文基线简报。**按模板写 `.rope/upstream/mattpocock-skills/reviews/YYYY-MM-DD-<shortsha>-baseline.md`，必须包含：
   - 中文正文，路径 / SHA / 技能名可保留原文。
   - 区间 `无（baseline）→ <tip>`；无上次记录，对照**本地 Rope 落点**。
   - 每个 C1 high 技能的上游职责、本地 `skills/rope-*` 现状、**差异要点**。
   - 可选建议标记；禁止只有 SHA 与名称列表的空壳简报。
   - 只为对照读取本地目标，**不修改**产品技能。
6. **展示并等待。**给出简报路径和 tip，等待人工 **close** 或 **abandon**，按关闭门槛识别，暂不推进 SHA。
7. **仅在关闭时：**将简报设为 `Status: closed` 并记关闭时间；把 `source.md` 的 `Last reviewed SHA` 设为完整已审 tip，更新 `Last reviewed at`。确认未修改 `skills/rope-*`。
8. **放弃时：**保持 SHA 为空 / 原值；简报保留 open 或标 abandoned。除非人工要求，不删除草稿。

**基线幂等性：**

- SHA 仍为空，已有**同一 tip** 的基线简报时复用 / 改写，不新建重复文件。
- 同一 tip 的已关闭基线再次关闭，不改 SHA、不建第二份简报。
- 首次关闭前上游 tip 变化，更新 / 替代未关闭简报，仍须完整逐技能对照；关闭前 SHA 仍为空。

**完成条件：**中文基线简报有完整逐技能对照；关闭后已审 SHA 等于已审 tip；放弃时 SHA 为空 / 原值；本技能不改 `skills/rope-*`。

<a id="delta"></a>
### 增量审查（Delta）

已有 `last-reviewed-sha` 时，比较固定版本 → 当前 tip。完整操作见[克隆与 git](references/clone-and-git.md)、[简报模板](references/brief-template.md)、[关闭门槛](references/close-gate.md)；离线演练见[增量检查清单](references/delta-dry-narrative.md)。

1. **读状态。**读取 URL、默认分支、克隆路径和完整已审 SHA；确认存在 SHA，走 Delta。
2. **检查 SHA 格式。**不是合理的完整 git SHA（40 位十六进制），如损坏值 / 残留占位符，则**停止**并给修复指引；不编造固定版本。
3. **确保克隆并 fetch。**与基线使用相同[辅助脚本](scripts/ensure-clone-and-tip.sh)和失败规则。克隆缺失 / fetch 失败 / 无网络时停止，不能凭旧工作树说“已是最新”。
4. **解析 tip。**成功 fetch 后取 `origin/<default-branch>` 完整 SHA，与基线同一定义。
5. **确认已审 SHA 在克隆中存在。**`git -C <clone> cat-file -t <last-reviewed-sha>` 必须返回 `commit`。未知 SHA 可能因重写历史、错误克隆或拼写错误；停止并给修复 / 重建基线指引，不默编，不伪造已知区间的部分简报。
6. **无变更即结束（clean no-op）。**tip 等于已审 SHA 时：清楚报告允许清单无实质变化、固定版本已最新；不编造 adopt/adapt 项、不写空增量简报（可留一行说明）、不改 SHA，无需关闭，再次关闭也是无操作。至此完成。
7. **只比较 C1 high 清单。**从对应表取 `high` 行，在 last-reviewed 与 tip 间比较。解析器查找嵌套 `skills/<bucket>/<skill>/SKILL.md`。优先用 [`scripts/allowlist-diff.sh`](scripts/allowlist-diff.sh)：

   ```bash
   .agents/skills/upstream-harvest/scripts/allowlist-diff.sh \
     --clone <clone-path> --last <last-reviewed-sha> --tip <tip-sha> \
     [--correspondence .rope/upstream/mattpocock-skills/correspondence.md] \
     [--named-watch skill1,skill2]   # 仅当人工点名 watch 行
   ```

   - 默认不全仓扫描；`watch` 仅本次人工点名才纳入，`out` 永不扫描。
   - tip 或 last 缺允许路径时，在“上游缺失路径”列出，不能静默全部跳过。
8. **写中文增量简报。**按模板写 `.rope/upstream/mattpocock-skills/reviews/YYYY-MM-DD-<shortsha>.md`，shortsha 取 **tip**：
   - 中文摘要以**上次已审 SHA** 为基准，并用一句说明相对本地落点的意义。
   - 逐技能写上游变化、对本地是否仍值得关注、仅作提案的建议标记。
   - 人工标记待填；`Status: open`。
   - 写简报不改 `skills/rope-*`（**A1**）。
9. **展示并等待。**给出路径、区间、是否实质变更；收到人工标记就更新 Human mark 字段 / 批次表。等待 close 或 abandon。
10. **仅在关闭时：**简报设 `Status: closed` 并记时间；将 `source.md` 的 `Last reviewed SHA` 更新为简报页眉中的完整已审 tip，同时更新 `Last reviewed at`。确认未改产品技能。
11. **放弃时：**SHA 不变，简报保留 open 或标 abandoned；除非人工要求，不删草稿。

**建议标记仅作提案：**

| 信号 | 倾向 |
| --- | --- |
| 适合已有 Rope 技能的小措辞 / 结构改善 | `adapt` 或 `adopt` |
| 思路有用，但 Rope 形态不同 | `adapt` |
| 噪声 / 已覆盖 / 不属于产品范围 | `ignore` |
| 以后值得看，本次不做 | `watch` |

只为建议措辞读取 Rope 目标，不在本技能中修改。大语义变化记“以后考虑 Rope issue”，不自动开启 grill/shape。

**增量幂等性：**

- tip 仍等于已审 SHA，报告无变更，不编清单，SHA 不变。
- 已有**同一 tip** 的 open 简报，复用 / 刷新，不新建重复文件。
- 同一 tip 已关闭简报再次关闭，SHA 不变。
- 旧简报未关闭而 tip 已前移，更新 / 替代简报区间；关闭前 SHA 不变。

**完成条件：**无变更报告，或已有增量简报；收到的人工标记已记录；当且仅当人工关闭才推进 SHA；本技能未修改产品技能。

<a id="failure-visibility"></a>
## 失败可见性

停止并明确原因，不虚报最新、不编造 tip / 固定版本：

| 情形 | 行为 |
| --- | --- |
| 克隆路径缺失 / 不可读 | 停止，报告路径 |
| 要求 fetch 时失败 / 无网络 | 停止，报告 git stderr 类型和路径，不称已最新 |
| 已审 SHA 损坏，非 40 位十六进制 | 停止；修复 `source.md` 或经人工同意重建基线，不默编 |
| fetch 后 SHA 仍不是克隆内提交 | 停止；确认克隆 URL、用 `git cat-file -t <sha>` 检查，或人工关闭配合清空固定版本重建基线，不默编 |
| 上游允许路径缺失 | 增量简报“上游缺失路径”（Paths missing upstream）逐项列出，不静默全部跳过 |
| origin URL 指向别的仓库 | 停止并询问人工 |

失败的 fetch 不能算“无变化”的成功增量审查。

<a id="forbidden-shortcuts"></a>
## 禁止的捷径

- 自动改 `skills/rope-*` 来“完成”采收（**A1**）。
- 未经人工关闭就推进 SHA。
- 忽略对应表，默认全仓扫描（**C1**）。
- 用 git 子模块固定版本（**S1**）。
- 把本技能放产品 `skills/`，导致随 `rope add` 分发。
- 把首次 Baseline 当批量采纳（**B1**）。

<a id="placement"></a>
## 放置位置

仅在 `.agents/skills/upstream-harvest/`，用于仓库维护；不放 `skills/`，不加入 `rope add` 分发包。
