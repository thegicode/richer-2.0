export default class AccountItem {
    private template: HTMLTemplateElement | null;

    constructor() {
        this.template = document.querySelector("#accountsItem");
    }

    render(data: Account) {
        // console.log(this.template);
        // console.log(data);

        const {
            avg_buy_price,
            // avg_buy_price_modified,
            // balance,
            buy_price,
            currency,
            // locked,
            unit_currency,
            volume,
        } = data;

        const template = this.template?.content.firstElementChild;
        const element = template?.cloneNode(true) as HTMLElement;
        element.querySelector("h3")!.textContent = currency;
        element.querySelector(".volume")!.textContent = volume.toLocaleString();
        element.querySelector(
            ".avgBuyPrice"
        )!.textContent = `${avg_buy_price.toLocaleString()} ${unit_currency}`;
        element.querySelector(
            ".buyPrice"
        )!.textContent = `${buy_price.toLocaleString()}  ${unit_currency}`;

        return element;
    }
}
