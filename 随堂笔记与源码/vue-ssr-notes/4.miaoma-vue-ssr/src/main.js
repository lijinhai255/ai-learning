// 这个代码就是 Vue 项目的入口文件
import { createSSRApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createRouter } from "./router";

export function createApp() {
  // 应用创建
  // csr 创建方式
  // const app = Vue.createApp

  const app = createSSRApp(App);

  //   路由
  const router = createRouter();

  //   创建 pinia
  const pinia = createPinia();

  app.use(router);
  app.use(pinia);

  return {
    app,
    router,
  };
}
