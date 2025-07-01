<script lang="ts" setup>
import { motion } from "motion-v";
</script>

<template>
    <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ delay: 0.1 }">
        <div class="flex flex-col items-center text-center">
            <h1 class="text-4xl font-bold uppercase">Skills Icons</h1>
            <p class="text-sm font-normal uppercase">
                Showcase skills in projects or profiles effortlessly ✨
            </p>
        </div>
        <div class="flex justify-end items-center">
            <Theme />
        </div>
    </motion.div>

</template>