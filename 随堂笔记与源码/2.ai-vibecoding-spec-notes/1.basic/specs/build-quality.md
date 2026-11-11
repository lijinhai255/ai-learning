# 构建与质量门禁（Build & Quality Gates）

> 本文件是从妙码协同文档（miaoma-docs）抽取的构建、部署与质量保障规则。

## 1. 根级脚本

| 命令 | 行为 |
| --- | --- |
| `pnpm dev` / `pnpm build` | turbo 并行 dev / 按依赖拓扑构建 |
| `pnpm build:watch` | turbo watch 构建 |
| `pnpm typecheck` | 全量类型检查 |
| `pnpm lint` | 根级 ESLint |
| `pnpm spellcheck` | CSpell 拼写检查 |
| `pnpm commit` | git-cz 交互式提交 |
| `pnpm clean` / `clean:all` | 清理构建产物 / 缓存 / 依赖 |

## 2. Turbo 任务约定（`turbo.json`）

- `build`：`dependsOn: ["^build"]`，先构建依赖再构建自身
- `dev` / `typecheck` / `build:watch`：`cache: false`、`persistent: true`
- 缓存目录：`.turbo/cache`

## 3. 库构建约定（tsup）

以 `packages/core` 为例（`tsup.config.ts`）：

- 入口 `src/index.ts`，输出 `build/esm/`
- `format: ["esm"]`、`dts: true`、`sourcemap: true`、`minify: true`、`bundle: true`、`clean: true`
- watch 时忽略 `**/*.md`

## 4. 质量门禁（提交前必须全部通过）

1. lint-staged：格式化 + ESLint 自动修复
2. `pnpm spellcheck`：CSpell 拼写检查
3. `pnpm typecheck`：turbo 全量类型检查

## 5. Docker 编排

本地开发（`.devcontainer/docker-compose.yml`）：

- 服务 `miaoma-docs-postgresql`（`postgres`，官方镜像），端口 `5433 -> 5432`
- 环境变量：`POSTGRES_HOST_AUTH_METHOD=trust`、`POSTGRES_DB=postgres`
- 时区：`TZ=Asia/Shanghai`，数据库参数 `timezone=Asia/Shanghai`、`log_timezone=Asia/Shanghai`
- 数据卷：`./postgresql_data:/var/lib/postgresql/data`

部署（`.devcontainer/docker-compose.deploy.yml`）：

- 服务 `miaoma-docs-server`（`node`，官方镜像），端口 `8082`
- `NODE_ENV=production`，工作目录 `apps/backend/server`，命令 `node dist/main.js`
- `depends_on: miaoma-docs-postgresql`

## 6. 服务端运行约定

- 服务端口 `8082`，全局路由前缀 `api`
- Swagger 文档地址 `/doc`（Bearer 认证）
- WebSocket 使用 `@nestjs/platform-ws`
- 生产部署：`pnpm build` 后由 pm2 / docker 托管 `dist/main.js`
