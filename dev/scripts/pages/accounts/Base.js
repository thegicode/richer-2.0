export default class Base {
    constructor() {
        this.getAccounts();
    }
    getAccounts() {
        fetch(`/getAccounts`, {
            method: "GET",
        })
            .then((data) => data.json())
            .then((response) => {
            console.log("response", response);
        })
            .catch((e) => {
            console.error(e);
        });
    }
}
//# sourceMappingURL=Base.js.map