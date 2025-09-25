<script lang="ts" setup>
import { AnimatePresence, motion } from "motion-v";
import { useSortable } from "@vueuse/integrations/useSortable";

const toast = useToast();
const { copy } = useClipboard();

// Mount Control
const isReady = ref(false);
onMounted(() => (isReady.value = true));

// Shared state
const selectedIcons = ref<string[]>([]);
const iconsPerLine = ref(15);

// Controller logic
const selectedCount = computed(() => selectedIcons.value.length);
const baseUrl = "https://skills.syvixor.com/api/icons";

const generatedUrl = computed(() => {
    return selectedIcons.value.length > 0 ? `${baseUrl}?perline=${iconsPerLine.value}&i=${selectedIcons.value.join(",")}` : baseUrl
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
    selectedIcons.value = [];
    toast.add({
        icon: "i-lucide-check",
        title: "Cleared!",
        description: "Selection successfully cleared.",
    });
}

// Icons preview logic
const isPreviewable = ref(false);
const hasPreviewLoaded = ref(false);

const previewLoaded = () => {
    hasPreviewLoaded.value = true;
}

const previewSize = (): { width: number, height: number } => {
    // The width/height of a singular/additional icon
    const singularIcon = 48;
    const additionalIcon = 56.25;

    const additionalWidth = additionalIcon * ((iconsPerLine.value < selectedCount.value ? iconsPerLine.value : selectedCount.value) - 1);
    const additionalHeight = additionalIcon * (Math.ceil(selectedCount.value / iconsPerLine.value) - 1);

    return {
        width: singularIcon + additionalWidth,
        height: singularIcon + additionalHeight
    }
}

watch(isPreviewable, (value, oldValue) => {
    if (value === true && oldValue === false) {
        hasPreviewLoaded.value = false;
    }
});

// Selector logic
const searchTerm = ref("");
const visibleCount = ref(120);
const isLoading = ref(false);

const { data: icons } = await useFetch("/api/icons/all");

const filteredIcons = computed(() => {
    return icons.value?.filter((icon: any) => {
        const searchLower = searchTerm.value.toLowerCase();
        return (
            !selectedIcons.value.includes(icon.id) &&
            (icon.id.toLowerCase().includes(searchLower) ||
                icon.name.toLowerCase().includes(searchLower))
        )
    });
});

const visibleIcons = computed(() => {
    return filteredIcons.value?.slice(0, visibleCount.value);
});

const hasMoreIcons = computed(() => {
    return visibleCount.value < (filteredIcons.value?.length || 0);
});

const getIconData = (id: string) => {
    return icons.value?.find(icon => id === icon.id);
};

const iconSelection = (id: string) => {
    if (selectedIcons.value.includes(id)) {
        selectedIcons.value = selectedIcons.value.filter(updatedId => updatedId !== id);
    } else {
        selectedIcons.value.push(id);
    }
};

const loadMore = () => {
    isLoading.value = true;
    setTimeout(() => {
        visibleCount.value += 120;
        isLoading.value = false;
    }, 500);
};

watch(searchTerm, () => (visibleCount.value = 120));

// Allow for dragging selected icons
const selectedIconsRef = useTemplateRef<HTMLElement>("selectedIconsDiv");
let sortableInstance: ReturnType<typeof useSortable> | null = null;

// Watch for selected icon div to get added to DOM
watch(selectedIconsRef, (newElement) => {
    if (newElement && !sortableInstance) {
        // Add sortability to new dom element
        sortableInstance = useSortable(
            selectedIconsRef,
            selectedIcons,
            {
                animation: 150
            }
        );
    } else if (!newElement && sortableInstance) {
        // Remove sortability instance
        sortableInstance?.stop();
        sortableInstance = null;
    }
}, { immediate: true });

// URL State (decode on page load)
onMounted(() => {
    // Get data from URL params
    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams) return;

    // Icons per-line
    const paramPerline = Number(searchParams.get("perline"));
    if (paramPerline && !isNaN(paramPerline) && Number.isInteger(paramPerline)
        && paramPerline <= 15 && paramPerline > 0) {
        iconsPerLine.value = paramPerline;
    }

    // Selected icons
    const paramIcons = searchParams.get("i");
    const paramIconsArray = paramIcons?.split(",");
    if (paramIconsArray?.length) {
        selectedIcons.value = paramIconsArray.filter(icon => icon);
    }

    // Trigger url params update
    urlStateChange();
});

