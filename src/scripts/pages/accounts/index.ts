import AccountItem from "./AccountItem";

class Accounts {
    constructor() {
        this.getFetch();
    }

    private getFetch() {
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

    private renderList(myAccounts: Account[]) {
        const accountItem = new AccountItem();
        const fragment = new DocumentFragment();

        myAccounts
            .map((account) => accountItem.render(account))
            .forEach((element) => fragment.appendChild(element));

        document.querySelector("tbody")?.appendChild(fragment);
    }
}

new Accounts();
