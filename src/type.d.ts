interface Account {
    balance: number;
    currency: string;
    locked: number;
    avg_buy_price: number;
    avg_buy_price_modified: boolean;
    unit_currency: string;
    volume: number;
    buy_price: number;
}

interface Asset {
    avg_buy_price: string;
    avg_buy_price_modified: true;
    balance: string;
    currency: string;
    locked: string;
    unit_currency: string;
}

interface Ticker {
    market: string;
    trade_date_kst: string;
    trade_time_kst: string;
    trade_price: number;
    timestamp: number;
}

interface AccountExtend extends Account {
    trade_price: number;
}

// interface Asset {
//     balance: number;
//     buyPrice: number;
//     profit: number;
//     rate: number;
//     volume: number;
// }
