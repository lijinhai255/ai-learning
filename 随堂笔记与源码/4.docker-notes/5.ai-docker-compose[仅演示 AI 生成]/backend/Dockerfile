# 阶段 1：安装依赖
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# 阶段 2：运行
FROM node:22-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "src/index.js"]