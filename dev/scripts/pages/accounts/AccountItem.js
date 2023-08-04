export default class AccountItem {
    constructor() {
        this.template = document.querySelector("#accountsItem");
    }
    render(data) {
        var _a;
        const { currency, } = data;
        const template = (_a = this.template) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
        const element = template === null || template === void 0 ? void 0 : template.cloneNode(true);
        element.querySelector("th").textContent = currency;
        return element;
    }
}
//# sourceMappingURL=AccountItem.js.map