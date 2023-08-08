import fetchData from "@src/scripts/utils/fetchData";

class OrderAsk {
    private market: string;
    private askButton: HTMLButtonElement;
    private parentElement: HTMLElement;
    private template: HTMLTemplateElement | null;
    private tradePrice: number;
    private avgBuyPrice: number;

    constructor(
        market: string,
        askButton: HTMLButtonElement,
        parentElement: HTMLElement,
        tradePrice: number,
        avg_buy_price: number
    ) {
        this.market = market;
        this.askButton = askButton;
        this.parentElement = parentElement;
        this.template = document.querySelector("#askOrder");
        this.tradePrice = tradePrice;
        this.avgBuyPrice = avg_buy_price;

        this.iniitialize();
    }

    iniitialize() {
        this.askButton.addEventListener("click", this.onClick.bind(this));
    }

    onClick() {
        const template = this.template?.content.firstElementChild;
        const element = template?.cloneNode(true) as HTMLElement;

        this.renderOrder(element);
        this.removeOrder(element);

        this.parentElement.appendChild(element);
    }

    private async renderOrder(element: HTMLElement) {
        this.askButton.disabled = true;

        const marketName = this.market;

        const data = await fetchData("/getChance", marketName);

        const { ask_fee, market, ask_account } = data;
        const {
            currency,
            balance,
            locked,
            avg_buy_price,
            avg_buy_price_modified,
            unit_currency,
        } = ask_account;

        const askPrice = this.avgBuyPrice + this.avgBuyPrice * 0.1;

        element.querySelector(".balance .value")!.textContent = balance;
        element.querySelector(".balance .unit")!.textContent = unit_currency;
        (element.querySelector(".askPrice input") as HTMLInputElement).value =
            askPrice.toString();
    }

    private removeOrder(element: HTMLElement) {
        const closeButton = element?.querySelector(".closeButton");
        closeButton?.addEventListener("click", () => {
            this.parentElement.removeChild(element);
            this.askButton.disabled = false;
        });
    }
}

export { OrderAsk };
