async function fetchData(url: string, marketName?: string) {
    try {
        let finalURL = url;

        if (marketName) {
            const params = new URLSearchParams({
                market: marketName,
            }).toString();
            finalURL = `${url}?${params}`;
        }

        // const urlObject = new URL(url);
        // if (marketName) {
        //     urlObject.searchParams.append("market", marketName);
        // }

        const response = await fetch(finalURL, { method: "GET" });
        return await response.json();
    } catch (error) {
        console.warn(error instanceof Error ? error.message : error);
    }
}

export default fetchData;
