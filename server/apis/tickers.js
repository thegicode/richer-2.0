module.exports = async () => {
    const fs = require("fs");
    const path = require("path");

    const http = require("./http");
    const URL = require("../env/url");
    const PATHS = require("./paths");

    const myMarketsUrl = path.resolve(PATHS.myMarkets);
    const myMarketsRes = fs.readFileSync(myMarketsUrl, "utf8");
    const myMarkets = JSON.parse(myMarketsRes);
    const marketsStr = myMarkets.join("%2C%20");
    const url = `${URL.ticker}?markets=${marketsStr}`;

    const response = await http.get(url);

    const data = response.map((item) => {
        const {
            market, // 종목 구분 코드
            trade_date_kst, // 최근 거래 일자(KST)
            trade_time_kst, // 최근 거래 시각(KST)
            trade_price, // 종가(현재가)
            timestamp, // 타임스탬프
        } = item;

        return {
            market,
            trade_date_kst,
            trade_time_kst,
            trade_price,
            timestamp,
        };
    });

    return data;
};
