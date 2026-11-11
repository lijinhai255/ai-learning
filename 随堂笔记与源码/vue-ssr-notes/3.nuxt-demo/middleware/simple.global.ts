// 像是一个导航守卫
export default defineNuxtRouteMiddleware((to, from) => {
  console.log("🚀 ~ defineNuxtRouteMiddleware ~ to:", to.path);
});
