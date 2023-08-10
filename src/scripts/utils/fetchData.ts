async function fetchData(url: string, params?: string) {
    try {
        const finalURL = params ? `${url}?${params}` : url;
        const response = await fetch(finalURL, { method: "GET" });
        return await response.json();
    } catch (error) {
        console.warn(error instanceof Error ? error.message : error);
    }
}

export default fetchData;
