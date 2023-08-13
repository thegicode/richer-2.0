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
import fetchData from "@src/scripts/utils/fetchData";
class AccountManager {
    constructor() {
        this.initializeAccounts();
        this.orderDelete();
    }
    orderDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({
                uuid: "c32a1c52-6c92-4a49-8a4d-59fb2a3b1d5a",
            }).toString();
            const deleted = yield fetchData("/delete", params);
            console.log("deleted", deleted);
        });
    }
    initializeAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const { krwAsset, myMarkets } = yield fetchData("/getAccounts");
            this.updateAccountsWithTickers(myMarkets, krwAsset);
        });
    }
    updateAccountsWithTickers(myAccounts, krwAsset) {
        return __awaiter(this, void 0, void 0, function* () {
            const tickers = yield fetchData("/getTickers");
            this.combineAccountsWithTickers(myAccounts, tickers, krwAsset);
        });
    }
    combineAccountsWithTickers(myAccounts, ticekrs, krwAsset) {
        try {
            const data = myAccounts.map((account, index) => {
                const { trade_price } = ticekrs[index];
                return Object.assign(Object.assign({}, account), { trade_price });
            });
            this.displayAccounts(data, krwAsset);
        }
        catch (error) {
            console.error(error instanceof Error ? error.message : error);
            this.displayAccountsFail();
        }
    }
    displayAccounts(myAccounts, krwAsset) {
        var _a;
        const accountItem = new AccountItem();
        const fragment = new DocumentFragment();
        myAccounts
            .map((account) => accountItem.render(account))
            .forEach((element) => fragment.appendChild(element));
        (_a = document.querySelector(".accounts-list")) === null || _a === void 0 ? void 0 : _a.appendChild(fragment);
        accountItem.overviewAssets(krwAsset);
    }
    displayAccountsFail() {
        document.querySelector(".assets-overview").textContent =
            "자료를 가져오지 못했습니다.";
    }
}
new AccountManager();
//# sourceMappingURL=index.js.map