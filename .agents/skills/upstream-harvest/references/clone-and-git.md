<a id="clone-and-git-conventions-s1"></a>
# 克隆与 git 约定（S1）

固定机制为**本机克隆 + 上次已审 SHA**，不用 git 子模块。上游不是 Rope 运行时或 `rope add` 依赖。

<a id="paths"></a>
## 路径

| 项目 | 默认值 / 来源 |
| --- | --- |
| 远端 HTTPS URL | `https://github.com/mattpocock/skills`，取自 `source.md` |
| 远端 SSH URL，密钥可用时优先 | `git@github.com:mattpocock/skills.git` |
| 默认分支 | `main`，取自 `source.md` |
| 本机克隆 | `~/.cache/rope-upstream/mattpocock-skills`，可由 `source.md` 覆盖 |
| 已审固定版本 | `.rope/upstream/mattpocock-skills/source.md` 的 `last-reviewed-sha` |
| 上游技能文件 | 嵌套 `skills/<bucket>/<skill-name>/SKILL.md`，不是仓库根目录下的技能目录 |

`allowlist-diff.sh` 先在 tip 树、再在 last 树中查找 `…/<skill-name>/SKILL.md`，解析对应表的技能名。上游改名后，在更新对应表前会显示为 `missing-*`。

把 `~` 展开为维护者家目录。不更新 `source.md` 就不能另造缓存根路径。

<a id="network--proxy-this-machine"></a>
## 本机网络与代理

本机 GitHub 流量常需代理，见 `.rope/research/github-access.md`：

| 传输 | 配置 |
| --- | --- |
| HTTPS | 用 `git config` 或单次 `-c` 设置 `http.https://github.com.proxy=http://127.0.0.1:8118` |
| SSH | `~/.ssh/config` 的 Host `github.com` 设置 `ProxyCommand nc -X connect -x 127.0.0.1:8118 %h %p` |

维护者密钥能通过代理时优先 SSH，否则 HTTPS + 代理。代理不可用导致 clone/fetch 失败时停止并报告，不能称固定版本最新。

可选辅助脚本，可从仓库根或任意工作目录调用：

```bash
# 输出 CLONE_PATH、DEFAULT_BRANCH、TIP_SHA、SHORT_SHA；失败返回非零
.agents/skills/upstream-harvest/scripts/ensure-clone-and-tip.sh \
  [.rope/upstream/mattpocock-skills/source.md]
```

环境覆盖：`ROPE_UPSTREAM_CLONE`、`ROPE_UPSTREAM_URL`、`ROPE_UPSTREAM_BRANCH`、`ROPE_UPSTREAM_PROXY`（HTTPS 默认 `http://127.0.0.1:8118`）。

<a id="ensure-clone"></a>
## 确保克隆存在

1. 路径缺失或不是 git 仓库：创建父目录，任选一条克隆：
   - `git clone git@github.com:mattpocock/skills.git <clone-path>`。
   - `git -c http.https://github.com.proxy=http://127.0.0.1:8118 clone https://github.com/mattpocock/skills <clone-path>`。
2. 克隆已存在：
   - `git -C <clone-path> remote get-url origin` 须匹配 `source.md` URL 或有记录的等价地址，同仓库 HTTPS / SSH 等价可用。指向**不同仓库**时停止询问，不覆盖。
   - 运行 `git -C <clone-path> fetch origin`，按需使用相同代理 / `-c`。
   - 不 push，不把该路径作为 Rope 子模块。

<a id="reviewed-tip-definition"></a>
## 已审 tip 的定义

**已审 tip** 是**成功 fetch 后**远端跟踪默认分支的对象名：

```bash
git -C <clone-path> rev-parse "origin/<default-branch>"
```

- 完整 SHA 写入简报页眉，关闭时写入 `source.md`。
- **Shortsha** 为完整 SHA 前 7 个十六进制字符，用于简报文件名。
- 不使用未经 fetch 的本地分支、脏工作树 HEAD、失败 fetch 后的猜测 / 缓存值。
- 基线与增量对“已审 tip”使用同一定义。

<a id="diff-scope-c1--delta-only"></a>
## 比较范围（C1），仅增量

默认只比较对应表关注度为 `high` 的路径，通常是各 Matt 技能目录及其 `SKILL.md` / 引用资料。

当前 C1 high 名称如下，每次运行仍须重读对应表：

- `grill-me`、`grill-with-docs`、`grilling`。
- `to-prd`、`to-issues`。
- `setup-matt-pocock-skills`。
- `tdd`。

每技能用目录路径 `<skill>` 作为 git pathspec。`watch` 仅人工本次**点名**才扫描，`out` 不扫描。

优先用确定性辅助脚本：

```bash
.agents/skills/upstream-harvest/scripts/allowlist-diff.sh \
  --clone <clone-path> \
  --last <last-reviewed-sha> \
  --tip <tip-sha> \
  --correspondence .rope/upstream/mattpocock-skills/correspondence.md \
  [--named-watch triage,prototype]
```

机器输出含 `MATERIAL=yes|no`、`COMMITS=`、`MISSING_AT_TIP=`、逐技能 `STATUS=` 及筛选后的 diff。退出码 `2` 表示 last SHA 格式错误或未知，stderr 给修复指引；`3` 表示克隆 / tip 问题。

等价路径过滤的原始 git 示例：

```bash
git -C <clone-path> log --oneline <last>..<tip> -- <allowlist paths…>
git -C <clone-path> diff <last> <tip> -- <allowlist paths…>
git -C <clone-path> cat-file -t <last-reviewed-sha>   # 必须输出 commit
```

默认不运行无路径过滤的全仓 `git log` / `git diff`。`watch` 只人工点名纳入，`out` 永不扫描。**Baseline** 不做以采纳为目标的 diff，可选快照仅列对应表允许清单名称。

<a id="delta-preflight"></a>
### 增量预检

1. fetch，声称最新时必需。
2. tip = `rev-parse origin/<default-branch>`。
3. 已审 SHA == tip，则报告无变更，不编项目、不改 SHA。
4. 否则确认 last SHA 是克隆内提交，再按允许清单比较。

<a id="failure-modes-must-surface"></a>
## 必须暴露的失败

| 情形 | 行为 |
| --- | --- |
| 无网络 / 代理不可用 / fetch 失败 | **停止**；报告 git stderr 类型与路径，不称最新，不写 tip 到 `source.md` |
| 克隆路径不可读 / 失败后不是 git 目录 | **停止**，报告路径 |
| origin 指向别的仓库 | **停止**，询问人工 |
| 已审 SHA 损坏 | **停止**，修 `source.md` 或经人工同意重建基线，不默编 |
| 增量 last SHA 不是克隆内提交 | **停止**，给 `git cat-file` / 重新 fetch / 重建基线指引，不默编 |
| 增量 tip 缺允许路径 | 简报“上游缺失路径”（Paths missing upstream）**列出**，不能静默全部跳过 |
| 增量 tip 等于 last | 正常报告无变更，不算失败 |

clone/fetch 失败既不是成功基线，也不是成功“无变化”增量。只允许保留不推进 SHA 的 open 草稿作为部分状态。

<a id="forbidden"></a>
## 禁止事项

- 将 `mattpocock/skills` 加为本 Rope 仓库的 git 子模块。
- 将上游文件树纳入 `skills/` 或产品包。
- push 到上游远端。
- 在采收中安装 Matt 技能到全局代理目录。
- fetch 未成功时编造 tip SHA。
