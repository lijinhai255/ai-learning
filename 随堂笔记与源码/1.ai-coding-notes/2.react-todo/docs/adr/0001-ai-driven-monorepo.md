# ADR-0001：采用 pnpm 多应用 monorepo 作为 AI 研发基线

## 背景

项目需要同时维护 React、Vue 和 NestJS，并让规则、测试、Worktree 与多智能体协作可以被重复执行和审计。单应用仓库会复制配置，纯文档约束又容易与脚本漂移。

## 决策

采用 `pnpm-workspace.yaml` 管理 `apps/*`、`packages/*` 和 `tests/e2e`。跨包规则收敛到 `packages/config`，人和智能体共同读取顶层 `AGENTS.md` 与 `.agent/rules/`。质量入口统一为根脚本，浏览器验收由 Playwright 的 `webServer` 自动启动 React preview。

## 影响

- React、Vue、NestJS 可独立开发，也能共享领域包和质量配置。
- 特性并行通过 Git worktree 隔离；多智能体按文件边界协作。
- 锁文件和共享配置是基础设施边界，冲突需要重新运行全量门禁。
- 当前不包含数据库、鉴权和生产部署，相关需求需新增契约与 ADR。

## 复盘条件

当包数量、构建时长或发布边界明显增长时，重新评估任务编排、缓存和发布拓扑，不提前引入未被需求驱动的复杂平台。
