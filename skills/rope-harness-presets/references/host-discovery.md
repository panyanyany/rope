<a id="host-discovery"></a>
# 宿主探测

这是保持宿主中立的核心流程。模型在**目标宿主内**执行探测，不靠固定表格决定。完整 pi 示例见 [pi-adapter.md](pi-adapter.md)。

<a id="1-identify-the-host"></a>
## §1 识别宿主

证据信任顺序：宿主会话标识 / 环境变量 / 自述，其次用户指定，最后配置目录特征。必须探测，不能假设：

| 目录特征 | 宿主 |
| --- | --- |
| `~/.pi/agent/` | pi |
| `~/.codex/` | codex |
| `~/.gemini/` 或项目 `.agents/agents/` | agy / Antigravity CLI |

多个候选则列证据、只问一次并记答案。无特征和自述则 `host_unidentified`，停止且不写入。

<a id="2-discover-the-host-agent-mechanism"></a>
## §2 探测代理机制

确认自定义代理注册位置及格式。下表是截至 2026-09-08 的**线索，不是权威**，写前必须用本地可用示例或当前官方文档核实：

| 宿主 | 注册位置 | 格式 | 核实方式 |
| --- | --- | --- | --- |
| pi | `~/.pi/agent/agents/*.md` | Markdown + YAML frontmatter，如 model/thinking/tools | 已有代理文件 |
| codex | `~/.codex/agents/*.toml` | TOML，name/description/model/model_reasoning_effort/developer_instructions | 已有文件及官方 subagents 文档，注意版本差异 |
| agy | `~/.gemini/config/agents/*.md`，仅全局，CLI 不发现项目 `.agents/agents/` | Markdown + frontmatter；model 只接受 pro/flash/flash_lite/inherit 层级别名，具体 ID 会验证失败，可调用时用 --model 固定 | `agy agents`、`agy models` |

核验纪律：优先本地可用示例，其次对齐已装版本的当前官方文档，如 `codex --version`；需要且用户提供时可用代理。记录读取路径或文档 URL 和日期，作为清单 sources。仍无法核验则报告 `no_agent_mechanism`，不写代理。只有用户要求才把缺口存 capability_gaps。不能照相似宿主猜格式。

<a id="3-discover-the-model-inventory"></a>
## §3 探测模型目录

只读宿主原生来源：

| 宿主 | 来源 |
| --- | --- |
| pi | `~/.pi/agent/settings.json` 的 enabledModels，可 models.json 补充 |
| codex | `~/.codex/config.toml` 的 model、model_providers.*、review_model；model_catalog_json 指向的目录对象 `{models[]}` |
| agy | `agy models` 含层级变体；frontmatter model 仍只接受别名 |

空 / 缺失 / 无法解析则 `no_models_discovered`，停止且不写入。不能改这些文件，补充信息失败不致命。

<a id="4-confirm-the-invocation-surface-optional-but-recommended"></a>
## §4 确认调用入口（可选，推荐）

查宿主是否读技能目录和 `AGENTS.md` 类全局指令。这用于报告 Rope 技能在该宿主的工作方式，不改变写入范围，也不是阻塞门槛。

<a id="5-write-6-manifest-7-report"></a>
## §5 写入、§6 清单、§7 报告

按 SKILL.md 第 5–7 步，在已核验原生位置写 rope-* 代理文件，以 `~/.config/rope/harness/<host>.json` 保存清单，短报置信度和能力缺口。

<a id="capability-gap-examples-worth-recording-when-hit"></a>
## 遇到时值得记录的能力缺口

- 宿主子代理继承父设置，不能逐叶子固定模型。
- frontmatter 只接受层级别名，不接受具体模型 ID，需派生时固定。
- 只读全局注册位置，忽略项目代理目录。
- 文件代理可注册但列表不刷新；先记录已复现结果，不能把未复现传闻当事实。
