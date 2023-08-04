export default class AccountItem {
    private template: HTMLTemplateElement | null;

    constructor() {
        this.template = document.querySelector("#accountsItem");
    }

    render(data: Account) {
        // console.log(this.template);
        // console.log(data);

        const {
            // avg_buy_price,
            // avg_buy_price_modified,
            // balance,
            // buy_price,
            currency,
            // locked,
            // unit_currency,
            // volume,
        } = data;

        const template = this.template?.content.firstElementChild;
        const element = template?.cloneNode(true) as HTMLElement;
        element.querySelector("th")!.textContent = currency;

        return element;
    }
}
