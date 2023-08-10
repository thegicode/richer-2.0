const { authorizationTokenBody } = require("../../env/token");
const UPBIT_URL = require("../../env/url");
const { getJSON } = require("../utils/apiRequest");

module.exports = async (req) => {
    console.log(req.query);
    const { marekt, side, volume, price, ord_type } = req.query;
    const body = {
        marekt,
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
        json: body,
    };

    // return await getJSON(options);
};
