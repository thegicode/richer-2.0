import AccountItem from "./AccountItem";

class Accounts {
    constructor() {
        this.getAccounts();
        this.getTickers();
    }

    private getAccounts() {
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

    private getTickers() {
        fetch(`/getTickers`, {
            method: "GET",
        })
            .then((data) => data.json())
            .then((response) => {
                console.log("getTickers", response);
            })
            .catch((error) => {
                console.warn(error instanceof Error ? error.message : error);
            });
    }

    private renderList(myAccounts: Account[]) {
        const accountItem = new AccountItem();
        const fragment = new DocumentFragment();

        myAccounts
            .map((account) => accountItem.render(account))
            .forEach((element) => fragment.appendChild(element));

        document.querySelector("ul")?.appendChild(fragment);
    }
}

new Accounts();
