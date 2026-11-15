<a id="ponytail-prior-art-ladder"></a>
# Ponytail 先例阶梯

<a id="question"></a>
## 问题

ponytail 如何做到“不重复造轮子、参考优秀产品”，Rope grill 应如何吸收为调研底线？

<a id="verified-facts"></a>
## 已核验事实

<a id="ponytail-ladder-verbatim-structure"></a>
### ponytail 阶梯（保留原结构）

Fact: 写代码前逐级检查，首个满足处停止：
1. 真需要存在吗？YAGNI。
2. 仓库已有？复用，不重写。
3. 标准库可做？直接用。
4. 平台原生可做？如原生 date 输入优先日期库。
5. 已装依赖可做？几行能解的不新增依赖。
6. 能一行实现？就一行。
7. 最后才写最小可用代码。

阶梯在理解问题后执行，不代替理解。可以省力，不能疏忽；缩短方案，不缩减阅读。信任边界、数据丢失处理、安全、无障碍底线不削减。
Source: https://github.com/DietrichGebert/ponytail 的 skills/ponytail/SKILL.md，本机克隆 2026-09-29 读取，MIT。
Verified by: 完整 SKILL.md 及 README 基准章节。
Stability: high，技能正文即产品。
Implication: Rope 主要吸收 1–5 级为 grill/shape 调研纪律；go 已通过简报预算要求最小 diff。新点是委派可联网 explore 查先例，不靠模型记忆。

<a id="unverified-industry-claims-are-the-failure-mode-to-guard"></a>
### 必须防范未核验行业主张

Fact: 月度对账会话用父编排器记忆中的“Claude Code / OpenClaw 都这么做”支持 skill.run 标准 CLI，零核验，最终成为失败最多切片。
Source: 01a0eac3 会话 JSONL，2026-09-29T01:57:57；见[回归审计](grill-research-coverage-regression-audit.md)。
Verified by: 会话时间线提取。
Stability: n/a，历史证据。
Implication: 必须明确禁止把“大家都这样”作依据；派调研验证或删主张。

<a id="rope-explore-research-mode-already-supports-the-floor"></a>
### explore 调研模式已支持底线

Fact: 已装 explore 默认只读，调研简报可联网，并仅在 research 写一个结论产物。
Source: 2026-09-29 核对 ~/.pi/agent/agents/rope-explore.md；生成来源为 harness-presets。
Verified by: 读取预设。
Stability: medium，机器本地、可再生成。
Implication: 无需改预设，grill 派发引用模式即可。

<a id="assumptions"></a>
## 假设

第 6 级“一行”及极简输出是编码风格，不纳本次 grill 范围；Rope 用最小简报和审查处理。

<a id="open-questions"></a>
## 待定问题（当时记录）

- 流程步骤、指南、就绪清单何处强制？提议三者都写，类比前沿轮次；当时待用户同意。
- 优秀产品体验先例与成熟开源库选项应拆简报，还是同调查的两节？
