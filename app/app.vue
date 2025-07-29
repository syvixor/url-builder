<script lang="ts" setup>
const colorMode = useColorMode();
const color = computed(() =>
  colorMode.value === "dark" ? "#1F1F1F" : "#EEEEEE"
);

useHead({
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color },
  ],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: { lang: "en" },
});

const title = "Skills Icons - URL Builder";
const description = "Showcase skills in projects or profiles effortlessly.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
});
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-primary)" />
    <NuxtPage />
  </UApp>
</template>
