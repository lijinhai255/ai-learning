# Spring Boot Todo API

与 `apps/api-nest` 保持一致的 Todo HTTP 服务，数据存储在进程内，重启后恢复预置数据。

## 启动

需要 Java 17+ 和 Maven：

```bash
mvn spring-boot:run
```

默认监听 `http://127.0.0.1:3001`，可通过 `PORT` 环境变量修改端口。

## 测试

```bash
mvn test
```

## API

- `GET /health`
- `GET /todos`
- `POST /todos`，请求体 `{ "title": "新待办" }`
- `PATCH /todos/{id}/toggle`
- `DELETE /todos/{id}`

创建标题会去除首尾空格，标题长度必须为 1–200 个字符。不存在的 Todo 返回 404 和 `TODO_NOT_FOUND`。
