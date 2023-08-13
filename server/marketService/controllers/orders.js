const { authorizationTokenBody } = require("../../env/token");
const UPBIT_URL = require("../../env/url");
const { getJSON } = require("../utils/apiRequest");

module.exports = async (req) => {
    const { market, side, volume, price, ord_type } = req.query;
    const body = {
        market,
        side,
        volume,
        price,
        ord_type,
    };

    const { query, token } = authorizationTokenBody(body);

    const options = {
        method: "POST",
        url: `${UPBIT_URL.orders}?${query}`,
        headers: { Authorization: token },
        body,
    };

    const response = await getJSON(options);
    return response;
};
