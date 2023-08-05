import AccountItem from "./AccountItem";
class Accounts {
    constructor() {
        this.getAccounts();
    }
    getAccounts() {
        fetch(`/getAccounts`, {
            method: "GET",
        })
            .then((data) => data.json())
            .then((response) => {
            this.getTickers(response);
        })
            .catch((error) => {
            console.warn(error instanceof Error ? error.message : error);
        });
    }
    getTickers(myAccounts) {
        fetch(`/getTickers`, {
            method: "GET",
        })
            .then((data) => data.json())
            .then((response) => {
            this.renderTickers(myAccounts, response);
        })
            .catch((error) => {
            console.warn(error instanceof Error ? error.message : error);
        });
    }
    renderTickers(myAccounts, tickers) {
        const data = myAccounts.map((account, index) => {
            const { trade_price } = tickers[index];
            return Object.assign(Object.assign({}, account), { trade_price });
        });
        this.renderAccounts(data);
    }
    renderAccounts(myAccounts) {
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