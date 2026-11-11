# 研发质量门禁

本仓库采用“需求拆解 → 测试先行 → 实现 → 自动验收”的闭环。每个特性在合并前都应留下可重复运行的单元测试和用户路径验收测试。

## 流程

1. **需求拆解**：将用户故事拆成可验证的行为（输入、状态变化、输出和错误态），为每个行为写验收条件。
2. **测试先行**：先在领域层或功能边界编写 Vitest 用例；跨页面、路由和真实浏览器行为则编写 Playwright 用例。测试名称描述用户可见行为，不绑定组件内部实现。
3. **最小实现**：实现能让测试通过的最小代码，保持领域规则与 React/Vue/NestJS 适配层分离。
4. **自动验收**：本地与 CI 按相同命令执行格式、类型、拼写、单测、构建和浏览器验收；失败时保留 Playwright trace 及测试报告。

## 命令

```bash
pnpm install
pnpm test:unit
pnpm build
pnpm lint
pnpm spellcheck
pnpm verify:all
```

浏览器验收会由 Playwright 配置自动构建并启动 React 预览服务器，直接运行：

```bash
pnpm test:e2e
```

如需复用已经运行的服务，可设置 `BASE_URL`；测试基于语义角色定位页面元素，应用至少应提供一个 `<main>` 地标。

## 测试分层约定

- `packages/*/src/**/*.test.ts(x)`：纯函数、领域规则和组件行为的 Vitest 单测。
- `tests/e2e/tests/*.spec.ts`：跨页面流程的 Playwright 集成测试。
- 领域测试不得依赖浏览器或网络；集成测试只通过公开 UI/API 契约交互。
- 每个缺陷先添加回归测试，再修改实现。

## 自主验收清单

- [ ] 需求中的每条验收条件都有测试映射。
- [ ] Vitest 单测覆盖成功、边界和错误路径。
- [ ] Playwright 覆盖至少一条核心用户流程。
- [ ] `pnpm build`、`pnpm lint` 和 `pnpm spellcheck` 通过。
- [ ] 测试输出、trace 和报告未被提交到版本库。
