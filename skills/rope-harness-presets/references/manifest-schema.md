<a id="rope-harness-manifest-schema"></a>
# Rope 宿主清单格式

<a id="location"></a>
## 位置

仅用户全局：`~/.config/rope/harness/<host>.json`。例如 `~/.config/rope/harness/pi.json`、`~/.config/rope/harness/codex.json`，其他如 agy 同样按宿主 ID 命名；host 必须来自探测，不能猜。不是项目 `.rope/`、技能本地设置或第二套提示数据库。

<a id="shape"></a>
## 结构

```json
{
  "host": "pi",
  "generated_at": "2026-07-16T12:00:00Z",
  "skill": "rope-harness-presets",
  "confidence": "low",
  "sources": [
    "从 ~/.codex/agents/*.toml 本地示例核验代理注册",
    "enabledModels 来自 ~/.pi/agent/settings.json",
    "离线启发式"
  ],
  "capability_gaps": [
    "宿主不能派生固定模型子代理，报告为继承设置"
  ],
  "roles": {
    "implementer": {
      "agent": "rope-implementer",
      "model": "provider/modelId",
      "thinking": "medium",
      "backup_model": "provider/backupModelId",
      "backup_thinking": "medium",
      "path": "~/.pi/agent/agents/rope-implementer.md"
    },
    "reviewer": {
      "agent": "rope-reviewer",
      "model": "provider/modelId",
      "thinking": "high",
      "path": "~/.pi/agent/agents/rope-reviewer.md"
    },
    "runner": {
      "agent": "rope-e2e-runner",
      "model": "provider/modelId",
      "thinking": "low",
      "path": "~/.pi/agent/agents/rope-e2e-runner.md"
    },
    "explore": {
      "agent": "rope-explore",
      "model": "provider/modelId",
      "thinking": "low",
      "path": "~/.pi/agent/agents/rope-explore.md"
    }
  }
}
```

<a id="field-rules"></a>
## 字段规则

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| host | 是 | 探测出的宿主 ID |
| generated_at | 是 | ISO-8601 UTC |
| skill | 是 | 固定 rope-harness-presets |
| confidence | 是 | high / medium / low |
| sources | 是 | 非空字符串数组，说明排名依据 |
| roles | 是 | 含 implementer/reviewer/runner/explore 四键 |
| roles.*.agent | 是 | 精确 Rope 代理名 |
| roles.*.model | 是 | 与代理 frontmatter 一致的宿主模型 ID |
| roles.*.thinking | 是 | 宿主思考 / 推理强度 |
| roles.*.path | 是 | 原生代理文件绝对或 ~/ 路径，codex 如 .toml |
| roles.*.backup_model | 否 | 配额 / 限流时备用模型 |
| roles.*.backup_thinking | 否 | 备用推理强度 |
| capability_gaps | 否 | 探测出缺口才写；使用方视为信息，不是失败 |

<a id="write-policy"></a>
## 写入策略

- 缺父目录则创建。
- 每次成功完整覆盖，保持幂等；损坏 / 部分旧内容不合并。
- 代理写入中途失败则不写清单，报告尝试路径和部分失败。
- 仅含 capability_gaps、无 roles 的清单，只能在用户明确要求保存 no_agent_mechanism 时写；使用方按缺清单处理，preset_missing 软降级。

<a id="soft-degrade-contract-consumers"></a>
## 使用方软降级

使用方包括 `rope-go` 和 `rope-finish`。

1. 清单存在且映射角色，优先指定 rope-* 代理及默认模型 / 强度。
2. 缺失、不可读、仅缺口无角色时，记录 preset_missing，用不强制模型的通用叶子继续；不硬阻塞、不自动运行本技能。能力缺口同样记录并继续。
3. 叶子遇配额 / 限流且有 backup_model，使用备用模型及可选 backup_thinking 重派，记录 `[degraded: switched to <backup_model> (quota)]`，会话后续同角色持续沿用降级。
