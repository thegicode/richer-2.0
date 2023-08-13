import AccountItem from "./AccountItem";
import fetchData from "@src/scripts/utils/fetchData";

class AccountManager {
    constructor() {
        this.initializeAccounts();

        // this.orderDelete();
    }

    private async orderDelete() {
        const params = new URLSearchParams({
            uuid: "b1d3dcfa-7c20-4990-bb9e-5f2f0b12075f",
        }).toString();

        const deleted = await fetchData("/delete", params);
        console.log("deleted", deleted);
    }

    private async initializeAccounts() {
        const { krwAsset, myMarkets } = await fetchData("/getAccounts");
        this.updateAccountsWithTickers(myMarkets, krwAsset);
    }

    private async updateAccountsWithTickers(
        myAccounts: I_MyAccount[],
        krwAsset: I_Asset
    ) {
        const tickers = await fetchData("/getTickers");

        this.combineAccountsWithTickers(myAccounts, tickers, krwAsset);
    }

    private combineAccountsWithTickers(
        myAccounts: I_MyAccount[],
        ticekrs: I_Ticker[],
        krwAsset: I_Asset
    ) {
        try {
            const data = myAccounts.map((account, index) => {
                const { trade_price } = ticekrs[index];
                return {
                    ...account,
                    trade_price,
                };
            });

            this.displayAccounts(data, krwAsset);
        } catch (error) {
            console.error(error instanceof Error ? error.message : error);
            this.displayAccountsFail();
        }
    }

    private displayAccounts(myAccounts: I_AccountItem[], krwAsset: I_Asset) {
        const accountItem = new AccountItem();
        const fragment = new DocumentFragment();

        myAccounts
            .map((account) => accountItem.render(account))
            .forEach((element) => fragment.appendChild(element!));

        document.querySelector(".accounts-list")?.appendChild(fragment);

        accountItem.overviewAssets(krwAsset);
    }

    private displayAccountsFail() {
        document.querySelector(".assets-overview")!.textContent =
            "자료를 가져오지 못했습니다.";
    }
}

new AccountManager();
