export default class AccountItem {
    private template: HTMLTemplateElement | null;

    constructor() {
        this.template = document.querySelector("#accountsItem");
    }

    render(data: AccountExtend) {
        const {
            avg_buy_price,
            // avg_buy_price_modified,
            // balance,
            buy_price,
            currency,
            // locked,
            unit_currency,
            volume,
            trade_price,
        } = data;

        const averageBuyPrice = Math.round(avg_buy_price);
        const currentPrice = Math.round(trade_price);
        const difference = currentPrice - averageBuyPrice;
        const gainsLosses = Math.round(difference * volume);
        const appraisalPrice = Math.round(buy_price) + gainsLosses;
        const returnRate = (difference / averageBuyPrice) * 100;

        const template = this.template?.content.firstElementChild;
        const element = template?.cloneNode(true) as HTMLElement;
        element.querySelector("h3")!.textContent = currency;
        element.querySelector(".volume")!.textContent = volume.toString();

        element.querySelector(
            ".avgBuyPrice .value"
        )!.textContent = `${averageBuyPrice.toLocaleString()}`;

        element.querySelector(".buyPrice .value")!.textContent = `${Math.round(
            buy_price
        ).toLocaleString()}`;

        element.querySelector(
            ".gainsLosses .value"
        )!.textContent = `${gainsLosses.toLocaleString()}`;

        element.querySelector(
            ".returnRate .value"
        )!.textContent = `${returnRate.toFixed(2)}`;

        element.querySelector(
            ".appraisalPrice .value"
        )!.textContent = `${appraisalPrice.toLocaleString()}`;

        element.querySelectorAll(".unit").forEach((el) => {
            el.textContent = unit_currency;
        });

        return element;
    }
}
