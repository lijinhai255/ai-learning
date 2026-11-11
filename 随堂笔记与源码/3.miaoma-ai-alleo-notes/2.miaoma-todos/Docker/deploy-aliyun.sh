#!/usr/bin/env bash
set -euo pipefail

: "${ALIYUN_SSH_HOST:?请设置 ALIYUN_SSH_HOST}"
: "${ALIYUN_SSH_USER:?请设置 ALIYUN_SSH_USER}"
: "${ALIYUN_SSH_KEY:?请设置 ALIYUN_SSH_KEY}"
: "${RELEASE_TAG:?请设置 RELEASE_TAG}"

REMOTE_DIR="${REMOTE_DIR:-/opt/miaoma-todo}"

ssh -i "${ALIYUN_SSH_KEY}" "${ALIYUN_SSH_USER}@${ALIYUN_SSH_HOST}" "mkdir -p '${REMOTE_DIR}'"
scp -i "${ALIYUN_SSH_KEY}" Docker/compose/docker-compose.prod.yml "${ALIYUN_SSH_USER}@${ALIYUN_SSH_HOST}:${REMOTE_DIR}/docker-compose.prod.yml"
ssh -i "${ALIYUN_SSH_KEY}" "${ALIYUN_SSH_USER}@${ALIYUN_SSH_HOST}" \
  "cd '${REMOTE_DIR}' && RELEASE_TAG='${RELEASE_TAG}' docker compose -f docker-compose.prod.yml pull && RELEASE_TAG='${RELEASE_TAG}' docker compose -f docker-compose.prod.yml up -d"
