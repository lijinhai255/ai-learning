# 工程化架构规范（Engineering Architecture）

> 本文件是从妙码协同文档（miaoma-docs）抽取的工程化架构规则，是 `AGENTS.md`「工程化架构总览」的详细展开。

## 1. Monorepo 基础

- 工具链：pnpm workspace + Turborepo（turbo 2.2.3）
- 包管理器固定：`packageManager = "pnpm@9.12.3"`
- 工作区声明（`pnpm-workspace.yaml`）：

```yaml
packages:
  - "packages/*"
  - "apps/frontend/*"
  - "apps/backend/*"
```

- 根级任务统一由 turbo 调度：`build`、`dev`、`typecheck`、`build:watch`

## 2. 模块拓扑

| 路径 | 包名 | 职责 | 关键技术 |
| --- | --- | --- | --- |
| `apps/frontend/web` | `@miaoma-doc/web` | 前端 SPA（编辑器应用） | React 18、Vite 5、React Router 6、TanStack Query、axios、Yjs |
| `apps/frontend/desktop` | `@miaoma-doc/desktop` | Tauri 2 桌面封装 | `@tauri-apps/*` |
| `apps/backend/server` | `@miaoma-doc/server` | NestJS 服务端 | NestJS 10、TypeORM、PostgreSQL、JWT、Bull、Yjs |
| `apps/backend/y-websocket-server-demo` | - | Yjs 协同 WebSocket 演示 | y-websocket |
| `packages/core` | `@miaoma-doc/core` | 平台无关编辑器核心 | Tiptap、ProseMirror、Yjs、unified/rehype |
| `packages/react` | `@miaoma-doc/react` | React 渲染层 | React、core |
| `packages/shadcn` | `@miaoma-doc/shadcn` | 编辑器专用 shadcn 组件 | shadcn |
| `packages/shadcn-shared-ui` | `@miaoma-doc/shadcn-shared-ui` | 共享 UI 组件 | shadcn |

## 3. 技术栈基线

- 前端：React 18.3、Vite 5、react-router-dom 6.28、@tanstack/react-query 5、axios、react-hook-form 7
- 后端：NestJS 10、TypeORM 0.3 + pg、passport-jwt/local + bcryptjs、@nestjs/swagger 7、Bull + nodemailer、class-validator/class-transformer、zod
- 协同：Yjs 13、y-prosemirror、y-websocket、y-postgresql、@nestjs/platform-ws
- 桌面：Tauri 2
- 构建与语言：TypeScript 5.6、tsup 8、Turbo 2.2、ESLint 9、Prettier 3、pnpm 9

## 4. 依赖管理规则

- 库包间依赖一律使用 `workspace:*`，由 pnpm workspace 内部链接
- 关键依赖采用精确版本锁定，避免依赖漂移
- 库包（如 `@miaoma-doc/core`）声明 `sideEffects: ["*.css"]`，保证样式可被正确摇树

## 5. 构建与运行命令

| 命令 | 行为 |
| --- | --- |
| `pnpm dev` | turbo 并行启动所有 dev 任务 |
| `pnpm build` | turbo 按依赖拓扑构建 |
| `pnpm typecheck` | turbo 全量类型检查 |
| `pnpm dev:server` | 单独启动 NestJS 服务（watch） |
| `pnpm dev:desktop` | 启动 Tauri 桌面端 |
| `pnpm lint` | 根级 ESLint |
| `pnpm spellcheck` | CSpell 拼写检查 |
| `pnpm commit` | git-cz 交互式提交 |
| `pnpm docker:start` / `docker:stop` | 本地 PostgreSQL 编排 |

## 6. 部署架构

- 数据库：`postgres`（官方镜像），容器 `miaoma-docs-postgresql`，宿主机端口 `5433 -> 5432`
- 服务端：`node`（官方镜像）容器，端口 `8082`，`NODE_ENV=production`，启动命令 `node dist/main.js`
- 网络：`miaoma-docs-network`（bridge）
- 关键约定：数据库与日志时区必须为 `Asia/Shanghai`，否则写入时间相较北京时间少 8 小时
