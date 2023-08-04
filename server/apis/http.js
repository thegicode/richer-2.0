const request = async (params) => {
    const {
        method = "GET",
        url,
        headers = { Accept: "application/json" },
        body,
    } = params;

    const options = {
        method,
        headers,
        body: JSON.stringify(body),
    };

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (err) {
        console.error(err);
    }
};

const get = async (url, headers) => {
    const response = await request({
        method: "GET",
        url,
        headers,
    });
    return response;
};

module.exports = {
    get,
};
