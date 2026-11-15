<a id="rope-specs"></a>
# Rope 规范

稳定实现契约与项目编码规则。

<a id="areas"></a>
## 区域

- [中文文档内容设计](guides/content-design.md)：任务优先、清晰表达、术语一致和协议兼容要求。
- `guides/`：通用思考与验证指南；architecture-continuity.md 规定决策交接和证据。
- `<area>/`：分领域实现契约。
- `review-cost-optimization.md`：结束审查成本，双只读叶子、简报预算、diff 清理、仅阻塞修复及差量复审。
- `plan-artifact-reader-layering.md`：读者分层，Contract Note、最小简报允许清单与行数、未决问题策略。

<a id="usage"></a>
## 用法

改代码前读相关规范。修复缺陷或发现可复用契约后，更新最小相关规范。
