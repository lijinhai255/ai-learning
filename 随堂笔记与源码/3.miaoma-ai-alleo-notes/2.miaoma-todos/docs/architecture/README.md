# 架构说明

Miaoma Todo 使用 pnpm monorepo。Web 与桌面端共享 React 组件和业务类型，移动端共享领域类型与 API 契约。

服务端按职责拆分：

- NestJS 负责客户端主 API、任务、项目、同步和实时通信
- Spring Boot 负责订阅、订单、权益、退款和审计
- FastAPI 负责中文自然语言、智能解析、建议和统计计算

所有服务通过 `packages/contracts` 中的 OpenAPI 契约演进。基础设施由 Docker Compose 管理 PostgreSQL 和 Redis，生产环境应固定镜像版本并配置独立密钥。
