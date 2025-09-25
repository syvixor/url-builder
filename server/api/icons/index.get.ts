export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    return sendRedirect(event, `/?perline=${query?.["perline"]}&i=${query?.["i"]}`);
});