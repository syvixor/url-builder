export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    // Redirect users who have replaced "skills" with "builder" in the icon url to the builder page
    return sendRedirect(event, `/?perline=${query?.["perline"]}&i=${query?.["i"]}`);
})