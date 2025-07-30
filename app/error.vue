<script lang="ts" setup>
import { motion } from "motion-v";

const error = useError();
const redirecting = ref(false);

const handleRedirect = () => {
    redirecting.value = true;
    setTimeout(() => {
        clearError({ redirect: "/" });
    }, 3000);
}
</script>

<template>
    <Head>
        <Title>{{ redirecting ? "Redirecting..." : `Error ${error?.statusCode}` }}</Title>
    </Head>
    <Particles />
    <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }"
        class="relative flex justify-center items-center h-screen">
        <div class="flex flex-col items-center gap-8">
            <div class="flex flex-col items-center">
                <h1 class="text-5xl font-bold">
                    {{ redirecting ? "Redirecting" : `Error ${error?.statusCode}` }}
                </h1>
                <p class="text-base font-normal">{{ redirecting ? "Be Patient..." : error?.statusCode === 404
                    ? "Page Not Found" : error?.statusCode === 500 ? "Internal Server Error" : "Error Occurred" }}
                </p>
            </div>
            <UButton v-if="redirecting" label="Redirecting..." variant="ghost" loading />
            <UButton v-else label="Redirect" variant="soft" @click="handleRedirect" />
        </div>
    </motion.div>
</template>