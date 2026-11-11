import { createApp } from "./main";

const { app, router } = createApp();

// 接下来如果有路由的话，要保证路由加载完再执行
// app.mount("#app");

// 一定要等路由加载完毕再执行
router.isReady().then(() => {
  app.mount("#app");
});
