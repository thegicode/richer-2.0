module.exports = async () => {
    const fs = require("fs");
    const path = require("path");

    const URL = require("../env/url");
    const TOKEN = require("../env//token");
    const http = require("./http");
    const PATHS = require("./paths");

    const headers = { Authorization: TOKEN };
    const data = await http.get(URL.accounts, headers);
    const myMarkets = [];

    const accountsData = data
        .filter((account) => account.avg_buy_price > 0)
        .map((account) => {
            const {
                currency,
                balance,
                locked,
                avg_buy_price,
                avg_buy_price_modified,
                unit_currency,
            } = account;
            const locked_number = Number(locked);
            const volume = Number(balance) + locked_number;

            myMarkets.push(`${unit_currency}-${currency}`);

            return {
                avg_buy_price: Number(avg_buy_price),
                avg_buy_price_modified,
                balance: Number(balance),
                buy_price: volume * Number(avg_buy_price),
                currency,
                locked: locked_number,
                unit_currency,
                volume,
            };
        });
    // .sort((a, b) => {
    //     const aPrice = a.buy_price;
    //     const bPrice = b.buy_price;
    //     if (aPrice > bPrice) {
    //         return -1;
    //     }
    //     if (aPrice < bPrice) {
    //         return 1;
    //     }
    //     return 0;
    // });

    // Tickers api를 가져오기 위한 마켓이름 배열 파일을 만든다.
    const dataURL = path.resolve(PATHS.myMarkets);
    fs.writeFileSync(dataURL, JSON.stringify(myMarkets));

    return accountsData;
};

// const request = require("request");
// const { accounts: ACCOUNTS_URL } = require(`../env/url`);
// const token = require("../env/token");

// const options = {
//     method: "GET",
//     url: ACCOUNTS_URL,
//     headers: { Authorization: token },
// };

// request(options, (error, response, body) => {
//     if (error) throw new Error(error);
//     console.log(JSON.parse(body));
// });
