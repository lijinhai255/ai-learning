# @miaoma/desktop

基于 Electron Forge + Vite 的桌面端骨架，渲染层复用 `@miaoma/ui` 和共享领域类型。Forge 的 Vite 插件负责主进程、预加载脚本和 React renderer 的构建。

```bash
pnpm --filter @miaoma/desktop start
pnpm --filter @miaoma/desktop package
pnpm --filter @miaoma/desktop make
```
