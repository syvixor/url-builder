<script lang="ts" setup>
</script>

<template>
    <footer>
        <UCard variant="soft">
            <div class="flex justify-between items-center gap-2">
                <p class="text-base font-normal">
                    &copy; {{ new Date().getFullYear() }} Skills Icons
                </p>
                <UButton to="https://github.com/syvixor/skills-icons" target="_blank" icon="i-lucide-github"
                        variant="soft" />
            </div>
        </UCard>
    </footer>
</template>