export default class AccountItem {
    constructor() {
        this.template = document.querySelector("#accountsItem");
    }
    toLocalStringRounded(value) {
        return Math.round(value).toLocaleString();
    }
    render(data) {
        if (!this.template) {
            console.error("Template is not found.");
            return null;
        }
        const { avg_buy_price, buy_price, currency, unit_currency, volume, trade_price, } = data;
        const difference = trade_price - avg_buy_price;
        const gainsLosses = difference * volume;
        const appraisalPrice = buy_price + gainsLosses;
        const returnRate = (difference / avg_buy_price) * 100;
        const values = {
            h3: currency,
            ".volume": volume.toString(),
            ".avgBuyPrice .value": this.toLocalStringRounded(avg_buy_price),
            ".buyPrice .value": this.toLocalStringRounded(buy_price),
            ".gainsLosses .value": this.toLocalStringRounded(gainsLosses),
            ".returnRate .value": returnRate.toFixed(2),
            ".appraisalPrice .value": this.toLocalStringRounded(appraisalPrice),
        };
        const template = this.template.content.firstElementChild;
        const element = template === null || template === void 0 ? void 0 : template.cloneNode(true);
        for (const [selector, value] of Object.entries(values)) {
            element.querySelector(selector).textContent = value;
        }
        element.querySelectorAll(".unit").forEach((el) => {
            el.textContent = unit_currency;
        });
        return element;
    }
}
//# sourceMappingURL=AccountItem.js.map