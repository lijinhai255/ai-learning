FROM node:22-alpine AS build
WORKDIR /workspace
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/design-tokens/package.json ./packages/design-tokens/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN corepack enable && pnpm install --filter @miaoma/web...
COPY apps/web ./apps/web
COPY packages/design-tokens ./packages/design-tokens
COPY packages/shared-types ./packages/shared-types
COPY packages/ui ./packages/ui
RUN pnpm --filter @miaoma/web build

FROM nginx:1.27-alpine
COPY Docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/web/dist /usr/share/nginx/html
EXPOSE 80
