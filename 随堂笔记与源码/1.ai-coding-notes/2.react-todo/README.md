# React + Vue + 多语言服务端 Todo 基线

这是一个以 `pnpm` workspace 为边界的全栈 Todo 基线工程，目标是把“需求拆解、测试先行、实现、自动验收、知识沉淀”变成可重复执行的研发流程。

## 工程布局

```text
apps/web-react/       React + Vite 前端
apps/web-vue/         Vue + Vite 前端
apps/api-nest/        NestJS CLI 风格服务端，/health 提供健康检查
apps/api-spring/      Spring Boot Todo API，默认端口 3001
apps/api-fastapi/     FastAPI Todo API，默认端口 3002
packages/domain/      与框架无关的领域规则和 Vitest 单测
packages/config/      TypeScript、ESLint、Vitest、Playwright、CSpell 共享配置
tests/e2e/            Playwright 浏览器验收
.agent/rules/          按主题拆分的规则，由 AGENTS.md 统一索引
.agent/skills/         可复用研发流程 Skill
.agent/mcp/            MCP 能力契约与接入边界
docs/                  质量门禁、ADR 和需求模板
```

## 开发入口

```bash
pnpm install
pnpm dev:react       # http://127.0.0.1:5173
pnpm dev:vue         # http://127.0.0.1:5174
pnpm dev:api         # http://127.0.0.1:3000/health
```

多语言服务端独立启动：

```bash
# 终端 1
cd apps/api-spring && mvn spring-boot:run
# 终端 2
cd apps/api-fastapi && python -m pip install -r requirements.txt && python -m app.main
```

两套服务都实现 `GET /health`、`GET/POST /todos`、`PATCH /todos/{id}/toggle` 和 `DELETE /todos/{id}`，行为契约见 [`docs/requirements/todo-polyglot-services.md`](docs/requirements/todo-polyglot-services.md)。

全流程质量门禁：

```bash
pnpm verify          # lint、类型、拼写、Vitest、构建
pnpm test:e2e        # Playwright 会自动构建并启动 React preview
pnpm verify:all      # 在已安装浏览器时执行完整静态、单测、构建和 E2E 门禁
```

Playwright 浏览器首次使用时执行 `pnpm exec playwright install chromium`。测试报告、trace、构建产物均被 `.gitignore` 排除。

## AI 研发流程

1. 从 [`docs/requirements/feature-template.md`](docs/requirements/feature-template.md) 写出范围、验收条件和验收矩阵。
2. 先在领域包或功能边界补 Vitest，再补 Playwright 关键旅程。
3. 依据 [`AGENTS.md`](AGENTS.md) 加载 `.agent/rules/` 中的专题规则，实现最小变更。
4. 多特性并行时按 [Worktree 规则](.agent/rules/06-worktree.md) 隔离工作区；多智能体按 [协作协议](.agent/rules/07-multi-agent.md) 领取边界。
5. 重复出现的流程沉淀为 [Skill](.agent/skills/feature-delivery/SKILL.md)，需要外部工具时先定义 [MCP 契约](.agent/mcp/README.md)。
6. 用 `pnpm verify` 和 `pnpm test:e2e` 留下可重复的验收证据。

## 当前边界

当前示例聚焦 Todo 的添加、完成和删除，以及 NestJS、Spring Boot、FastAPI 健康检查；三套服务均使用进程内存储。持久化、鉴权和生产部署属于后续特性，进入前应先补契约、ADR 和测试。
