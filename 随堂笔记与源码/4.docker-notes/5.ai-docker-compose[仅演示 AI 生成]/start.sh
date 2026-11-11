#!/usr/bin/env bash
# 一键启动脚本：
# 1. 安装前端依赖
# 2. 构建前端静态产物到 frontend/dist
# 3. 启动 docker compose 全部服务

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "==> [1/3] 安装前端依赖"
if [ ! -d "frontend/node_modules" ]; then
  (cd frontend && npm install)
else
  echo "    node_modules 已存在，跳过安装"
fi

echo "==> [2/3] 构建前端（输出到 frontend/dist）"
(cd frontend && npm run build)

echo "==> [3/3] 启动 docker compose"
docker compose up -d --build

echo
echo "✅ 启动完成！"
echo "  前端 + API 网关：http://localhost:8080"
echo "  后端直连（调试）：http://localhost:3001/health"
echo "  健康检查：      curl http://localhost:8080/health"
echo "  查看日志：      docker compose logs -f"
echo "  停止：          ./stop.sh"