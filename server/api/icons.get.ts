interface IIcons {
    id: string;
    name: string;
    url: string;
}

export default defineEventHandler(async () => {
    const data = await $fetch<IIcons[]>("https://skills.syvixor.com/api/icons/all");
    return data
});