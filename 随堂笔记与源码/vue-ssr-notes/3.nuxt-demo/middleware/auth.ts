// export default function ({ store, redirect }) {
//   console.log(
//     "🚀 ~ file: auth.ts:16 ~ store.state.authenticated:",
//     store.state.authenticated
//   );
//   if (!store.state.authenticated) {
//     return redirect("/login");
//   }
// }

// 像是一个导航守卫
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.params.id === "1") {
    return abortNavigation();
  }
  // In a real app you would probably not redirect every route to `/`
  // however it is important to check `to.path` before redirecting or you
  // might get an infinite redirect loop
  if (to.path !== "/") {
    return navigateTo("/");
  }
});
