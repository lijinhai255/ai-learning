#!/usr/bin/env bash
# 拉取并运行 Caddy 服务

set -e

CONTAINER_NAME="caddy-hello"
IMAGE="caddy:2"
HOST_PORT=8080
CONTAINER_PORT=80

# 本地站点目录（宿主机），会通过 volume 映射到容器 /srv
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="${SCRIPT_DIR}/site"
mkdir -p "${SITE_DIR}"

echo "==> 拉取 Caddy 镜像: ${IMAGE}"
docker pull "${IMAGE}"

# 如果已有同名容器，先删掉
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "==> 已存在容器 ${CONTAINER_NAME}，先删除"
  docker rm -f "${CONTAINER_NAME}" >/dev/null
fi

echo "==> 启动 Caddy 容器: ${CONTAINER_NAME}"
docker run -d \
  --name "${CONTAINER_NAME}" \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  -v caddy_data:/data \
  -v caddy_config:/config \
  -v "${SITE_DIR}:/srv:ro" \
  -v "${SCRIPT_DIR}/Caddyfile:/etc/caddy/Caddyfile:ro" \
  "${IMAGE}"

echo "==> 等待容器启动..."
sleep 2

echo "==> 容器状态:"
docker ps --filter "name=${CONTAINER_NAME}"

echo ""
echo "==> 访问地址: http://localhost:${HOST_PORT}"