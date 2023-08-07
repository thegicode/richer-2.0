var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AccountItem from "./AccountItem";
class AccountManager {
    constructor() {
        this.initializeAccounts();
    }
    fetchData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(url, { method: "GET" });
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.warn(error instanceof Error ? error.message : error);
            }
        });
    }
    initializeAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield this.fetchData("/getAccounts");
            this.updateAccountsWithTickers(accounts);
        });
    }
    updateAccountsWithTickers(myAccounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const tickers = yield this.fetchData("/getTickers");
            this.combineAccountsWithTickers(myAccounts, tickers);
        });
    }
    combineAccountsWithTickers(myAccounts, ticekrs) {
        if (myAccounts.length === undefined)
            return;
        const data = myAccounts.map((account, index) => {
            const { trade_price } = ticekrs[index];
            return Object.assign(Object.assign({}, account), { trade_price });
        });
        this.displayAccounts(data);
    }
    displayAccounts(myAccounts) {
        var _a;
        const accountItem = new AccountItem();
        const fragment = new DocumentFragment();
        myAccounts
            .map((account) => accountItem.render(account))
            .forEach((element) => fragment.appendChild(element));
        (_a = document.querySelector("ul")) === null || _a === void 0 ? void 0 : _a.appendChild(fragment);
    }
}
new AccountManager();
//# sourceMappingURL=index.js.map