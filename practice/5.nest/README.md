# Nest 练习项目

使用 Nest CLI 初始化的 TypeScript 项目，供 Nest 基础练习使用。

## 启动

```bash
npm install
npm run start:dev
```

服务默认运行在 `http://localhost:3001`，访问 `/` 返回 `Hello World!`。

## 验证

```bash
npm run build
npm run lint
npm test
npm run test:e2e
```

## 目录

- `src/main.ts`：应用入口
- `src/app.module.ts`：根模块
- `src/app.controller.ts`：示例路由
- `src/app.service.ts`：示例服务
- `test/`：端到端测试
