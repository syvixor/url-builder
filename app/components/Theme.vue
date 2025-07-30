<script setup lang="ts">
const colorMode = useColorMode();

const isLoading = ref(true);
onMounted(() => isLoading.value = false);

const onThemeSwitch = () => {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
}
</script>

<template>
    <ClientOnly v-if="!isLoading">
        <UButton :icon="colorMode.preference === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
            :label="colorMode.preference === 'dark' ? 'Dark' : 'Light'" variant="soft" @click="onThemeSwitch" />
    </ClientOnly>
    <UButton v-else aria-label="Loading" label="Loading" variant="ghost" loading />
</template>