export default class AccountItem {
    constructor() {
        this.template = document.querySelector("#accountsItem");
    }
    render(data) {
        var _a;
        const { avg_buy_price, buy_price, currency, unit_currency, volume, } = data;
        const template = (_a = this.template) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
        const element = template === null || template === void 0 ? void 0 : template.cloneNode(true);
        element.querySelector("h3").textContent = currency;
        element.querySelector(".volume").textContent = volume.toLocaleString();
        element.querySelector(".avgBuyPrice").textContent = `${avg_buy_price.toLocaleString()} ${unit_currency}`;
        element.querySelector(".buyPrice").textContent = `${buy_price.toLocaleString()}  ${unit_currency}`;
        return element;
    }
}
//# sourceMappingURL=AccountItem.js.map