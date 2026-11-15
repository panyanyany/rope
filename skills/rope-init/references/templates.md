<a id="rope-init-templates"></a>
# Rope Init 初始化模板

## `.rope/GLOSSARY.md`

```md
# Glossary

本仓库特有的领域语言。这里只保留唯一的一套 Rope 术语及简短定义；实现契约写入 `.rope/specs/`。

## Language

<!-- 在这里添加已确定项目术语。

**<术语>**:
用一两句话定义。
_Avoid_: <歧义同义词>
-->
```

## `.rope/routes.md`

```md
# Routes

供代理在本仓库定位的导航图，保持精简且有证据。

## Repo Shape

- Source roots:
- Test roots:
- Build/test commands:

## Common Work Routes

### <区域或流程>

Read first:
- `<路径>`

Verify with:
- `<命令>`

Notes:
- <稳定导航说明>
```

## `.rope/specs/index.md`

```md
# Rope Specs

稳定实现契约和项目编码规则。

## Areas

- `guides/` - 通用思考与验证指南。
- `<area>/` - 分领域实现契约。

## Usage

改代码前读目标区域相关规范。修复缺陷或发现可复用契约后，更新最小相关规范。
```

<a id="agent-doc-block"></a>
## 代理指令区块

```md
## Rope

本仓库使用 `.rope/` 作为本地代理知识层。

开展 shape 或实现前：
- 读取 `.rope/GLOSSARY.md` 了解项目语言；rope-clear 迁移前读取旧 `.rope/CONTEXT.md`。
- 读取 `.rope/routes.md` 了解导航。
- 改代码前读取相关 `.rope/specs/`。
- 改架构前读取相关 `.rope/adr/`。
- 外部或平台事实读取引用的 `.rope/research/`。
- 需要代码上下文时，先读相关 `.rope/specs/` / `.rope/adr/` / `.rope/research/`，不要只靠文件名或 grep 结果推断架构。
- 完成代码变更后，若沉淀出可复用架构规则、adapter 契约、配置契约、部署约束或踩坑修复，更新最小相关 `.rope/specs/` / `.rope/adr/` / `.rope/research/` 后再收尾。
- 除非用户另有要求，本地工作记在 `.rope/issues/`。
```
