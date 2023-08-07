const fs = require("fs");
const path = require("path");
const { getJSON } = require("../utils/apiRequest");
const URL = require("../../env/url");
const PATHS = require("../utils/paths");

module.exports = async () => {
    const myMarketsUrl = path.resolve(PATHS.myMarkets);
    const myMarketsRes = fs.readFileSync(myMarketsUrl, "utf8");
    const myMarkets = JSON.parse(myMarketsRes);
    const marketsStr = encodeURIComponent(myMarkets.join(", "));

    const url = `${URL.ticker}?markets=${marketsStr}`;
    const response = await getJSON({ url });

    return response.map(
        ({
            market,
            trade_date_kst,
            trade_time_kst,
            trade_price,
            timestamp,
        }) => ({
            market, // 종목 구분 코드
            trade_date_kst, // 최근 거래 일자(KST)
            trade_time_kst, // 최근 거래 시각(KST)
            trade_price, // 종가(현재가)
            timestamp, // 타임스탬프
        })
    );
};
