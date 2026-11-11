FROM node:22-alpine AS build
WORKDIR /workspace
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* tsconfig.base.json ./
COPY services/api-nest/package.json services/api-nest/tsconfig.json ./services/api-nest/
RUN corepack enable && pnpm install --filter @miaoma/api-nest...
COPY services/api-nest/src ./services/api-nest/src
RUN pnpm --filter @miaoma/api-nest build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /workspace/services/api-nest/dist ./dist
COPY --from=build /workspace/services/api-nest/package.json ./package.json
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