// URL State (encode on config data change)
const urlStateChange = () => {
    // Set url parameters to match new state
    window.history.replaceState({}, "",
        `${window.location.pathname}?perline=${iconsPerLine.value}&i=${selectedIcons.value.join(",")}`
    )
}

watch(iconsPerLine, urlStateChange);
watch(selectedIcons, urlStateChange, { deep: true });
</script>

<template>
    <div v-show="isReady">
        <Particles />
        <div class="relative space-y-12 py-8 px-6">
            <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ delay: 0.2, duration: 0.5 }"
                class="space-y-4">
                <div class="space-y-2">
                    <UBadge icon="i-lucide-zap" label="Fast & Reliable" variant="soft" size="lg" class="animate-bounce"
                        style="animation-duration: 5s !important;" />
                    <h1 class="glitch text-5xl md:text-6xl font-black uppercase" data-text="Skills Icons">
                        Skills Icons</h1>
                    <p class="text-xl font-medium">
                        Showcase skills in projects or profiles effortlessly ✨
                    </p>
                </div>

                <div class="flex items-center gap-3 flex-wrap">
                    <div class="flex gap-2.5">
                        <UButton to="https://github.com/syvixor/skills-icons" target="_blank" icon="i-lucide-github"
                            label="GitHub" />
                        <Theme />
                    </div>

                    <div class="flex gap-2.5 text-nowrap items-baseline-last" style="margin-bottom: 3px">
                        <p class="text-base font-normal">Icons Per Line</p>
                        <USlider v-model="iconsPerLine" :min="1" :max="15" size="md" :tooltip="{
                            open: true, arrow: true, content: { side: 'bottom' }
                        }" class="w-36" />
                    </div>
                </div>

            </motion.div>

            <!-- Controller -->
            <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ delay: 0.4, duration: 0.5 }"
                class="space-y-4">
                <div class="ring-1 ring-neutral-200 dark:ring-neutral-800 backdrop-blur-xs rounded-lg space-y-6 p-4">
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-bold">Generated URL</h2>
                    </div>
                    <div class="flex flex-col gap-2">
                        <UInput v-model="generatedUrl" size="lg" readonly />
                        <div v-if="isPreviewable" class="space-y-2">
                            <h3 class="text-xl font-bold">Preview</h3>
                            <div v-if="selectedCount > 0">
                                <USkeleton v-show="!hasPreviewLoaded"
                                    :style="`width: ${previewSize().width}px; height: ${previewSize().height}px;`" />
                                <img @load="previewLoaded" :src="generatedUrl" alt="" loading="lazy">
                            </div>
                            <UAlert v-else icon="i-lucide-circle-alert" title="Hmmm"
                                description="Looks like you haven’t picked an icon yet." color="error" variant="soft" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <UButton :icon="isPreviewable ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                            :label="isPreviewable ? 'Hide Preview' : 'Show Preview'" variant="soft" size="lg" block
                            @click="isPreviewable = !isPreviewable" />
                        <UButton icon="i-lucide-copy" label="Copy URL" variant="soft" size="lg"
                            :disabled="selectedCount === 0" block @click="copyUrl" />
                        <UButton icon="i-lucide-trash" label="Clear All" color="error" variant="soft" size="lg"
                            :disabled="selectedCount === 0" block @click="clearAll" />
                    </div>
                </div>
            </motion.div>

            <!-- Selected -->
            <AnimatePresence>
                <motion.div v-if="selectedCount > 0" key="selectedIconsSection" :initial="{ opacity: 0 }"
                    :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" :transition="{ duration: 0.175 }"
                    class="space-y-4">
                    <div
                        class="ring-1 ring-neutral-200 dark:ring-neutral-800 backdrop-blur-xs rounded-lg space-y-6 p-4">
                        <div class="flex flex-col gap-4">
                            <div class="flex justify-between items-center">
                                <h2 class="text-2xl font-bold">Selected Icons</h2>
                                <UBadge variant="soft" size="lg">
                                    {{ selectedIcons?.length }}
                                    {{ selectedIcons?.length === 1 ? "Icon" : "Icons" }}
                                </UBadge>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div ref="selectedIconsDiv" class="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-20 gap-2">
                                <Icons v-for="icon in selectedIcons" :key="icon" :icon="getIconData(icon)"
                                    :selected="true" @click="iconSelection(icon)">
                                </Icons>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <!-- Selector -->
            <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ delay: 0.6, duration: 0.5 }"
                class="space-y-4">
                <div class="ring-1 ring-neutral-200 dark:ring-neutral-800 backdrop-blur-xs rounded-lg space-y-6 p-4">
                    <div class="flex flex-col gap-4">
                        <div class="flex justify-between items-center">
                            <h2 class="text-2xl font-bold">Available Icons</h2>
                            <UBadge variant="soft" size="lg">
                                {{ filteredIcons?.length }}
                                {{ filteredIcons?.length === 1 ? "Icon" : "Icons" }}
                            </UBadge>
                        </div>

                        <UInput v-model="searchTerm" placeholder="Search Icons..." variant="soft" size="lg"
                            icon="i-lucide-search" />
                    </div>

                    <div class="space-y-4">
                        <div class="flex flex-col justify-center items-center gap-4 py-12"
                            v-if="filteredIcons?.length === 0">

                            <div class="flex flex-col items-center space-y-1">
                                <Icon name="i-lucide-x" class="w-12 h-12" />
                                <h3 class="text-xl font-bold">Icon Not Found</h3>
                            </div>

                            <UButton to="https://github.com/syvixor/skills-icons/issues" target="_blank"
                                label="Request Icon" variant="soft" size="lg" />
                        </div>

                        <div class="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-20 gap-2" v-else>
                            <AnimatePresence>
                                <Icons v-for="icon in visibleIcons" :key="icon.id" :icon="icon" :selected="false"
                                    @click="iconSelection(icon.id)">
                                </Icons>
                            </AnimatePresence>
                        </div>
                    </div>

                    <UButton :icon="!hasMoreIcons ? 'i-lucide-x' : 'i-lucide-plus'" :label="isLoading ? 'Loading...' : !hasMoreIcons
                        ? 'No More Icons' : 'Load More'" variant="soft" size="lg" :loading="isLoading"
                        :disabled="isLoading || !hasMoreIcons" block @click="loadMore" />
                </div>
            </motion.div>
        </div>
    </div>
    <div v-show="!isReady" class="flex justify-center items-center h-screen">
        <UButton label="Loading" variant="link" size="xl" loading />
    </div>
