import fetchData from "@src/scripts/utils/fetchData";

class SellOrder {
    private market: string;
    private askButton: HTMLButtonElement;
    private parentElement: HTMLElement;
    private template: HTMLTemplateElement | null;
    private tradePrice: number;
    private avgBuyPrice: number;
    private data: I_ChanceResponse | null;

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
        this.template = document.querySelector("#sellOrder");
        this.tradePrice = tradePrice;
        this.avgBuyPrice = avg_buy_price;
        this.data = null;

        this.iniitialize();
    }

    private async iniitialize() {
        const marketName = this.market;
        const data = await fetchData("/getChance", marketName);
        this.data = data;

        const { balance } = data.ask_account;
        if (Number(balance) === 0) {
            this.askButton.remove();
            return;
        }

        this.askButton.addEventListener("click", this.show.bind(this));
    }

    private show() {
        const template = this.template?.content.firstElementChild;
        const element = template?.cloneNode(true) as HTMLElement;

        this.render(element);
        this.addEvent(element);
        this.remove(element);

        this.parentElement.appendChild(element);
    }

    private render(element: HTMLElement) {
        if (!this.data) return;

        this.askButton.disabled = true;

        const data = this.data;
        const { ask_fee, market, ask_account } = data;
        const {
            currency,
            balance,
            // locked,
            // avg_buy_price,
            // avg_buy_price_modified,
            unit_currency,
        } = ask_account;
        const { ask } = market;

        element.querySelectorAll("dl .unit").forEach((el) => {
            el.textContent = unit_currency;
        });
        element.querySelectorAll(".market-unit").forEach((el) => {
            el.textContent = currency;
        });

        element.querySelector(".orderAvailable .value")!.textContent =
            balance.toString();

        element.querySelector(".sellOrder-memo .minTotal .value")!.textContent =
            ask.min_total;
        element.querySelector(".sellOrder-memo .fee .value")!.textContent =
            ask_fee;
    }

    private addEvent(element: HTMLElement) {
        if (!this.data) return;
        const { balance } = this.data.ask_account;

        const sellPriceInput = element.querySelector(
            ".sellPrice input"
        ) as HTMLInputElement;
        const orderQuantityInput = element.querySelector(
            ".orderQuantity input"
        ) as HTMLInputElement;
        const totalOrderAmountInput = element.querySelector(
            ".totalOrderAmount input"
        ) as HTMLInputElement;
        const sellPriceRadios: NodeListOf<HTMLInputElement> =
            element.querySelectorAll("input[name='sellPrice-rate']");
        const sellPriceOptioonInput = element.querySelector(
            "input[name='sellPrcie-rate-input']"
        ) as HTMLInputElement;

        const submitButton = element.querySelector(
            "button[type='submit']"
        ) as HTMLButtonElement;
        // const resetButton = element.querySelector(
        //     "button[type='reset']"
        // ) as HTMLButtonElement;

        const validate = () => {
            if (
                sellPriceInput.value &&
                orderQuantityInput.value &&
                totalOrderAmountInput.value
            )
                submitButton.disabled = false;
            else submitButton.disabled = true;
        };

        const fromSellPriceToTotalOrderAmount = () => {
            if (orderQuantityInput.value) {
                totalOrderAmountInput.value = (
                    Number(sellPriceInput.value) *
                    Number(orderQuantityInput.value)
                ).toString();
            }
            validate();
        };

        const sellPriceByRate = (rate: number) => {
            const price = this.tradePrice + this.tradePrice * rate;
            sellPriceInput.value = price.toString();
            fromSellPriceToTotalOrderAmount();
        };

        sellPriceInput.value = this.tradePrice.toString();

        sellPriceInput.addEventListener("input", () => {
            fromSellPriceToTotalOrderAmount();
        });

        sellPriceRadios.forEach((radio) => {
            radio.addEventListener("change", () => {
                sellPriceOptioonInput.value = "";
                const { checked, value } = radio;
                if (checked) {
                    sellPriceByRate(Number(value));
                }
            });
        });

        sellPriceOptioonInput.addEventListener("input", () => {
            const checkedInput = document.querySelector(
                "input[name='sellPrice-rate']:checked"
            ) as HTMLInputElement;
            if (checkedInput) {
                checkedInput.checked = false;
            }
            const rate = Number(sellPriceOptioonInput.value) / 100;
            sellPriceByRate(rate);
        });

        orderQuantityInput.addEventListener("input", () => {
            const quantity = Number(orderQuantityInput.value);
            if (quantity < balance) {
                const result = quantity * Number(sellPriceInput.value);
                totalOrderAmountInput.value = Math.round(result).toString();
            } else {
                alert("주문 가능 수량 초과입니다. ");
                orderQuantityInput.value = "";
            }
            validate();
        });

        totalOrderAmountInput.addEventListener("input", () => {
            const quantity =
                Number(totalOrderAmountInput.value) /
                Number(sellPriceInput.value);
            if (quantity < balance) {
                orderQuantityInput.value = quantity.toString();
            } else {
                alert("주문 가능 수량 초과입니다. ");
                orderQuantityInput.value = "";
            }
            validate();
        });

        element.querySelector("form")?.addEventListener("submit", (event) => {
            event.preventDefault();
        });

        element.querySelector("form")?.addEventListener("reset", () => {
            submitButton.disabled = true;
        });
    }

    private remove(element: HTMLElement) {
        const closeButton = element?.querySelector(".closeButton");
        closeButton?.addEventListener("click", () => {
            this.parentElement.removeChild(element);
            this.askButton.disabled = false;
        });
    }
}

export { SellOrder };
