<script lang="ts" setup>
useHead({ htmlAttrs: { lang: "en" } });
</script>

<template>
    <div class="space-y-8 p-4 lg:p-8">
        <Header />
        <slot />
        <Footer />
    </div>
</template>