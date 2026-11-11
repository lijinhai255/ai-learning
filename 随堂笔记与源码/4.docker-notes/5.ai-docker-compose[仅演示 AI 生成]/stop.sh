#!/usr/bin/env bash
# 一键停止并清理脚本
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "==> 停止容器"
docker compose down

echo "==> 删除构建产物（可选）"
rm -rf frontend/dist

echo "✅ 已停止。卷宗数据保留（如需彻底清理：docker compose down -v）"