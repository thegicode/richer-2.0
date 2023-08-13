import fetchData from "@src/scripts/utils/fetchData";

class SellOrder {
    private market: string;
    private askButton: HTMLButtonElement;
    private parentElement: HTMLElement;
    private template: HTMLTemplateElement | null;
    private tradePrice: number;
    private avgBuyPrice: number;
    private balance: number;
    private minTotal: number;
    private data: I_ChanceResponse | null;
    private element: HTMLElement | null;
    private sellPriceInput: HTMLInputElement | null;
    private orderQuantityInput: HTMLInputElement | null;
    private totalOrderAmountInput: HTMLInputElement | null;

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
        this.balance = 0;
        this.minTotal = 0;
        this.data = null;
        this.element = null;
        this.sellPriceInput = null;
        this.orderQuantityInput = null;
        this.totalOrderAmountInput = null;

        this.iniitialize();
    }

    private async iniitialize() {
        const params = new URLSearchParams({
            market: this.market,
        }).toString();

        const data = await fetchData("/getChance", params);
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

        this.element = element;
        this.sellPriceInput = element.querySelector(
            ".sellPrice input"
        ) as HTMLInputElement;
        this.orderQuantityInput = element.querySelector(
            ".orderQuantity input"
        ) as HTMLInputElement;
        this.totalOrderAmountInput = element.querySelector(
            ".totalOrderAmount input"
        ) as HTMLInputElement;

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
        this.minTotal = Number(ask.min_total);

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

    private isFormValid(
        sellPrice: string,
        orderQuantity: string,
        totalOrderAmount: string
    ): boolean {
        const isQuantitiyTrue = Number(orderQuantity) <= this.balance;
        if (isQuantitiyTrue) {
            // cautionElement.hide()
        } else {
            // cautionElement.show("주문 가능 수량 초과)
            this.showCaution("주문 가능 수량 초과");
        }

        const isTotalPriceTrue = Number(totalOrderAmount) >= this.minTotal;
        if (isTotalPriceTrue) {
            // cautionElement.hide()
        } else {
            // cautionElement.show("최소 주문 가격 이하 ")
            this.showCaution("최소 주문 가격 이하 ");
        }

        const isValid =
            sellPrice && isQuantitiyTrue && isTotalPriceTrue ? true : false;
        if (isValid) {
            this.hideCaution();
        }
        return isValid;
    }

    private showCaution(message: string) {
        const cautionElement = this.element?.querySelector(
            ".sellOrder-caution"
        ) as HTMLElement;
        cautionElement.textContent = message;
        cautionElement.hidden = false;
    }

    private hideCaution() {
        const cautionElement = this.element?.querySelector(
            ".sellOrder-caution"
        ) as HTMLElement;
        cautionElement.textContent = "";
        cautionElement.hidden = true;
    }

    private setTotalPrice() {
        this.totalOrderAmountInput!.value = (
            Number(this.sellPriceInput?.value) *
            Number(this.orderQuantityInput?.value)
        ).toString();
    }

    private updateSubmitButtonState(element: HTMLElement) {
        const submitButton = element.querySelector(
            "button[type='submit']"
        ) as HTMLButtonElement;

        submitButton.disabled = !this.isFormValid(
            this.sellPriceInput!.value,
            this.orderQuantityInput!.value,
            this.totalOrderAmountInput!.value
        );
    }

    private setSellPriceLast(element: HTMLElement, price: number) {
        const remainder = price % 5;
        let step = 1;

        if (price > 1000) {
            if (remainder >= 2.5) {
                price += 5 - remainder;
            } else {
                price -= remainder;
            }
            step = 5;
        } else {
            price = Math.round(price);
        }

        this.sellPriceInput?.setAttribute("step", step.toString());
        this.sellPriceInput!.value = price.toString();
    }

    private addEvent(element: HTMLElement) {
        if (!this.data) return;

        const { balance } = this.data.ask_account;
        this.balance = balance;
        const sellPriceRadios: NodeListOf<HTMLInputElement> =
            element.querySelectorAll("input[name='sellPrice-rate']");
        const sellPriceEtcInput = element.querySelector(
            "input[name='sellPrcie-rate-etc']"
        ) as HTMLInputElement;

        const submitButton = element.querySelector(
            "button[type='submit']"
        ) as HTMLButtonElement;

        this.sellPriceInput!.value = this.tradePrice.toString();

        // Events
        this.sellPriceInput?.addEventListener("input", () => {
            this.setSellPriceLast(element, Number(this.sellPriceInput!.value));
            this.setTotalPrice();
            this.updateSubmitButtonState(element);
        });

        sellPriceRadios.forEach((radio) => {
            radio.addEventListener("change", () => {
                sellPriceEtcInput.value = "";
                const price =
                    this.tradePrice + this.tradePrice * Number(radio.value);
                this.setSellPriceLast(element, price);
                this.setTotalPrice();
                this.updateSubmitButtonState(element);
            });
        });

        sellPriceEtcInput.addEventListener("input", () => {
            const rate = Number(sellPriceEtcInput.value) / 100;
            const price = this.tradePrice + this.tradePrice * rate;
            this.setSellPriceLast(element, price);
            this.setTotalPrice();
            this.updateSubmitButtonState(element);
        });

        this.orderQuantityInput?.addEventListener("input", () => {
            const quantity = Number(this.orderQuantityInput!.value);

            const result = quantity * Number(this.sellPriceInput!.value);
            this.totalOrderAmountInput!.value = Math.round(result).toString();

            this.setTotalPrice();
            this.updateSubmitButtonState(element);
        });

        this.totalOrderAmountInput!.addEventListener("input", () => {
            const quantity =
                Number(this.totalOrderAmountInput!.value) /
                Number(this.sellPriceInput!.value);
            this.orderQuantityInput!.value = quantity.toString();

            this.updateSubmitButtonState(element);
        });

        element
            .querySelector("form")
            ?.addEventListener("submit", async (event) => {
                event.preventDefault();

                const params = new URLSearchParams({
                    market: this.market,
                    side: "ask",
                    volume: this.orderQuantityInput!.value,
                    price: this.sellPriceInput!.value,
                    ord_type: "limit",
                }).toString();

                // const reponse = await fetchData("/getOrders", params);
                // console.log(reponse);
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

// {
//     "uuid": "c32a1c52-6c92-4a49-8a4d-59fb2a3b1d5a",
//     "side": "ask",
//     "ord_type": "limit",
//     "price": "1005",
//     "state": "wait",
//     "market": "KRW-XRP",
//     "created_at": "2023-08-13T19:17:47.087004+09:00",
//     "volume": "5",
//     "remaining_volume": "5",
//     "reserved_fee": "0",
//     "remaining_fee": "0",
//     "paid_fee": "0",
//     "locked": "5",
//     "executed_volume": "0",
//     "trades_count": 0
// }
