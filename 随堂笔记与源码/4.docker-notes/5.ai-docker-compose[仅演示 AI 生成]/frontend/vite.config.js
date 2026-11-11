import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 配置：
// - 开发时通过 proxy 把 /api 转到后端
// - 构建产物输出到 ./dist（Caddy 容器将挂载此目录作为「CDN 静态资源」）
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/health': 'http://localhost:3000',
    },
  },
});