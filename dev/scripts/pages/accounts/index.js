import AccountItem from "./AccountItem";
class Accounts {
    constructor() {
        this.getFetch();
    }
    getFetch() {
        fetch(`/getAccounts`, {
            method: "GET",
        })
            .then((data) => data.json())
            .then((response) => {
            this.renderList(response);
        })
            .catch((error) => {
            console.warn(error instanceof Error ? error.message : error);
        });
    }
    renderList(myAccounts) {
        var _a;
        const accountItem = new AccountItem();
        const fragment = new DocumentFragment();
        myAccounts
            .map((account) => accountItem.render(account))
            .forEach((element) => fragment.appendChild(element));
        (_a = document.querySelector("ul")) === null || _a === void 0 ? void 0 : _a.appendChild(fragment);
    }
}
new Accounts();
//# sourceMappingURL=index.js.map