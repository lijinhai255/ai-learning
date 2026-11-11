# Todo 服务端（FastAPI 版）

教学演示用 Python FastAPI 服务端，与 `apps/backend/server`（NestJS 版）保持 API 对齐，共用同一个 PostgreSQL 数据库与表结构。

## 快速开始

```bash
cd apps/backend/server-fastapi
uv sync
uv run uvicorn app.main:app --port 8083 --reload
```

- 服务地址：<http://localhost:8083>
- API 文档（Swagger）：<http://localhost:8083/doc>

## 环境变量

复制 `.env.example` 为 `.env` 按需修改；默认值已与本仓库 docker compose（PostgreSQL 5433）对齐。

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `DB_HOST` | `localhost` | 数据库地址 |
| `DB_PORT` | `5433` | 数据库端口（docker compose 映射） |
| `DB_USERNAME` | `postgres` | 数据库用户 |
| `DB_PASSWORD` | 空 | 数据库密码 |
| `DB_DATABASE` | `todo_app` | 数据库名 |
| `PORT` | `8083` | 服务端口（避开 NestJS 版 8082） |
| `JWT_SECRET` | `todo-app-dev-secret-change-me-in-production-0123456789` | JWT 签名密钥 |

## 目录分层

与 `specs/layering.md` 的分层思路对应：

| 目录 | 对应分层 |
| --- | --- |
| `app/entities/` | entities（TypeORM 实体 → SQLAlchemy 模型） |
| `app/schemas/` | DTO（class-validator → Pydantic） |
| `app/routers/` | modules（NestJS 模块 → APIRouter） |
| `app/database.py` / `app/security.py` | fundamentals/common（数据库会话、JWT 鉴权） |
| `app/config.py` | config（@nestjs/config → pydantic-settings） |

## 与 NestJS 版对照

| 能力 | NestJS 版（8082） | FastAPI 版（8083） |
| --- | --- | --- |
| 注册 / 登录 | `POST /api/auth/register` / `login` | 同左 |
| 当前用户 | `GET /api/auth/me` | 同左 |
| Todo CRUD | `GET/POST/PATCH/DELETE /api/todos` | 同左 |
| API 文档 | `/doc`（Swagger UI） | `/doc`（Swagger UI） |
| 鉴权 | passport-jwt，Bearer Token | HTTPBearer + PyJWT，Bearer Token |
| 密码 | bcryptjs | bcrypt（哈希格式兼容，可互相登录） |
| ORM | TypeORM | SQLAlchemy 2 |
