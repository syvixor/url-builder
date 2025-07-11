export default defineEventHandler(async (event) => {
    const data = await $fetch("https://skills.syvixor.com/api/icons/all");
    return data
});