</template>

<style scoped>
.glitch {
    position: relative;
}

.glitch::before,
.glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    clip: rect(0, 900px, 0, 0);
}

.glitch::before {
    left: 2px;
    text-shadow: -2px 0 crimson;
    animation: glitch-animation-1 4s infinite linear alternate-reverse;
}

.glitch::after {
    left: -2px;
    text-shadow: -2px 0 aquamarine;
    animation: glitch-animation-2 4s infinite linear alternate-reverse;
}

@keyframes glitch-animation-1 {
    0% {
        clip: rect(0, 900px, 0, 0);
        transform: translate(0);
    }

    20% {
        clip: rect(10px, 900px, 50px, 0);
        transform: translate(-2px, -2px);
    }

    40% {
        clip: rect(30px, 900px, 60px, 0);
        transform: translate(2px, 0);
    }

    60% {
        clip: rect(10px, 900px, 45px, 0);
        transform: translate(-2px, 2px);
    }

    80% {
        clip: rect(0, 900px, 20px, 0);
        transform: translate(2px, -2px);
    }

    100% {
        clip: rect(0, 900px, 0, 0);
        transform: translate(0);
    }
}

@keyframes glitch-animation-2 {
    0% {
        clip: rect(0, 900px, 0, 0);
        transform: translate(0);
    }

    20% {
        clip: rect(60px, 900px, 80px, 0);
        transform: translate(2px, 2px);
    }

    40% {
        clip: rect(45px, 900px, 70px, 0);
        transform: translate(-2px, 0);
    }

    60% {
        clip: rect(65px, 900px, 90px, 0);
        transform: translate(2px, -2px);
    }

    80% {
        clip: rect(55px, 900px, 80px, 0);
        transform: translate(-2px, 2px);
    }

    100% {
        clip: rect(0, 900px, 0, 0);
        transform: translate(0);
    }
}
</style>