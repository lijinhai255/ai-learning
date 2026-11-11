# 架构与 pnpm monorepo

## Workspace 约定

使用根目录 `pnpm-workspace.yaml` 管理 `apps/*` 与 `packages/*`。根 `package.json` 只放跨仓库脚本和工具依赖，应用运行依赖留在应用包，共享能力留在对应 `packages/*`。

推荐包命名为 `@repo/<name>`，包的 `name`、导出入口和 TypeScript 路径保持一致。依赖内部包使用 `workspace:*`，锁文件由 pnpm 统一维护。

## 依赖方向

```text
apps/web-react ─┐
apps/web-vue   ─┼─> packages/ui / packages/contracts / packages/test-utils
apps/api-nest  ─┘             │
                              └─> packages/config
```

共享包不得反向依赖具体应用。UI 包只承载展示和无副作用交互，业务状态由应用或 feature 模块拥有。`contracts` 只描述数据结构与校验，不调用浏览器、数据库或 NestJS 运行时。

## 分层建议

前端按页面、feature、组件、状态、基础设施分层；服务端按 module、controller、service、repository、schema 分层。跨层调用通过窄接口完成，避免在组件中直接访问数据库或在 controller 中编写业务规则。

## API 契约

API 变更先更新契约和契约测试，再同步服务端、React、Vue 消费方。新增字段保持向后兼容，删除或重命名采用版本化迁移。错误响应统一包含稳定错误码、面向用户的消息和可关联的请求标识，敏感信息不出现在响应与日志中。

## 配置与环境

环境变量按应用维护 `.env.example`，真实值存放在本地未跟踪文件或密钥服务。配置在进程启动时校验并转换类型，业务代码读取已校验的配置对象。开发、测试、预发布、生产配置分层，测试默认使用隔离资源。

## 演进规则

引入新包、跨应用共享状态、数据库迁移或公开 API 时，先补 ADR 和影响清单。发现重复实现时，只有在调用方和稳定边界明确后再提取共享包，避免过早抽象。
