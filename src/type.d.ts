interface I_AccountBase {
    currency: string;
    balance: number;
    locked: number;
    avg_buy_price: number;
    avg_buy_price_modified: boolean;
    unit_currency: string;
}

interface I_MyAccount extends I_AccountBase {
    market: string;
    unit_currency: string;
    volume: number;
    buy_price: number;
}

interface I_AccountItem extends I_MyAccount {
    trade_price: number;
}

interface I_Asset {
    avg_buy_price: string;
    avg_buy_price_modified: true;
    balance: string;
    currency: string;
    locked: string;
    unit_currency: string;
}

interface I_ChanceResponse {
    bid_fee: string;
    ask_fee: string;
    maker_bid_fee: string;
    maker_ask_fee: string;
    market: I_Market;
    bid_account: I_AccountBase;
    ask_account: I_AccountBase;
}

interface I_Market {
    id: string;
    name: string;
    order_types: string[];
    order_sides: string[];
    bid_types: string[];
    ask_types: string[];
    bid: {
        currency: string;
        min_total: string;
    };
    ask: {
        currency: string;
        min_total: string;
    };
    max_total: string;
    state: string;
}

interface I_Ticker {
    market: string;
    trade_date_kst: string;
    trade_time_kst: string;
    trade_price: number;
    timestamp: number;
}
