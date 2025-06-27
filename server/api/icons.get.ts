import { load } from "cheerio";

export default defineEventHandler(async (event) => {
    const response: string = await $fetch("https://skills.syvixor.com/api/readme");

    const lines = response.split("\n").filter(line => line.startsWith("|") && line.includes("<img"));
    const ids: string[] = [];

    lines.map(line => {
        const columns = line.split("|").map(col => col.trim());
        const id = [columns[1]?.match(/`([^`]+)`/), columns[4]?.match(/`([^`]+)`/)];
        if (id[0]) ids.push(id[0][1]);
        if (id[1]) ids.push(id[1][1]);
    });

    const promises = ids.map(async (id) => {
        const url = `https://raw.githubusercontent.com/syvixor/skills-icons/refs/heads/main/icons/${id}.svg`;
        
        const blob: Blob = await $fetch(url);
        const response: string = await blob.text();

        const $ = load(response);
        const title = $("svg").attr("title");

        return {
            id,
            name: title || id,
            url: url
        }
    });

    const data = await Promise.all(promises);
    
    return data.sort((a, b) => a.id.localeCompare(b.id));
});