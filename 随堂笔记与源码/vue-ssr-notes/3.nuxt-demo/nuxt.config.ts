// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [/* '@nuxt/fonts', */ "@nuxt/icon", "@nuxt/image"],
  app: {
    head: {
      title: "miaoma vue ssr",
      meta: [
        {
          name: "description",
          content: "miaoma vue ssr",
        },
      ],
    },
  },
});
