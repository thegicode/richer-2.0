import AccountItem from "./AccountItem";

class AccountManager {
    constructor() {
        this.initializeAccounts();
    }

    private async fetchData(url: string) {
        try {
            const response = await fetch(url, { method: "GET" });
            const data = await response.json();
            return data;
        } catch (error) {
            console.warn(error instanceof Error ? error.message : error);
        }
    }

    private async initializeAccounts() {
        const { krwAsset, myMarkets } = await this.fetchData("/getAccounts");
        this.updateAccountsWithTickers(myMarkets, krwAsset);
    }

    private async updateAccountsWithTickers(
        myAccounts: Account[],
        krwAsset: Asset
    ) {
        const tickers = await this.fetchData("/getTickers");
        const chance = await this.fetchData("/getChance");

        console.log(chance);

        this.combineAccountsWithTickers(myAccounts, tickers, krwAsset);
    }

    private combineAccountsWithTickers(
        myAccounts: Account[],
        ticekrs: Ticker[],
        krwAsset: Asset
    ) {
        if (!myAccounts) this.displayAccountsFail();

        const data = myAccounts.map((account, index) => {
            const { trade_price } = ticekrs[index];
            return {
                ...account,
                trade_price,
            };
        });

        this.displayAccounts(data, krwAsset);
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
            "자료를 받아오지 못했습니다. ";
    }
}

new AccountManager();
