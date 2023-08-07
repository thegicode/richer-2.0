const performRequest = async ({ method = "GET", url, headers = {}, body }) => {
    headers.Accept = "application/json";

    if (body) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, { method, headers, body });
        return await response.json();
    } catch (err) {
        console.error(err);
    }
};

const getJSON = (options) => performRequest(options);

module.exports = {
    getJSON,
};
