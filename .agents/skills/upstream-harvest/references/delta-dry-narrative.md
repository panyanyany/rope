<a id="delta-dry-narrative-offline-fixture-checklist"></a>
# 增量离线演练（测试样例检查清单）

无需真实网络，核验 Delta 采收。对照技能正文、模板及可选本地测试 git 仓库逐项检查。

<a id="fixture-inputs-shared"></a>
## 共用样例输入

| 字段 | 值 |
| --- | --- |
| `source.md` 的 Last reviewed SHA，已有固定版本 | `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb` |
| 逻辑克隆路径 | `~/.cache/rope-upstream/mattpocock-skills` |
| 默认分支 | `main` |
| 对应表 | `.rope/upstream/mattpocock-skills/correspondence.md` |
| C1 high 技能 | `grill-me`、`grill-with-docs`、`grilling`、`to-prd`、`to-issues`、`setup-matt-pocock-skills`、`tdd` |
| 产品技能 | 每条路径均保持 `skills/rope-*` 未改 |

可选本地 git 样例，用于脚本冒烟：

```bash
# 创建含两次提交和一个允许路径的小型工作克隆
FIX=/tmp/rope-upstream-delta-fixture
rm -rf "$FIX" && mkdir -p "$FIX/grill-me" && cd "$FIX"
git init -q && git checkout -q -b main
echo 'v1' > grill-me/SKILL.md
git add grill-me && git commit -q -m 'add grill-me'
LAST=$(git rev-parse HEAD)
echo 'v2' > grill-me/SKILL.md
git add grill-me && git commit -q -m 'change grill-me'
TIP=$(git rev-parse HEAD)
# 在 Rope 仓库根目录运行：
# .agents/skills/upstream-harvest/scripts/allowlist-diff.sh \
#   --clone "$FIX" --last "$LAST" --tip "$TIP"
# 预期 grill-me 为 MATERIAL=yes、STATUS=changed，其余缺失路径列出。
```

<a id="path-n--clean-no-op-tip--last-reviewed-sha"></a>
## 路径 N：无变化（tip == last-reviewed-sha）

| 步骤 | 动作 | 可观察检查 |
| --- | --- | --- |
| N1 | 已有 SHA，等于 fetch 后 tip | 走 **Delta** |
| N2 | 比较 tip 与 last | 相等 |
| N3 | 报告 | 正常无操作：允许清单无实质变化 |
| N4 | 简报 | 不编 adopt/adapt 项，可不写增量文件 |
| N5 | `source.md` | SHA **不变**，无需关闭 |
| N6 | 产品技能 | `skills/rope-*` 未改 |

**N 通过条件：**不造工作，固定版本稳定，满足 E3 无操作标准。

<a id="path-m--material-delta--brief--marks--close"></a>
## 路径 M：实质增量 → 简报 → 标记 → 关闭

| 步骤 | 动作 | 可观察检查 |
| --- | --- | --- |
| M1 | 已有 SHA，fetch 后 tip **领先** last | `last → tip` 非空 |
| M2 | 仅比较 C1 high 允许清单 | 不默认扫全仓 |
| M3 | 写 `YYYY-MM-DD-<tip-shortsha>.md` | 有摘要、逐技能、建议标记、Rope 目标 |
| M4 | 建议标记 | 标为提案，Human mark 待填 |
| M5 | 人工给 adapt / ignore 等标记 | 简报 Human mark 已更新 |
| M6 | 人工说“关闭这次采收” | 只由关闭门槛触发 |
| M7 | 更新简报和 `source.md` | 已审 SHA 为**完整 tip**，状态 closed |
| M8 | 产品技能 | 仍未被采收修改 |

**M 通过条件：**有简报，仅 M7 推进 SHA，保持 A1。

<a id="path-s--bad--unknown-sha"></a>
## 路径 S：错误或未知 SHA

| 步骤 | 动作 | 可观察检查 |
| --- | --- | --- |
| S1a | 非 40 位十六进制，如 `not-a-sha` | **停止**并给修复指引，不编值 |
| S1b | 格式正确但 fetch 后克隆中不存在 | **停止**，给 `cat-file` / 重建基线指引 |
| S2 | `source.md` | 固定版本**不变** |
| S3 | 代理输出 | 不称最新、不编区间 |

