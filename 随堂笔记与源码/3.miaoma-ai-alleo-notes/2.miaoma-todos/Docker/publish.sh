#!/usr/bin/env bash
set -euo pipefail

: "${DOCKERHUB_NAMESPACE:?请设置 DOCKERHUB_NAMESPACE}"
: "${RELEASE_TAG:?请设置 RELEASE_TAG}"

docker build -t "${DOCKERHUB_NAMESPACE}/miaoma-todo-api-nest:${RELEASE_TAG}" -f services/api-nest/Dockerfile .
docker build -t "${DOCKERHUB_NAMESPACE}/miaoma-todo-billing-spring:${RELEASE_TAG}" -f services/billing-spring/Dockerfile .
docker build -t "${DOCKERHUB_NAMESPACE}/miaoma-todo-intelligence-fastapi:${RELEASE_TAG}" -f services/intelligence-fastapi/Dockerfile .
docker build -t "${DOCKERHUB_NAMESPACE}/miaoma-todo-web:${RELEASE_TAG}" -f apps/web/Dockerfile .

docker push "${DOCKERHUB_NAMESPACE}/miaoma-todo-api-nest:${RELEASE_TAG}"
docker push "${DOCKERHUB_NAMESPACE}/miaoma-todo-billing-spring:${RELEASE_TAG}"
docker push "${DOCKERHUB_NAMESPACE}/miaoma-todo-intelligence-fastapi:${RELEASE_TAG}"
docker push "${DOCKERHUB_NAMESPACE}/miaoma-todo-web:${RELEASE_TAG}"
