# Miaoma Todo

Miaoma Todo 是一个面向个人、家庭与小型团队的跨平台任务管理产品。

当前仓库已包含：

- `apps/web`：React + Vite Web 端
- `apps/desktop`：Electron Forge 桌面端
- `apps/mobile`：React Native 移动端
- `services/api-nest`：NestJS 主业务 API
- `services/billing-spring`：Spring Boot 订阅与账单服务
- `services/intelligence-fastapi`：FastAPI 智能能力服务
- `packages/*`：共享类型、设计令牌和 UI 组件
- `Docker/`：PostgreSQL、Redis 与服务编排
- `tests/`：Vitest 和 Playwright 测试入口
- `docs/`：产品研发全案与发布文档

## 快速开始

```bash
pnpm install
pnpm --filter @miaoma/web dev
```

启动本地基础设施：

```bash
cp ".env.example" ".env"
pnpm docker:dev
```

## 重要说明

当前为研发骨架阶段，服务端业务接口仍按 PRD 分阶段补齐。生产环境请使用独立密钥、固定镜像版本和受控数据库迁移流程。
