export default class AccountItem {
    private template: HTMLTemplateElement | null;

    constructor() {
        this.template = document.querySelector("#accountsItem");
    }

    private toLocalStringRounded(value: number): string {
        return Math.round(value).toLocaleString();
    }

    render(data: AccountExtend): HTMLElement | null {
        if (!this.template) {
            console.error("Template is not found.");
            return null;
        }

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
        const element = template?.cloneNode(true) as HTMLElement;

        for (const [selector, value] of Object.entries(values)) {
            element.querySelector(selector)!.textContent = value;
        }

        element.querySelectorAll(".unit").forEach((el) => {
            el.textContent = unit_currency;
        });

        return element;
    }
}
