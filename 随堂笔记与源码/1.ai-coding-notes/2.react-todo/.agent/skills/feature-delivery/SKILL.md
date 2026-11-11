# Feature Delivery Skill

## 适用场景

当一个需求需要跨 React/Vue/NestJS 或包含多个质量门禁时，使用本 Skill 统一执行从需求到验收的流程。

## 输入

- 一份完成的 `docs/requirements/feature-template.md`。
- 影响范围、非目标、接口契约和验收条件。
- 目标 worktree、端口和测试数据策略。

## 步骤

1. 阅读 `AGENTS.md` 和对应 `.agent/rules/*.md`，确认文件边界。
2. 将验收条件映射到 Vitest 和 Playwright 用例，先写测试。
3. 按依赖顺序实现领域规则、NestJS 契约、React/Vue 适配层。
4. 在受影响包运行 `pnpm lint`、`pnpm typecheck`、`pnpm test:unit`，再运行根目录 `pnpm verify`。
5. 执行 `pnpm test:e2e`，保存失败时的 trace、截图和最小复现。
6. 更新规则、ADR 或 MCP 契约中已经稳定的经验，并填写验收记录。

## 输出

- 变更摘要和文件清单。
- 验收矩阵与命令结果。
- 已知风险、未覆盖场景和后续事项。

## 失败处理

硬门禁失败时停止交付，保留日志并先修复最小问题。外部系统不可用时，使用隔离 fixture 复现边界，同时在验收记录中标记阻塞原因。

## 验证命令

```bash
pnpm verify
pnpm test:e2e
```
