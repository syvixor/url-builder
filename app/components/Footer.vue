<script lang="ts" setup>
import { motion } from "motion-v";
</script>

<template>
    <motion.footer :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ delay: 0.4 }">
        <UCard variant="soft">
            <div class="flex justify-between items-center gap-2">
                <p class="text-base font-normal">
                    &copy; {{ new Date().getFullYear() }} Skills Icons
                </p>
                <UButton to="https://github.com/syvixor/skills-icons" target="_blank" icon="i-lucide-github"
                    variant="soft" />
            </div>
        </UCard>
    </motion.footer>
</template>