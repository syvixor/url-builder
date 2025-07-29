// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ["@nuxt/ui", "@nuxt/eslint", "@vueuse/nuxt"],
    devtools: { enabled: true },
    colorMode: { preference: "dark" },
    css: ["~/assets/css/global.css"]
});