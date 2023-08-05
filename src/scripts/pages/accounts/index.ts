import AccountItem from "./AccountItem";

class Accounts {
    constructor() {
        this.getAccounts();
    }

    private getAccounts() {
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

    private getTickers(myAccounts: Account[]) {
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

    private renderTickers(myAccounts: Account[], tickers: Ticker[]) {
        const data = myAccounts.map((account, index) => {
            const { trade_price } = tickers[index];

            // if (market.includes(account.currency) === false) return;
            return {
                ...account,
                trade_price,
            };
        });

        this.renderAccounts(data);
    }

    private renderAccounts(myAccounts: AccountExtend[]) {
        const accountItem = new AccountItem();
        const fragment = new DocumentFragment();

        myAccounts
            .map((account) => accountItem.render(account))
            .forEach((element) => fragment.appendChild(element));

        document.querySelector("ul")?.appendChild(fragment);
    }
}

new Accounts();
