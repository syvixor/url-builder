<script lang="ts" setup>
useHead({ htmlAttrs: { lang: "en" } });

const isReady = ref(false);
onMounted(() => isReady.value = true);
</script>

<template>
    <div class="space-y-8 p-4 lg:p-8" v-show="isReady">
        <Header />
        <slot />
        <Footer />
    </div>
    <div class="flex justify-center items-center h-screen" v-show="!isReady">
        <UButton label="Loading" color="neutral" variant="link" size="xl" loading />
    </div>
</template>