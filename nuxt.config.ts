// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ["@nuxt/ui", "@vueuse/nuxt"],
    compatibilityDate: "latest",
    devtools: { enabled: true },
    colorMode: { preference: "dark" },
    css: ["~/assets/css/global.css"]
});