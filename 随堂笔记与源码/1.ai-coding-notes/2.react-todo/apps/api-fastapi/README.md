# FastAPI Todo API

与 `apps/api-nest` 保持一致的 Todo HTTP 服务，数据存储在进程内，重启后恢复预置数据。

## 启动

使用 Python 3.11+，安装 `requirements.txt` 后运行：

```bash
uvicorn app.main:app --host 127.0.0.1 --port 3002 --reload
```

默认监听 `http://127.0.0.1:3002`。生产环境可通过 `PORT` 传入端口并去掉 `--reload`。

## 测试

```bash
python -m pytest
```

## API

- `GET /health`
- `GET /todos`
- `POST /todos`，请求体 `{ "title": "新待办" }`
- `PATCH /todos/{id}/toggle`
- `DELETE /todos/{id}`

创建标题会去除首尾空格，标题长度必须为 1–200 个字符。不存在的 Todo 返回 404 和 `TODO_NOT_FOUND`。
