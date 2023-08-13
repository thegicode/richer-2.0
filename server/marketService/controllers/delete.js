const { authorizationTokenBody } = require("../../env/token");
const UPBIT_URL = require("../../env/url");
const { getJSON } = require("../utils/apiRequest");

module.exports = async (req) => {
    const body = {
        uuid: req.query.uuid,
    };

    const { query, token } = authorizationTokenBody(body);

    const options = {
        method: "DELETE",
        url: `${UPBIT_URL.delete}?${query}`,
        headers: { Authorization: token },
        body,
    };

    return await getJSON(options);
};
