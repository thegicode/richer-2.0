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
        const accounts = await this.fetchData("/getAccounts");
        this.updateAccountsWithTickers(accounts);
    }

    private async updateAccountsWithTickers(myAccounts: Account[]) {
        const tickers = await this.fetchData("/getTickers");
        this.combineAccountsWithTickers(myAccounts, tickers);
    }

    private combineAccountsWithTickers(
        myAccounts: Account[],
        ticekrs: Ticker[]
    ) {
        if (myAccounts.length === undefined) return;

        const data = myAccounts.map((account, index) => {
            const { trade_price } = ticekrs[index];
            return {
                ...account,
                trade_price,
            };
        });

        this.displayAccounts(data);
    }

    private displayAccounts(myAccounts: AccountExtend[]) {
        const accountItem = new AccountItem();
        const fragment = new DocumentFragment();

        myAccounts
            .map((account) => accountItem.render(account))
            .forEach((element) => fragment.appendChild(element!));

        document.querySelector("ul")?.appendChild(fragment);
    }
}

new AccountManager();
