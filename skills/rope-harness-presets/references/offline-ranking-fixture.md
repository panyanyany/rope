<a id="offline-ranking-fixture-e3"></a>
# 离线模型分配用例（E3）

模拟调研失败：无网络来源，只用启发式。

<a id="input"></a>
## 输入

```text
enabledModels:
  - vendor/alpha-flash
  - vendor/beta-pro
  - vendor/gamma-max
```

调研：强制失败或不可用。

<a id="expected-ranking-decision-record"></a>
## 预期分配记录

```json
{
  "host": "pi",
  "confidence": "low",
  "sources": [
    "enabledModels from ~/.pi/agent/settings.json",
    "offline heuristics"
  ],
  "roles": {
    "explore": {
      "agent": "rope-explore",
      "model": "vendor/alpha-flash",
      "thinking": "low"
    },
    "implementer": {
      "agent": "rope-implementer",
      "model": "vendor/beta-pro",
      "thinking": "medium"
    },
    "reviewer": {
      "agent": "rope-reviewer",
      "model": "vendor/gamma-max",
      "thinking": "high"
    }
  }
}
```

<a id="pass-criteria"></a>
## 通过标准

- 仍产出完整三个核心角色分配
- confidence 为 low
- sources 含离线启发式
- 不因缺网络调研而硬失败
