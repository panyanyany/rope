<a id="close-gate"></a>
# 关闭门槛

**仅当人工明确关闭本批审查**时推进 `last-reviewed-sha`。放弃或部分审查保持固定版本不变，草稿可留在 `reviews/`。

<a id="what-counts-as-close"></a>
## 什么算关闭

人工明确说本批完成，例如：

- “关闭这次采收”（close this harvest）。
- “固定这个版本 / 推进 SHA”（pin it / advance the SHA）。
- “本批完成，记录标记并关闭”（batch done, record marks and close）。

沉默、“看起来有意思”、只标部分项目而未要求关闭、开始其他工作、仅 fetch 成功、仅写完简报，都不算关闭。

<a id="what-reviewed-tip-is-written"></a>
## 写入哪个已审 tip

关闭时写简报页眉已记录的 `Reviewed tip` **完整 SHA**，即写简报时 fetch 得到的 `origin/<default-branch>` 对象，见 clone-and-git。不先重写简报就不能关闭到另一个 tip。

<a id="on-close-baseline-or-delta"></a>
## 关闭时（基线或增量）

1. 确认简报反映人工意图：
   - **Baseline：**不生成 adopt/adapt 清单，关闭只固定 SHA（**B1**）。
   - **Delta：**收到的人工标记须记录，包括明确 ignore。建议标记**不是**人工标记；关闭前把已给的人类决定写入 `Human mark:` 字段和批次表。人工未逐项标记而直接关闭时如实写明，如 `_(none — closed without item marks)_`，不能把建议冒充人工决定。
2. 简报设 `Status: closed`，填写 `Closed at: <ISO 日期或本地时间戳>`。
3. 更新 `.rope/upstream/mattpocock-skills/source.md`：
   - `Last reviewed SHA: <已审完整 tip>`。
   - `Last reviewed at: <时间戳>`。
4. 向人工确认新 SHA、简报路径，以及本技能**未修改**任何 `skills/rope-*` 文件。

<a id="delta-close-specifics"></a>
### 增量关闭细则

- 固定版本推进到简报页眉**已审 tip**，即当时 fetch 的默认分支 tip，不选中间提交、不再写 last。
- tip 已等于固定版本的无变化增量**无需关闭**；人工仍说关闭则不改 SHA，保持幂等。
- 记录标记不等于吸收变化；产品编辑是独立后续动作（**A1**）。

<a id="sourcemd-field-shapes-after-close"></a>
### 关闭后的 `source.md` 字段格式

```markdown
- Last reviewed SHA: <40 位十六进制>
- Last reviewed at: <YYYY-MM-DD 或 ISO-8601>
```

只有成功关闭才替换 `_(none yet — establish on first harvest baseline)_` 与 `_(none)_` 占位符。

<a id="on-abandon--partial"></a>
## 放弃或部分审查

1. 保持原 `last-reviewed-sha`，首次基线仍为**空**。
2. 简报保留 `Status: open`，或在关闭一节注明放弃。
3. 除非人工要求，不删除草稿。
4. 不写“临时”SHA 来“防止忘记”。

<a id="idempotency"></a>
## 幂等性

| 情形 | 行为 |
| --- | --- |
| 同一 tip 的已关闭批次再次关闭 | 不改 SHA，保留已关闭简报，不重复建文件 |
| SHA 仍为空，同一 tip 重跑基线 | 复用已有 open 基线，不建第二个 `*-baseline.md` |
| SHA 仍为空，tip 变化后重跑 | 更新 / 替代 open 简报，关闭前 SHA 仍为空 |
| 先前放弃，之后关闭 | 可关闭与待固定 tip 对应的简报，只更新一次 `source.md` |
| tip 仍等于已审 SHA，重跑增量 | 报告无变更，不建空采纳清单、不改 SHA |
| 同一 tip 已有 open 增量简报，重跑 | 复用 / 刷新，不建第二份 |
| open 增量关闭前 tip 变化 | 更新 / 替代简报，关闭前 SHA 不变 |
| 记录人工标记后关闭增量 | SHA → 已审 tip；保留标记，仍不改产品技能 |

<a id="after-close-a1"></a>
## 关闭之后（A1）

吸收已接受项目是同一或后续会话的**独立普通编辑**，如“把简报第 2 项应用到 rope-grill”。本技能不执行该编辑。只有大工作流语义变化才走完整 `rope-grill` / `rope-shape`，普通小改不必如此。

基线关闭尤其只固定版本，不编辑产品、不由本技能生成采纳待办。

<a id="forbidden"></a>
## 禁止事项

- 未经人工关闭，为“防忘记”写 SHA。
- 因简报写完、fetch 成功或基线 tip 已解析而自动关闭。
- 关闭时编辑产品技能。
- 放弃时推进 SHA。
