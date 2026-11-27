# 人工确认与内部规划的边界

## Question

哪些工程安排应由执行者维护，哪些变化需要人工决定？

## Verified Facts

### 风险分层与自动验证

Fact: DORA 建议同行审查结合自动测试、持续集成和监控，并指出将所有变化使用同一审批流程、遇到问题就增加流程是常见误区。未发现正式外部审批与较低变更失败率相关的证据。
Source: https://dora.dev/capabilities/streamlining-change-approval/
Verified by: 本会话前一轮通过网页搜索读取官方正文。
Stability: high
Implication: 不将普通本地文档提交与破坏性、生产操作设置为同一审批等级。

### 执行者维护任务

Fact: Basecamp Shape Up 在确定项目边界后，将任务发现、拆分及实施方法交给执行团队。
Source: https://basecamp.com/shapeup/3.1-chapter-10
Verified by: 本会话前一轮通过网页打开读取官方正文。
Stability: high
Implication: 复用内部任务和依赖记录，不要求用户批准每项编排细节。人工团队经验不直接证明代理可靠性，仍需现有验证体系。

### 代理反馈与停止条件

Fact: Anthropic 建议从简单机制开始，仅在改善结果时增加复杂度；任务明确后，代理可以自主规划与执行，通过环境反馈检查进展，并在检查点或阻塞时请求人工输入，设置停止条件。
Source: https://www.anthropic.com/research/building-effective-agents
Verified by: 本会话前一轮通过网页打开读取官方正文。
Stability: medium
Implication: 减少审批时保留测试、审查、真实入口验收和停止线。该文发布于 2024 年，作为设计原则依据，不作为当前工具能力证明。

## Assumptions

- 更少且更具体的确认可改善本用户的决策参与；需要通过后续使用反馈核验。

## Open Questions

- 后续观察是否仍出现重复确认，或代理将未授权动作误判为已授权。
