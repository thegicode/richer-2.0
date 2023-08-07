const fs = require("fs");
const path = require("path");

const UPBIT_URL = require("../../env/url");
const { authorizationToken } = require("../../env/token");

const { getJSON } = require("../utils/apiRequest");
const PATHS = require("../utils/paths");

module.exports = async () => {
    const options = {
        url: UPBIT_URL.accounts,
        headers: { Authorization: authorizationToken },
    };

    const data = await getJSON(options);

    const krwAsset = data.filter((account) => account.currency === "KRW")[0];

    const myMarkets = data
        .filter((account) => account.avg_buy_price > 0)
        .map((account) => {
            const { currency, balance, locked, avg_buy_price, unit_currency } =
                account;

            const locked_number = Number(locked);
            const volume = Number(balance) + locked_number;
            const market = `${unit_currency}-${currency}`;

            return {
                market,
                avg_buy_price: Number(avg_buy_price),
                buy_price: volume * Number(avg_buy_price),
                currency,
                locked: locked_number,
                unit_currency,
                volume,
            };
        })
        .sort((a, b) => b.buy_price - a.buy_price);

    // Optionally, if you need to store the markets
    const marketsArray = myMarkets.map((account) => account.market);
    const dataURL = path.resolve(PATHS.myMarkets);
    fs.writeFileSync(dataURL, JSON.stringify(marketsArray));

    return {
        krwAsset,
        myMarkets,
    };
};
