interface IIcons {
    id: string;
    name: string;
    url: string;
}

interface IResponse {
    statusCode: number;
    statusMessage: string;
    data: IIcons[];
}

export default defineEventHandler(async () => {
    const data = await $fetch<IResponse>("https://skills.syvixor.com/api/icons/all");
    return data.data
});