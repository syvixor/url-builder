<script lang="ts" setup>
const toast = useToast();
const { copy } = useClipboard();

const { selectedIcons } = defineProps<{ selectedIcons: String[] }>();

const baseUrl = "https://skills.syvixor.com/api/icons";

const isPreviewable = ref(false);
const selectedCount = computed(() => selectedIcons.length);

const generatedUrl = computed(() => {
    return selectedIcons.length > 0
        ? `${baseUrl}?i=${selectedIcons.join(",")}`
        : baseUrl
});

const copyUrl = () => {
    copy(generatedUrl.value);
    toast.add({
        icon: "i-lucide-check",
        title: "Copied!",
        description: "URL successfully copied."
    });
}

const clearAll = () => {
    selectedIcons.splice(0);
    toast.add({
        icon: "i-lucide-check",
        title: "Cleared!",
        description: "Cleared successfully."
    });
}
</script>

<template>
    <UCard variant="soft">
        <template #header>
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">Generated URL</h2>
                <UBadge variant="soft" size="lg">{{ selectedCount }} Selected</UBadge>
            </div>
        </template>
        <div class="flex flex-col gap-2">
            <UInput v-model="generatedUrl" size="lg" readonly />
            <div class="space-y-2" v-if="isPreviewable">
                <h3 class="text-xl font-bold">Preview</h3>
                <img :src="generatedUrl" alt="Preview" loading="lazy" v-if="selectedCount > 0" />
                <UAlert icon="i-lucide-circle-alert" title="Hmmm"
                    description="Looks like you haven’t picked an icon yet." color="error" variant="soft" v-else />
            </div>
        </div>
        <template #footer>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <UButton :icon="isPreviewable ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :label="isPreviewable ? 'Hide Preview' : 'Show Preview'" variant="soft" size="lg"
                    @click="isPreviewable = !isPreviewable" block />
                <UButton icon="i-lucide-copy" label="Copy URL" color="neutral" variant="soft" size="lg"
                    :disabled="selectedCount === 0" @click="copyUrl" block />
                <UButton icon="i-lucide-trash" label="Clear All" color="error" variant="soft" size="lg"
                    @click="clearAll" :disabled="selectedCount === 0" block />
            </div>
        </template>
    </UCard>
</template>