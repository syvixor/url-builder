<script setup lang="ts">
import { ref } from 'vue'
import type { IIcons } from "~/types";

const props = defineProps<{
    icon: IIcons | undefined;
    selected: boolean;
}>();

const beingDragged = ref(false);

const mousedown = () => {
    beingDragged.value = true;
}

const mouseup = () => {
    beingDragged.value = false;
}
</script>

<template>
    <div
        @mousedown="mousedown"
        @mouseup="mouseup"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ duration: 0.2 }"
        :class="[ selected && 'selected ring-2 ring-primary/50 dark:ring-primary/50 bg-primary/20 dark:bg-primary/20 p-1', !beingDragged && 'transition-all' ]"
        class="skill-icon rounded-lg hover:cursor-grab active:cursor-grabbing hover:scale-95 active:scale-90">

        <img v-if="icon" :src="icon.url" :alt="icon.name" :title="icon.name" loading="lazy">
    </div>
</template>

<style scoped>
    /* Fade-in icons without messing with sortable/v-motion animations */
    .selected {
        animation-duration: 0.275s;
        animation-name: animate-fade;
        animation-fill-mode: backwards;
    }

    @keyframes animate-fade {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
</style>