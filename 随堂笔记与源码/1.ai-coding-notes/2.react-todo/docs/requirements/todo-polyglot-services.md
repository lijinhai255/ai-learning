# Todo 多语言服务端实现

## 1. 背景与目标

- 用户/角色：需要在不同语言生态中运行 Todo API 的开发者。
- 场景：已有 NestJS Todo API，希望使用 Java Spring Boot 或 Python FastAPI 提供等价服务。
- 期望结果：两个服务遵循相同的 HTTP 路径、请求字段、响应字段和核心行为，可独立启动与测试。

## 2. 范围

- 本次包含：Spring Boot 服务、FastAPI 服务、内存 Todo 存储、健康检查、请求校验、CORS、单元测试和 HTTP 集成测试。
- 明确不包含：数据库持久化、鉴权、分页、用户隔离、生产部署和前端 API 客户端改造。
- 前置依赖：Java 17+ 与 Maven（Spring Boot）；Python 3.11+、pip/uv（FastAPI）。

## 3. 验收条件

| 编号  | 给定条件                | 执行动作                   | 可观察结果                                     | 测试证据           |
| ----- | ----------------------- | -------------------------- | ---------------------------------------------- | ------------------ |
| AC-01 | 服务已启动              | GET `/health`              | 返回 `status=ok` 与 `service=todo-api`         | 两套服务 HTTP 测试 |
| AC-02 | 服务刚启动              | GET `/todos`               | 返回两个预置 Todo，字段为 `id/title/completed` | 两套服务 HTTP 测试 |
| AC-03 | 标题含首尾空格          | POST `/todos`              | 创建成功，标题被 trim，`completed=false`       | 两套服务 HTTP 测试 |
| AC-04 | 标题为空或超过 200 字符 | POST `/todos`              | 返回 400，不创建数据                           | 两套服务校验测试   |
| AC-05 | Todo 存在               | PATCH `/todos/{id}/toggle` | `completed` 在 true/false 间切换               | 两套服务 HTTP 测试 |
| AC-06 | Todo 不存在             | PATCH/DELETE `/todos/{id}` | 返回 404 和稳定错误码 `TODO_NOT_FOUND`         | 两套服务 HTTP 测试 |
| AC-07 | Todo 存在               | DELETE `/todos/{id}`       | 删除成功，HTTP 200 且无响应体                  | 两套服务 HTTP 测试 |

## 4. 业务与数据契约

- 状态与转换：创建时 `completed=false`；toggle 对目标 Todo 做一次布尔取反；删除后不可再查询或操作。
- 输入校验：`title` 必填、字符串、最长 200 个字符；服务端会 trim 首尾空格。未知 JSON 字段忽略，以兼容 NestJS 的 whitelist 行为。
- 错误码：资源不存在返回 `TODO_NOT_FOUND`；请求体不合法返回 `VALIDATION_ERROR`。
- API 请求/响应字段：Todo 为 `{ id: number, title: string, completed: boolean }`；创建请求为 `{ title: string }`。
- 存储边界：数据仅保存在进程内，重启后恢复为两个预置 Todo；服务实现保证并发写入下 ID 不重复。

## 5. 测试计划

- Spring Boot：JUnit 5 服务单元测试 + MockMvc HTTP 集成测试。
- FastAPI：pytest 服务单元测试 + FastAPI TestClient HTTP 集成测试。
- 覆盖成功路径、空输入、长度边界、重复 toggle、删除后查询和未知 ID。

## 6. 验收记录

```text
环境：Java / Maven、Python / pytest 版本以本地命令输出为准
命令：mvn test（apps/api-spring）；python -m pytest（apps/api-fastapi）
结果：实现完成后记录于交付说明
报告/trace：无
剩余风险：内存存储不适用于多实例或重启后保留数据的场景
```
