import { IResponse } from "~/types";

export default defineEventHandler(async () => {
    const data = await $fetch<IResponse>("https://skills.syvixor.com/api/icons/all");
    return data.data
});