**S 通过条件：**失败可见，不默编，对应矩阵的无效 SHA 行。

<a id="path-p--missing-allowlist-path-upstream"></a>
## 路径 P：上游缺允许路径

| 步骤 | 动作 | 可观察检查 |
| --- | --- | --- |
| P1 | tip 可达，至少一 C1 high 目录缺失 | 现存路径仍执行比较 |
| P2 | 简报“上游缺失路径”（Paths missing upstream） | 按名称**列出**缺失技能 |
| P3 | 不静默全部跳过 | 现存路径如有变化仍汇总 |
| P4 | 关闭行为 | 规则不变，简报保留缺失列表 |

**P 通过条件：**缺失可见，不能不列清单就当空变化成功。

<a id="path-f--fetch--clone-failure-delta"></a>
## 路径 F：增量 fetch / 克隆失败

| 步骤 | 动作 | 可观察检查 |
| --- | --- | --- |
| F1 | 已有固定版本，克隆缺失或 fetch 失败 | **停止**并给原因 |
| F2 | 不报告“无变化” / “已最新” | 失败不等于无操作 |
| F3 | SHA | 不变 |

**F 通过条件：**依赖不可用对外可见。

<a id="path-a1--product-skills-untouched-contract"></a>
## 路径 A1：产品技能不变（契约）

| 步骤 | 动作 | 可观察检查 |
| --- | --- | --- |
| A1a | 任意 N/M/S/P/F 路径 | 技能包明确禁止自动改 `skills/rope-*` |
| A1b | 模拟带标记关闭后 | 标记只在简报，本技能不写产品文件 |
| A1c | watch 行 | 仅人工点名才扫描 |

**A1 通过条件：**兼容性和边界行成立。

<a id="path-i--idempotent-delta-re-run--re-close"></a>
## 路径 I：幂等增量重跑 / 重复关闭

| 步骤 | 动作 | 可观察检查 |
| --- | --- | --- |
| I1 | 路径 M 已对 tip T 关闭 | SHA = T |
| I2 | 重跑增量，tip 仍为 T | 正常无操作，走 N |
| I3 | 同批再次关闭 | 不改 SHA |
| I4 | 同 tip 已有 open 简报，关闭前重跑 | 复用 / 刷新，不建第二份 |

**I 通过条件：**固定版本稳定，不重复建文件。

<a id="grep--structural-anchors-skill-package"></a>
## 文本与结构检查点（技能包）

切片 3 后确认：

- SKILL.md：完整 Delta 节而非骨架；无变化即结束，仅关闭推进 SHA。
- SKILL.md / close-gate：建议标记不等于已应用的产品编辑（**A1**）。
- brief-template：增量结构规则、无变化报告文本、缺失路径节。
- clone-and-git：允许清单比较脚本、错误 SHA 修复、C1 high 路径表。
- `scripts/allowlist-diff.sh` 可执行，`bash -n` 通过。
- 本文件保留 N、M、S、P、F、A1、I 路径。
- 禁止捷径仍含：不自动改产品技能，不用子模块固定版本。

```bash
# 仓库根目录结构检查，预期命中禁止规则
rg -n 'skills/rope-\*' .agents/skills/upstream-harvest/SKILL.md
rg -n '不修改|不改.*产品|自动改' .agents/skills/upstream-harvest/SKILL.md
rg -n '无变更|last-reviewed-sha' .agents/skills/upstream-harvest/SKILL.md
rg -n '上游缺失路径|修复|不默编' \
  .agents/skills/upstream-harvest/SKILL.md \
  .agents/skills/upstream-harvest/references/*.md
test ! -e skills/upstream-harvest   # 不属于产品包
bash -n .agents/skills/upstream-harvest/scripts/ensure-clone-and-tip.sh
bash -n .agents/skills/upstream-harvest/scripts/allowlist-diff.sh
```
