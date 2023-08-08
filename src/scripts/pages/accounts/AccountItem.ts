import { OrderAsk } from "./OrderAsk";

export default class AccountItem {
    private template: HTMLTemplateElement | null;
    private market: string = "";
    private totalBuyAmount = 0; // 총 매수금액
    private totalGainsLosses = 0; // 총 평가손익

    constructor() {
        this.template = document.querySelector("#accountsItem");
    }

    private toLocalStringRounded(value: number): string {
        return Math.round(value).toLocaleString();
    }

    render(data: I_AccountItem): HTMLElement | null {
        if (!this.template) {
            console.error("Template is not found.");
            return null;
        }

        const {
            market,
            avg_buy_price, // 매수평균가
            // avg_buy_price_modified,  // 매수평균가 수정 여부
            // balance, // 주문가능 금액/수량
            buy_price,
            currency,
            // locked, // 주문 중 묶여있는 금액/수량
            unit_currency, // 평단가 기준 화폐
            volume, //  보유수량
            trade_price, // 현재 가격
        } = data;

        this.market = market;

        const difference = trade_price - avg_buy_price;
        const gainsLosses = difference * volume;
        const appraisalPrice = buy_price + gainsLosses;
        const returnRate = (difference / avg_buy_price) * 100;

        this.totalBuyAmount += buy_price;
        this.totalGainsLosses += gainsLosses;

        const values = {
            h3: currency,
            ".volume .value": volume.toString(),
            ".avgBuyPrice .value": this.toLocalStringRounded(avg_buy_price),
            ".buyPrice .value": this.toLocalStringRounded(buy_price),
            ".gainsLosses .value": this.toLocalStringRounded(gainsLosses),
            ".returnRate .value": returnRate.toFixed(2),
            ".appraisalPrice .value": this.toLocalStringRounded(appraisalPrice),
        };

        const template = this.template.content.firstElementChild;
        const element = template?.cloneNode(true) as HTMLElement;

        for (const [selector, value] of Object.entries(values)) {
            element.querySelector(selector)!.textContent = value;
        }

        element.querySelectorAll(".unit").forEach((el) => {
            el.textContent = unit_currency;
        });

        this.handleOrder(element, trade_price, avg_buy_price);

        return element;
    }

    handleOrder(
        element: HTMLElement,
        trade_price: number,
        avg_buy_price: number
    ) {
        const askButton = element.querySelector(
            ".askButton"
        ) as HTMLButtonElement;
        new OrderAsk(
            this.market,
            askButton,
            element,
            trade_price,
            avg_buy_price
        );
    }

    overviewAssets(asset: I_Asset) {
        const { balance, locked } = asset;
        const amount = Number(balance) + Number(locked); // 보유 KRW
        const totalAmount = this.totalBuyAmount + amount; // 총 보유자산
        const totalAppraisalPrice = this.totalBuyAmount + this.totalGainsLosses; // 총 평가금액
        const totalReturnRate =
            (this.totalGainsLosses / this.totalBuyAmount) * 100; // 총 평가수익률

        const values = {
            ".asset-amount .value": Math.round(amount).toLocaleString(),
            ".totalAmount .value": Math.round(totalAmount).toLocaleString(),
            ".totalBuyAmount .value": Math.round(
                this.totalBuyAmount
            ).toLocaleString(),
            ".totalGainsLosses .value": Math.round(
                this.totalGainsLosses
            ).toLocaleString(),
            ".totalAppraisalPrice .value":
                Math.round(totalAppraisalPrice).toLocaleString(),
            ".totalReturnRate .value": totalReturnRate.toFixed(2),
        };

        for (const [selector, value] of Object.entries(values)) {
            document.querySelector(selector)!.textContent = value;
        }
    }
}
