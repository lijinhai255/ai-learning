import { createApp } from "./main";
import { renderToString } from "vue/server-renderer";

// 封装一个完整的渲染服务
export async function render(url) {
  // 保证每次请求都是一个新的应用
  const { app, router } = createApp();

  //   进来一次，我就 push 一次
  await router.push(url);
  //   路由加载完，再执行
  await router.isReady();

  //   上下文
  const ctx = {};

  const appHtml = await renderToString(app, ctx);

  return [appHtml, ctx.modules];
}
