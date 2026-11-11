# 分层与目录规则（Layering）

> 本文件定义从妙码协同文档（miaoma-docs）抽取的前端、后端与库包分层规则。

## 1. 前端分层（`apps/frontend/web/src`）

| 目录 | 职责 | 规则 |
| --- | --- | --- |
| `blocks/` | 块级业务组件 | 按块类型拆分，如 `ai/`、`mention/` |
| `components/` | 通用业务组件 | 单一职责，按功能命名，如 `BasicAIChat`、`SharePopover` |
| `hooks/` | 自定义 hooks | 逻辑复用，禁止在组件内堆积业务逻辑 |
| `layout/` | 布局组件 | 页面骨架 |
| `pages/` | 页面级组件 | 一个页面一个目录，如 `pages/Doc`、`pages/Account` |
| `router/` | 路由与鉴权 | 路由集中定义，受保护路由走 `AuthRoute` |
| `services/` | API 请求层 | 按资源拆分，如 `page.ts`、`user.ts` |
| `types/` | 类型定义 | 与后端 API 对齐，如 `api.ts`、`page.ts` |
| `utils/` | 工具函数 | 纯函数，无副作用 |
| `views/` | 视图组合 | 页面内多视图编排 |

分层约束：

- 页面组件不直接发起 API 请求，统一经由 `services/` 层
- 接口类型集中在 `types/`，禁止散落于组件内
- 业务逻辑优先下沉到 `hooks/`，保持组件轻量

## 2. 后端分层（`apps/backend/server/src`）

| 目录 | 职责 |
| --- | --- |
| `config/` | 全局配置 |
| `entities/` | TypeORM 实体 |
| `fundamentals/` | 基础设施：`common/`（过滤器等公共能力）、`jobs/`（Bull 队列）、`tasks/`（定时任务）、`yjs-postgresql/`（协同持久化） |
| `modules/` | 业务模块：`application/`、`auth/`、`doc-yjs/`、`page/`、`user/`、`ws-demo/` |
| `pipes/` | 管道（参数校验/转换） |
| `utils/` | 工具函数 |

NestJS 模块模式（以 `modules/auth/` 为例）：

- 每模块由 `*.module.ts` + `*.controller.ts` + `*.service.ts` 组成
- 按需补充 `*.strategy.ts`、`*.pipe.ts`、`constants.ts`
- 模块间通过模块导入协作，禁止跨模块直接引用内部实现

服务端全局约定：

- 全局路由前缀 `api`（`app.setGlobalPrefix('api')`）
- Swagger 文档挂在 `/doc`，开启 Bearer 认证
- WebSocket 使用 `@nestjs/platform-ws`（`WsAdapter`），非默认 socket.io
- 全局异常处理统一走 `HttpExceptionFilter`
- 服务端口 `8082`

## 3. 库包分层（以 `packages/core/src` 为例）

| 目录 | 职责 |
| --- | --- |
| `api/` | 对外命令 API：`blockManipulation/`（块操作命令）、`clipboard/`、`exporters/`、`parsers/` |
| `blocks/` | 块实现 |
| `editor/` | 编辑器装配 |
| `extensions/` | Tiptap 扩展 |
| `extensions-shared/` | 共享扩展 |
| `pm-nodes/` | ProseMirror 节点 |
| `schema/` | 文档 schema |
| `util/` | 工具函数 |
| `i18n/` | 国际化资源 |
| `index.ts` | 唯一对外入口 |

库包约束：

- 通过 `src/index.ts` 单一入口导出，构建产物由 tsup 生成（ESM + dts）
- 样式独立于代码（`style.css`），消费方按需引入
- `packages/react` 仅做 React 渲染层，不承载编辑器核心逻辑
- UI 组件按层拆分：`shadcn/`（编辑器专用）与 `shadcn-shared-ui/`（跨端共享）

## 4. 命名约定

- 组件文件与组件名：PascalCase（如 `AuthRoute.tsx`）
- 变量、函数、目录（业务域）：camelCase / 小写连字符（如 `doc-yjs`、`page.ts`）
- 页面目录：PascalCase 单数（如 `pages/Doc`）
