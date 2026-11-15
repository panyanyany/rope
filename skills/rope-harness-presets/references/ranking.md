<a id="ranking-procedure"></a>
# 模型分配流程

这是将发现模型映射到叶子角色的唯一流程来源。正文硬编码模型列表不能当永久事实。

<a id="inputs"></a>
## 输入

- `models[]`：发现的 provider/modelId。
- 可选 models.json 能力提示。
- 用户已说明的限制，如优先本地或排除 provider。

**目录完整性：**对完整 enabledModels 排序，不只保留熟悉的 GPT/DeepSeek/flash。用户默认会话模型及 glm/grok 等标识也留池中，直到分配使用或附理由跳过。同族跨 provider 别名去重，优先用户默认 provider。

<a id="steps"></a>
## 步骤

<a id="1-research-when-available"></a>
### 1. 有条件则调研

web/docs 可用时，只对**当前发现模型**简查编码、成本 / 速度、推理相对能力，清单 sources 记录具体 URL / 文档路径。限定时间，尽力而为，不因追求完美数据阻塞。

<a id="2-offline--research-fail-heuristics"></a>
### 2. 离线或调研失败启发式

按模型 ID 中不区分大小写的**名称及已知类别信号**排名，仍产出三个核心角色分配，记 `confidence: low`，sources 加 `offline heuristics`。

| ID 信号 | 偏向 |
| --- | --- |
| flash/mini/haiku/lite/small/fast/nano/luna | 优先 explore，无其他选择时低成本 implementer |
| sonnet、非 max 的 pro、无 max/opus 的中档 | implementer |
| opus/max/ultrathink/sol/terra/o1/o3、高档 gpt-5、reason | reviewer |
| codex/code/composer/coder/devstral/qwen-coder | implementer |
| deepseek + pro | 较强中档，实现或审查 |
| deepseek + flash | 探索或低成本实现 |
| 无 flash/lite 的 glm/grok（如 `grok-4.5`） | 通用中强档，按剩余池选实现或审查 |

<a id="3-role-assignment-algorithm"></a>
### 3. 角色分配算法

从可变模型池选择；同模型跨 provider 重复时按 enabledModels 顺序 / 用户默认 provider 打破平局。

1. **explore：**最廉价 / 最快信号，默认 thinking medium；low 容易在调研简报空返回，履行简报契约需要阅读空间。
2. **reviewer：**剩余最强判断信号，默认 high。
3. **implementer：**剩余最适合编码的中强模型，通常整体第二强；只有一个强模型可复用 reviewer，默认 medium。

少于三个模型可复用，尽量不同。只有一个则三个核心角色共用，但沿用各自默认强度。

<a id="4-confidence"></a>
### 4. 置信度

| 情况 | confidence |
| --- | --- |
| 调研充分且 ≥3 模型层级明确 | high |
| 部分调研或层级信号温和 | medium |
| 仅离线启发式或单模型复用 | low |

<a id="5-parent-override-reminder"></a>
### 5. 提醒父编排器可覆盖

在运行报告说明，不逐代理重复：派生时可覆盖 model/thinking，省略时用 frontmatter 默认。

<a id="fixture-empty-models"></a>
## 用例：空模型

输入 `enabledModels: []`，预期 `no_models_discovered`，不写文件。

<a id="fixture-offline-ranking-sketch"></a>
## 用例：离线分配示意

输入 vendor/alpha-flash、vendor/beta-pro、vendor/gamma-max。

| 角色 | 模型 | thinking |
| --- | --- | --- |
| explore | vendor/alpha-flash | low |
| implementer | vendor/beta-pro | medium |
| reviewer | vendor/gamma-max | high |

confidence 为 low，sources 包含离线启发式。
