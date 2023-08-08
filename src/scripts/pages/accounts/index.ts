import AccountItem from "./AccountItem";
import fetchData from "@src/scripts/utils/fetchData";

class AccountManager {
    constructor() {
        this.initializeAccounts();
    }

    private async initializeAccounts() {
        const { krwAsset, myMarkets } = await fetchData("/getAccounts");
        this.updateAccountsWithTickers(myMarkets, krwAsset);
    }

    private async updateAccountsWithTickers(
        myAccounts: Account[],
        krwAsset: Asset
    ) {
        const tickers = await fetchData("/getTickers");

        this.combineAccountsWithTickers(myAccounts, tickers, krwAsset);
    }

    private combineAccountsWithTickers(
        myAccounts: Account[],
        ticekrs: Ticker[],
        krwAsset: Asset
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

    private displayAccounts(myAccounts: AccountExtend[], krwAsset: Asset) {
        const accountItem = new AccountItem();
        const fragment = new DocumentFragment();

        myAccounts
            .map((account) => accountItem.render(account))
            .forEach((element) => fragment.appendChild(element!));

        document.querySelector(".accountsList")?.appendChild(fragment);

        accountItem.tradeAsset(krwAsset);
    }

    private displayAccountsFail() {
        document.querySelector(".tradeState")!.textContent =
            "자료를 가져오지 못했습니다.";
    }
}

new AccountManager();
