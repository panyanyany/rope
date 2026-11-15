<a id="pi-adapter-worked-example"></a>
# pi 适配示例

本文件展示 pi 完整探测 / 写入周期。新宿主不增加类似专用文件，而按[宿主探测](host-discovery.md)在运行时发现。此处用于了解经过核验的端到端流程。

<a id="discovery-read-only"></a>
## 探测（只读）

| 来源 | 路径 | 用途 |
| --- | --- | --- |
| 主模型目录 | `~/.pi/agent/settings.json` → `enabledModels` | 必需的 provider/modelId 列表 |
| 可选补充 | `~/.pi/agent/models.json` | 名称、推理标记、思考级别映射 |
| 项目覆盖说明 | `<cwd>/.pi/settings.json` | 也可声明 enabledModels；并存时优先合并语义。除非用户要求项目范围，**默认来源是用户全局设置** |

<a id="parse-rules"></a>
### 解析规则

1. 将 settings.json 按 JSON 加载。
2. 按字符串数组读取 enabledModels。
3. 规范为 provider/modelId，pi 已是此格式。
4. 文件缺失、JSON 无效、enabledModels 缺失或空数组，返回 **no_models_discovered** 并停止，不写代理或清单。
5. 可通过 models.json 的 providers.*.models[] 补充显示名、reasoning 和支持的思考级别；失败不致命。

<a id="forbidden-mutations"></a>
### 禁止修改

- 不改 settings.json、enabledModels、models.json。
- 不删除代理目录中的非 rope-* 文件。

<a id="write-targets"></a>
## 写入目标

| 产物 | 路径 |
| --- | --- |
| 代理 | `~/.pi/agent/agents/rope-implementer.md` 及其余三个同级代理文件 |
| 清单 | `~/.config/rope/harness/pi.json` |

按需创建 agents/、~/.config/rope/harness/ 父目录。

<a id="frontmatter-fields-pi-subagents-accepts"></a>
## pi-subagents 接受的 frontmatter 字段

Rope 预设最少需要：

```yaml
description: ...
display_name: ...
tools: ...
model: provider/modelId
thinking: low|medium|high|...
prompt_mode: replace
```

父编排器未覆盖时，该类型以 frontmatter 的 model 和 thinking 为准。

<a id="error-classes-observable"></a>
## 可观察错误类别

| 类别 | 条件 | 行为 |
| --- | --- | --- |
| `no_models_discovered` | 目录空或缺失 | 停止，不写入 |
| `host_unidentified` / `no_agent_mechanism` | 见宿主探测 §1/§2 | 按探测规则，不写 pi 路径 |
| `research_offline` | 网络 / 文档调研失败 | 继续启发式，confidence: low |
| `partial_write` | 代理或清单写入中途失败 | 报告尝试路径，不声称完整成功 |

<a id="non-pi-hosts-pointer"></a>
## 非 pi 宿主

非 pi 按目标宿主的探测 §1–§7。不能在非 pi 运行中写 pi 路径，也不能为任何宿主编造代理路径。

<a id="optional-migrate-hint"></a>
## 可选迁移提示

若旧 skills/rope-verify/settings.json 或安装副本仍有 review.subagent 固定配置，提示一次：

> 检测到旧 rope-verify 本地固定配置。本技能预设已替代该渠道；确认 rope-* 代理可用后可删除旧 settings.json。

不能自动删除。
