<a id="github-access-this-machine"></a>
# 本机 GitHub 访问记录

本文件记录原维护环境的网络与远端配置，供追溯；当前仓库远端以 `git remote -v` 为准。

<a id="question"></a>
## 问题

代理应如何为本 Rope 仓库及相关 fetch 访问 GitHub？

<a id="verified-facts"></a>
## 已核验事实

<a id="origin-remote"></a>
### Origin 远端

Fact: 当时主 git 远端 `origin` 为 `git@github.com:WufeiHalf/rope.git`。旧 haizhi 远端以 `haizhi` 保留，地址为 `ssh://git@git.haizhi.com:10022/wufei/rope-skill.git`。
Source: 维护者要求调整后的本地 `git remote -v`。
Verified by: shell。
Stability: medium。
Implication: 当时此私人工具的提交 / push 目标为 GitHub `WufeiHalf/rope`。

<a id="proxy"></a>
### 代理

Fact: 该环境 GitHub HTTPS 与 SSH 经 `http://127.0.0.1:8118`：

- HTTPS：`git config --global http.https://github.com.proxy http://127.0.0.1:8118`。
- SSH：`~/.ssh/config` 的 Host `github.com` 使用 `ProxyCommand nc -X connect -x 127.0.0.1:8118 %h %p`。

Source: 维护者指令与现场 curl/ssh 配置。
Verified by: `curl -x http://127.0.0.1:8118 https://github.com/` 返回 200；SSH 经代理到达 github.com 认证阶段。
Stability: medium，本地代理须运行。
Implication: 该环境 GitHub clone/fetch（含 mattpocock/skills 采收与 `origin` push）依赖代理，不假定直连可用。

<a id="auth-note"></a>
### 认证说明

Fact: 配置时 `ssh -T git@github.com` 提供 `~/.ssh/id_ed25519` 后返回 `Permission denied (publickey)`。代理路径通，push 前需 GitHub 账户授权此密钥或其他配置的 IdentityFile。
Source: 本地 SSH 测试。
Verified by: shell。
Stability: low，直到密钥加入。
Implication: 首次 push 可能需人工在 GitHub 添加部署 / 用户 SSH 密钥。

<a id="open-questions"></a>
## 未决问题

- 密钥修复后是否更倾向 HTTPS git + token，而非 SSH？
