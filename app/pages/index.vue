<script lang="ts" setup>
const selectedIcons = ref<string[]>([]);

const updateIcons = (selection: string[]) => {
    selectedIcons.value = selection
}
</script>

<template>
    <Head>
        <Title>Skills Icons - Showcase Skills In Projects Or Profiles Effortlessly</Title>
    </Head>
    <Controler :selectedIcons="selectedIcons" />
    <Selector :selectedIcons="selectedIcons" @icons-updater="updateIcons" />
</template>