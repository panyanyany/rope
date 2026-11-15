<a id="worktree-setup-contracts--symlink--install-notes"></a>
# Worktree 准备契约：符号链接与安装说明

ADR 0008 的 `worktree-setup:` 契约背后，面向维护者的说明。不是分发技能正文；正文保持通用，这里记录选择层级、编写脚本所需的各生态事实。

<a id="why-a-contract-at-all"></a>
## 为什么需要契约

git worktree 只复制跟踪文件，不带 `node_modules/`、`.venv/`、构建缓存等未跟踪依赖，所以新 worktree 通常要先准备环境才能测试。每个 worktree 可耗几秒链接或几分钟冷安装；按切片就绪为每个叶子建 worktree 后，成本随并行数增加。

<a id="tier-choice"></a>
## 选择层级

- **`host-managed`：**宿主在创建时准备。例如 agent-workbench 的 herdr 脚本为每个新 worktree 链接依赖。最快，但依赖该宿主；其他机器 / 宿主若无命令就退到第 3 层。**范围限制（2026-08-24 现场发现）：**herdr hook 只对自身创建的 worktree 生效，Rope 隔离 worktree 没有链接。宿主仅部分覆盖，实际应按第 2 层声明手动调用脚本，例如 `bash data/local-runtime/herdr-setup.sh <path>`；接受“准备麻烦”作为 shared 降级理由前，先查能否手动运行。
- **声明命令：**可移植，由叶子在有需要时执行。条件步骤让无需准备即可测试的仓库不付成本。

<a id="per-ecosystem-notes-symlink-feasibility"></a>
## 各生态说明（链接可行性）

### Node / npm

- 从主检出链接 `node_modules` 是常见加速，herdr 如此实现，注意：
  - **安全：**npm 历来可能沿链接向上，安装时写真实 `node_modules`。链接存在时不能在 worktree 里 `npm install`；条件步骤只跑测试，不添加依赖。
  - 少数工具链中，以绝对路径为键的原生构建（`node-gyp`）可能受链接影响；冷 `npm ci` 是回退。
- pnpm 自带按内容寻址的包存储；worktree 内 `pnpm install` 通常足够快，不必再链接。

### Python

- **venv 不适合安全链接共享：**解释器、`pyvenv.cfg`、入口 shebang 硬编码绝对路径，链接后可能产生难懂故障。可选：
  - uv 项目用 `uv sync`，每 worktree 几秒，适合作为声明命令。
  - `python -m venv .venv && pip install -e .[test]` 正确但慢，适合低并行仓库。
- `virtualenv --copies` 不解决问题；问题是路径指向主检出，不是解释器二进制本身。

### Rust / Go

- cargo / go 默认共享 `~/.cargo`、`~/go/pkg/mod` 缓存，worktree 通常**无需准备**。可不声明，测试通过就不触发第 3 层回退。

### JVM

- Gradle/Maven 缓存为用户全局，worktree 通常只需 wrapper，往往同样无需准备。

<a id="contract-hygiene"></a>
## 契约维护

- 声明位于 `routes.md` 的构建 / 测试命令节，只保留一处，供 shape/go/init 读取。
- 原研究中的 rope-shape 会在缺行时重新确认，因此已有仓库无需重跑 init 即可逐步接入；现行行为以技能正文为准。
- 写主检出依赖等共享状态的准备脚本破坏隔离；保持写入 worktree 内，可向外建立只读链接。
