"use strict";
const SERVER_URL = "https://api.upbit.com/";
module.exports = {
    accounts: `${SERVER_URL}/v1/accounts`,
    api_keys: `${SERVER_URL}/v1/api_keys`,
    candles_days: `${SERVER_URL}/v1/candles/days`,
    candles_minutes: `${SERVER_URL}/v1/candles/minutes`,
    delete: `${SERVER_URL}/v1/order`,
    orders: `${SERVER_URL}/v1/orders`,
    orders_chance: `${SERVER_URL}/v1/orders/chance`,
    market_all: `${SERVER_URL}/v1/market/all`,
    ticker: `${SERVER_URL}/v1/ticker`,
};
