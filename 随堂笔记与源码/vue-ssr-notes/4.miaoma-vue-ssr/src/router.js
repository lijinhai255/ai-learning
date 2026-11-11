import { h } from "vue";
import {
  createRouter as _createRouter,
  createMemoryHistory, // 服务端
  createWebHistory, // 客户端
} from "vue-router";
// 这一点其实 Vue3 后续还要做优化，
// 在 react 中服务端渲染路由，我们可以直接使用 react-router-dom 中的 StaticRouter
import Home from "./pages/Home.vue";
import About from "./pages/About.vue";

const routers = [
  {
    path: "/",
    // component: import("../pages/Home.vue"), // ssr 不能直接使用 import()
    component: Home,
  },
  {
    path: "/about",
    // component: import("../pages/About.vue"), // ssr 不能直接使用 import()
    component: About
  },
];

export function createRouter() {
  // 是服务端还是客户端，由什么决定？启动项目的时候，环境变量决定
  // import.meta.env.SSR;
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: routers,
  });
}
