<script setup lang="ts">
import { motion } from "motion-v";

const { selectedIcons } = defineProps<{ selectedIcons: String[] }>();

const emit = defineEmits(["icons-updater"]);

const searchTerm = ref("");
const visibleCount = ref(120);
const isLoading = ref(false);

const { data } = await useFetch("/api/icons");

const filteredIcons = computed(() => {
    return data.value?.filter((icon) => {
        const searchLower = searchTerm.value.toLowerCase();
        return (
            icon.id.toLowerCase().includes(searchLower) ||
            icon.name.toLowerCase().includes(searchLower)
        )
    });
});

const visibleIcons = computed(() => {
    return filteredIcons.value?.slice(0, visibleCount.value);
});

const hasMoreIcons = computed(() => {
    return visibleCount.value < filteredIcons.value?.length!;
});

const iconSelection = (id: string) => {
    const updatedIcons = [...selectedIcons];

    if (updatedIcons.includes(id)) {
        const index = updatedIcons.indexOf(id);
        if (index !== -1) {
            updatedIcons.splice(index, 1);
        }
    } else {
        updatedIcons.push(id);
    }

    emit("icons-updater", updatedIcons);
}


const loadMore = () => {
    isLoading.value = true;
    setTimeout(() => {
        visibleCount.value += 120;
        isLoading.value = false;
    }, 500);
}

watch(searchTerm, () => {
    visibleCount.value = 120;
});
</script>

<template>
    <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ delay: 0.3 }">
        <UCard variant="soft">
            <template #header>
                <div class="flex flex-col gap-4">
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-bold">Available Icons</h2>
                        <UBadge variant="soft" size="lg">{{ filteredIcons?.length }} Icons</UBadge>
                    </div>
                    <UInput v-model="searchTerm" placeholder="Search..." size="lg" icon="i-lucide-search" />
                </div>
            </template>
            <div class="space-y-4">
                <div class="flex flex-col justify-center items-center gap-4 py-12" v-if="filteredIcons?.length === 0">
                    <div class="flex flex-col items-center space-y-1">
                        <Icon name="i-lucide-search-x" class="w-12 h-12" />
                        <h3 class="text-xl font-bold">Icon Not Found</h3>
                    </div>
                    <p class="text-base font-normal">Oh, can't find your icon?</p>
                    <UButton to="https://github.com/syvixor/skills-icons/issues" target="_blank"
                        label="Submit A Request" color="warning" variant="soft" />
                </div>
                <div class="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-20 gap-2" v-else>
                    <div class="group cursor-pointer transition-all hover:scale-95" v-for="icon in visibleIcons"
                        :key="icon.id" @click="iconSelection(icon.id)">
                        <div class="rounded-lg transition-all" :class="[
                            selectedIcons.includes(icon.id) &&
                            'ring-2 ring-primary/50 dark:ring-primary/50 bg-primary/20 dark:bg-primary/20 p-1'
                        ]">
                            <img :src="icon.url" :alt="icon.name" :title="icon.name" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <UButton :icon="!hasMoreIcons ? 'i-lucide-x' : 'i-lucide-plus'"
                    :label="isLoading ? 'Loading...' : !hasMoreIcons ? 'No More Icons' : 'Load More'" color="neutral"
                    variant="soft" size="lg" @click="loadMore" :loading="isLoading"
                    :disabled="isLoading || !hasMoreIcons" block />
            </template>
        </UCard>
    </motion.div>
</template>