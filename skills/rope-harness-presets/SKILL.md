---
name: rope-harness-presets
description: 探测当前宿主的代理机制与模型目录，以宿主原生格式生成 Rope 叶子预设及用户全局清单。刷新预设时按名称调用。
disable-model-invocation: true
---

<a id="rope-harness-presets"></a>
# Rope 宿主角色预设

在**本技能所在的任意宿主**生成 / 刷新原生叶子预设。由运行模型探测宿主生态后写原生文件，不硬编码宿主分支。仅手动调用。

| 参考 | 内容 |
| --- | --- |
| [宿主探测](references/host-discovery.md) | 识别宿主、代理注册和模型、能力缺口 |
| [角色契约](references/role-schema.md) | 共享角色、代理名、工具边界 |
| [清单格式](references/manifest-schema.md) | 用户全局清单及软降级 |
| [代理模板](references/agent-templates.md) | 中等深度正文及禁止嵌套派生 |
| [pi 示例](references/pi-adapter.md) | 一轮完整探测与写入 |
| [模型分配](references/ranking.md) | 排名、离线启发式、置信度 |
| [离线用例](references/offline-ranking-fixture.md) | 调研失败仍以低置信度分配 |
| [探测用例](references/discovery-fixtures.md) | 演练检查 |
| [调研模式](references/explore-research-mode.md) | explore 外部调研 |
| [退回率回放](references/bounce-rate-replay.md) | 规划模型选择测量协议 |

<a id="host-support"></a>
## 宿主支持

**没有硬编码支持表。**能按 host-discovery 查明自定义代理机制的宿主都可运行时支持。pi 有完整示例；codex/agy 线索附在探测指南，带日期且必须本地验证，不得优先于本地证据或当前文档。

<a id="workflow"></a>
## 工作流程

每步都执行并确认完成标准，再进入下一步。

<a id="1-resolve-host"></a>
### 1. 识别宿主

按 host-discovery §1，用会话自述、配置目录特征或用户指定信息识别。模糊则列候选和证据，只问一次；无法识别报告 `host_unidentified` 并停止，不写任何文件。

完成：宿主身份及证据已记；模糊 / 未识别时在写入前停止。

<a id="2-discover-the-host-agent-mechanism"></a>
### 2. 探测原生代理机制

按 §2 查注册目录及格式，以本地可用示例或当前官方文档验证；有网络可调研，用户提供代理时可用。记录格式、frontmatter / 字段名、写入目标。

无自定义代理机制或无法核验，则记录能力缺口 `no_agent_mechanism`，不写代理文件。仅在用户要求持久记录时可写带 `capability_gaps` 的清单。不能猜路径。

完成：注册路径、格式、字段名或明确缺口均记录；未核验机制无写入。

<a id="3-discover-available-models"></a>
### 3. 探测可用模型

按 §3 只读宿主原生配置 / 设置 / 目录，可只读补充目录信息。缺失、空、无法解析则 `no_models_discovered`，不写预设。

完成：模型列表或明确失败已记录；宿主模型 / provider 设置未改。

<a id="4-rank-models-into-four-roles"></a>
### 4. 分配四个角色

按[模型分配](references/ranking.md)：有网络先轻量查相对适配；失败或不可用则本地名称 / 能力启发式。给 implementer、reviewer、runner、explore 各分配模型与默认思考强度。记录来源及 `high` | `medium` | `low`；离线 / 调研失败仍分配，`confidence: low`。

父编排器可在派生时覆盖模型 / 强度；预设只供默认。不在正文硬编码永久赢家。

<a id="5-write-harness-native-agents"></a>
### 5. 写原生代理

按第 2 步已核验位置和格式写入 / 覆盖：pi 为 `~/.pi/agent/agents/` 下 Markdown+frontmatter，codex 为 `~/.codex/agents/` 下 TOML，agy 为已核验的原生目录与格式。以探测结果为准。

| 角色 | 代理名 |
| --- | --- |
| implementer | `rope-implementer` |
| reviewer | `rope-reviewer` |
| runner | `rope-e2e-runner` |
| explore | `rope-explore` |

只碰 rope-* 文件。字段按宿主接受方式写模型 / 强度，如 pi 的 model/thinking、codex 的 model/model_reasoning_effort。正文遵守角色契约与模板，包含输出格式和**禁止嵌套派生**。explore 工具**不限制**，模式纪律在正文，不在预设层禁掉调研工具。重复运行同路径完整覆盖，保持幂等。

完成：四文件存在、可读、格式正确；各自禁止嵌套；未改其他代理。

<a id="6-write-user-global-manifest"></a>
### 6. 写用户全局清单

按[清单格式](references/manifest-schema.md)写 `~/.config/rope/harness/<host>.json`，必要时建父目录。旧清单损坏 / 不完整则完整替换。第 2 步有缺口则加 capability_gaps。

完成：四角色均映射代理名、模型、强度，来源和置信度齐全；host、generated_at、技能身份存在。

<a id="7-report"></a>
### 7. 报告

只返回短报告：宿主及识别方式、置信度、来源摘要、已写代理路径和清单路径、缺口 / 降级，如 research_offline、no_agent_mechanism；发现旧 rope-verify/settings.json 固定配置时提示迁移。

<a id="concurrency"></a>
## 并发

rope-go 可通过宿主机制对不相交前沿派多个 rope-implementer。每角色一个预设、每叶子一个实例，仍是普通叶子，沿用工具边界、输出和禁止嵌套规则。无需改 schema，父编排器仍可逐叶子覆盖模型 / 强度。

<a id="explore-research-mode--declared-dispatch-deviation"></a>
## 调研模式与派发偏离声明

- **调研是 rope-explore 的模式**，由简报声明；可 web/search 并只写 `.rope/research/**` 一份结论，默认及扫描只读。预设不限制工具，无需为调研偏离。无第五个代理；runner 是明确的第四角色，排名其余流程不变。
- **声明偏离：**派生 type 或 model 与预设不同，派发记录必须用一句话说明预设缺少什么能力。未声明偏离是派发缺陷。
- 规划窗口模型选择靠测量，不靠猜测，见[退回率回放](references/bounce-rate-replay.md)。

<a id="soft-degrade-contract-for-consumers"></a>
## 使用方软降级

清单或 rope-* 代理缺失时，rope-go / rope-finish 用通用宿主叶子，记录 `preset_missing` 后继续；不硬阻塞、不自动刷新。capability_gaps 也是此路径的信息，不是失败。

<a id="guardrails"></a>
## 护栏

- 仅手动刷新，不设 TTL / 自动刷新。
- 不写逐宿主生成分支；特有细节留在探测线索及 pi 示例，新宿主运行时探测。
- 不改宿主模型范围或 provider 设置，不删除非 rope-* 代理。
- 默认不写项目级代理目录，如 `.agents/agents/`；探测一个宿主不能写另一个宿主路径。
