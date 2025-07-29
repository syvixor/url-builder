<script lang="ts" setup>
import { motion } from "motion-v";

const toast = useToast();
const { copy } = useClipboard();

// Mount Controll
const isReady = ref(false);
onMounted(() => (isReady.value = true));

// Shared state
const selectedIcons = ref<string[]>([]);
const updateIcons = (selection: string[]) => {
  selectedIcons.value = selection;
};

// Controller logic
const isPreviewable = ref(false);
const selectedCount = computed(() => selectedIcons.value.length);
const baseUrl = "https://skills.syvixor.com/api/icons";

const generatedUrl = computed(() => {
  return selectedIcons.value.length > 0
    ? `${baseUrl}?i=${selectedIcons.value.join(",")}`
    : baseUrl;
});

const copyUrl = () => {
  copy(generatedUrl.value);
  toast.add({
    icon: "i-lucide-check",
    title: "Copied!",
    description: "URL successfully copied.",
  });
};

const clearAll = () => {
  selectedIcons.value.splice(0);
  toast.add({
    icon: "i-lucide-check",
    title: "Cleared!",
    description: "Selection successfully cleared.",
  });
};

// Selector logic
const searchTerm = ref("");
const visibleCount = ref(120);
const isLoading = ref(false);

const { data: icons } = await useFetch("/api/icons");

const filteredIcons = computed(() => {
  return icons.value?.filter((icon) => {
    const searchLower = searchTerm.value.toLowerCase();
    return (
      icon.id.toLowerCase().includes(searchLower) ||
      icon.name.toLowerCase().includes(searchLower)
    );
  });
});

const visibleIcons = computed(() => {
  return filteredIcons.value?.slice(0, visibleCount.value);
});

const hasMoreIcons = computed(() => {
  return visibleCount.value < (filteredIcons.value?.length || 0);
});

const iconSelection = (id: string) => {
  const updatedIcons = [...selectedIcons.value];

  if (updatedIcons.includes(id)) {
    const index = updatedIcons.indexOf(id);
    if (index !== -1) updatedIcons.splice(index, 1);
  } else {
    updatedIcons.push(id);
  }

  updateIcons(updatedIcons);
};

const loadMore = () => {
  isLoading.value = true;
  setTimeout(() => {
    visibleCount.value += 120;
    isLoading.value = false;
  }, 500);
};

watch(searchTerm, () => (visibleCount.value = 120));
</script>

<template>
  <div v-show="isReady">
    <Particles />
    <div class="relative space-y-12 py-8 px-6">
      <motion.div
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ delay: 0.2, duration: 0.5 }"
        class="space-y-4"
      >
        <div class="space-y-2">
          <UBadge
            icon="i-lucide-zap"
            label="Fast & Reliable"
            variant="soft"
            size="lg"
            class="animate-bounce"
          />
          <h1
            class="bg-gradient-to-r from-neutral-500 via-orange-300 to-orange-400 bg-clip-text text-5xl md:text-6xl font-black text-transparent uppercase"
          >
            Skills Icons
          </h1>
          <p class="text-xl font-medium">
            Showcase skills in projects or profiles effortlessly ✨
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            to="https://github.com/syvixor/skills-icons"
            target="_blank"
            icon="i-lucide-github"
            label="Github"
          />
          <Theme />
        </div>
      </motion.div>

      <!-- Controller -->
      <motion.div
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ delay: 0.4, duration: 0.5 }"
        class="space-y-4"
      >
        <div
          class="ring-1 ring-neutral-200 dark:ring-neutral-800 backdrop-blur-xs rounded-lg space-y-6 p-4"
        >
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">Generated URL</h2>
            <UBadge variant="soft" size="lg"
              >{{ selectedCount }} Selected</UBadge
            >
          </div>
          <div class="flex flex-col gap-2">
            <UInput v-model="generatedUrl" size="lg" readonly />
            <div v-if="isPreviewable" class="space-y-2">
              <h3 class="text-xl font-bold">Preview</h3>
              <img
                v-if="selectedCount > 0"
                :src="generatedUrl"
                alt="Preview"
                loading="lazy"
              >
              <UAlert
                v-else
                icon="i-lucide-circle-alert"
                title="Hmmm"
                description="Looks like you haven’t picked an icon yet."
                color="error"
                variant="soft"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <UButton
              :icon="isPreviewable ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :label="isPreviewable ? 'Hide Preview' : 'Show Preview'"
              variant="soft"
              size="lg"
              block
              @click="isPreviewable = !isPreviewable"
            />
            <UButton
              icon="i-lucide-copy"
              label="Copy URL"
              variant="soft"
              size="lg"
              :disabled="selectedCount === 0"
              block
              @click="copyUrl"
            />
            <UButton
              icon="i-lucide-trash"
              label="Clear All"
              color="error"
              variant="soft"
              size="lg"
              :disabled="selectedCount === 0"
              block
              @click="clearAll"
            />
          </div>
        </div>
      </motion.div>

      <!-- Selector -->
      <motion.div
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ delay: 0.6, duration: 0.5 }"
        class="space-y-4"
      >
        <div
          class="ring-1 ring-neutral-200 dark:ring-neutral-800 backdrop-blur-xs rounded-lg space-y-6 p-4"
        >
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold">Available Icons</h2>
              <UBadge variant="soft" size="lg">
                {{ filteredIcons?.length }}
                {{ filteredIcons?.length === 1 ? "Icon" : "Icons" }}
              </UBadge>
            </div>
            <UInput
              v-model="searchTerm"
              placeholder="Search..."
              size="lg"
              icon="i-lucide-search"
            />
          </div>
          <div class="space-y-4">
            <div
              v-if="filteredIcons?.length === 0"
              class="flex flex-col justify-center items-center gap-4 py-12"
            >
              <div class="flex flex-col items-center space-y-1">
                <Icon name="i-lucide-x" class="w-12 h-12" />
                <h3 class="text-xl font-bold">Icon Not Found</h3>
              </div>
              <UButton
                to="https://github.com/syvixor/skills-icons/issues"
                target="_blank"
                label="Request Icon"
                variant="soft"
                size="lg"
              />
            </div>
            <div
              v-else
              class="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-20 gap-2"
            >
              <div
                v-for="icon in visibleIcons"
                :key="icon.id"
                class="group cursor-pointer transition-all hover:scale-95"
                @click="iconSelection(icon.id)"
              >
                <div
                  class="rounded-lg transition-all"
                  :class="[
                    selectedIcons.includes(icon.id) &&
                      'ring-2 ring-primary/50 dark:ring-primary/50 bg-primary/20 dark:bg-primary/20 p-1',
                  ]"
                >
                  <img
                    :src="icon.url"
                    :alt="icon.name"
                    :title="icon.name"
                    loading="lazy"
                  >
                </div>
              </div>
            </div>
          </div>
          <UButton
            :icon="!hasMoreIcons ? 'i-lucide-x' : 'i-lucide-plus'"
            :label="
              isLoading
                ? 'Loading...'
                : !hasMoreIcons
                ? 'No More Icons'
                : 'Load More'
            "
            variant="soft"
            size="lg"
            :loading="isLoading"
            :disabled="isLoading || !hasMoreIcons"
            block
            @click="loadMore"
          />
        </div>
      </motion.div>
    </div>
  </div>
  <div v-show="!isReady" class="flex justify-center items-center h-screen">
        <UButton label="Loading" variant="link" size="xl" loading />
    </div>
</template>
