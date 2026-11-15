<a id="discovery-fixtures-and-agent-run-checklist"></a>
# 探测用例与执行清单

纯 Markdown 技能；实现或核验探测流程时执行以下检查，不修改宿主。

<a id="fixture-a--sample-model-inventory-parse"></a>
## 用例 A：解析模型目录示例

输入格式，pi `~/.pi/agent/settings.json` 摘录：

```json
{
  "enabledModels": [
    "vendor/alpha-flash",
    "vendor/beta-pro",
    "vendor/gamma-max"
  ]
}
```

预期探测结果：

```text
models = [
  "vendor/alpha-flash",
  "vendor/beta-pro",
  "vendor/gamma-max"
]
error = null
```

非 pi 对原生模型来源采用同样纪律，如 codex config.toml 与 models[]。

<a id="fixture-b--empty-list--fail"></a>
## 用例 B：空列表失败

```json
{
  "enabledModels": []
}
```

预期：

```text
error = no_models_discovered
writes = none
```

目录缺失或不可解析同样处理。

<a id="fixture-c--host-has-no-discoverable-agent-mechanism--capability-gap"></a>
## 用例 C：没有可发现代理机制，记录缺口

前提：宿主已识别，如 some-host，但按探测 §2 无法定位或核验注册机制。

预期：

```text
error = no_agent_mechanism
host = some-host
agent_writes = none
capability_gap_recorded = yes
manifest = absent, unless the user asked to persist the gap
```

禁止：

- 创建另一宿主 `rope-*` 代理代替
- 写 `~/.config/rope/harness/<host>.json` 并声称代理已写入
- 从相似宿主猜格式

<a id="fixture-d--host-unidentifiable--stop"></a>
## 用例 D：无法识别宿主即停止

前提：无自述、用户指定宿主、配置特征。

预期：

```text
error = host_unidentified
candidates = <已探测内容和证据>
writes = none
```

<a id="agent-run-checklist"></a>
## 执行清单

- [ ] 已识别宿主后读取真实目录并列模型
- [ ] 用 B 模拟空目录，确认停止
- [ ] 用 C 模拟无机制，确认报告缺口且无写入
- [ ] 用 D 模拟未知宿主，确认带候选停止
- [ ] 确认不要求修改任意宿主模型 / provider 设置
