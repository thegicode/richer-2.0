const { authorizationTokenBody } = require("../../env/token");

const UPBIT_URL = require("../../env/url");
const { getJSON } = require("../utils/apiRequest");

module.exports = async () => {
    const body = {
        market: "KRW-XRP",
    };

    const { query, token } = authorizationTokenBody(body);

    const options = {
        method: "GET",
        url: `${UPBIT_URL.orders_chance}?${query}`,
        headers: { Authorization: token },
        json: body,
    };

    return await getJSON(options);
};

// request(options, (error, response, body) => {
//     if (error) throw new Error(error);
//     console.log(body);
// });

/*
{
    bid_fee: '0.0005', // 매수 수수료 비율
    ask_fee: '0.0005',  // 매도 수수료 비율
    maker_bid_fee: '0.0005',
    maker_ask_fee: '0.0005',
    market: {
      id: 'KRW-BTC',    //  마켓의 유일 키
      name: 'BTC/KRW',  // 마켓 이름
      order_types: [ 'limit' ], // 지원 주문 방식 (만료)
      order_sides: [ 'ask', 'bid' ],    // 지원 주문 종류
      bid_types: [ 'limit', 'price' ],  // 매수 주문 지원 방식
      ask_types: [ 'limit', 'market' ], // 매도 주문 지원 방식
      bid: {                // 매수 시 제약사항
        currency: 'KRW',    // 화폐를 의미하는 영문 대문자 코드
        min_total: '5000'   // 최소 매도/매수 금액
        price_unin            // 주문금액 단위
        },  
      ask: {                // 매도 시 제약사항
        currency: 'BTC',    // 화폐를 의미하는 영문 대문자 코드
        min_total: '5000'   // 최소 매도/매수 금액
        price_unit          // 주문금액 단위
    },
      max_total: '1000000000',  // 최대 매도/매수 금액
      state: 'active'           // 마켓 운영 상태
    },
    bid_account: {              // 매수 시 사용하는 화폐의 계좌 상태
      currency: 'KRW',          // 화폐를 의미하는 영문 대문자 코드
      balance: '785163.34349258',   // 주문가능 금액/수량
      locked: '820409.85495687',    // 주문 중 묶여있는 금액/수량	
      avg_buy_price: '0',              // 매수평균가
      avg_buy_price_modified: true, // 매수평균가 수정 여부	
      unit_currency: 'KRW'          // 평단가 기준 화폐	
    },
    ask_account: {                  // 매도 시 사용하는 화폐의 계좌 상태
      currency: 'BTC',              // 화폐를 의미하는 영문 대문자 코드
      balance: '0',                 // 주문가능 금액/수량
      locked: '0.00102996',         // 주문 중 묶여있는 금액/수량
      avg_buy_price: '38836112.3733',   // 매수평균가
      avg_buy_price_modified: false,    // 매수평균가 수정 여부	
      unit_currency: 'KRW'              // 평단가 기준 화폐	
    }
  }
  */
