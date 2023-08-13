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
        const cautionElement = element.querySelector(
            ".sellOrder-caution"
        ) as HTMLElement;

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
                cautionElement.textContent = "";
                cautionElement.hidden = true;
            } else {
                cautionElement.textContent = "주문 가능 수량 초과입니다. ";
                cautionElement.hidden = false;
                // orderQuantityInput.value = "";
            }
            validate();
        });

        totalOrderAmountInput.addEventListener("input", () => {
            const quantity =
                Number(totalOrderAmountInput.value) /
                Number(sellPriceInput.value);
            if (quantity < balance) {
                orderQuantityInput.value = quantity.toString();
                cautionElement.textContent = "";
                cautionElement.hidden = true;
            } else {
                cautionElement.textContent = "주문 가능 수량 초과입니다.";
                cautionElement.hidden = false;
                // orderQuantityInput.value = "";
                // totalOrderAmountInput.value = "";
            }
            validate();
        });

        element
            .querySelector("form")
            ?.addEventListener("submit", async (event) => {
                event.preventDefault();
                const params = new URLSearchParams({
                    market: this.market,
                    side: "ask",
                    volume: orderQuantityInput.value,
                    price: sellPriceInput.value,
                    ord_type: "limit",
                }).toString();

                const reponse = await fetchData("/getOrders", params);
                console.log(reponse);
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

// 주문 결과
// {
//     "uuid": "b1d3dcfa-7c20-4990-bb9e-5f2f0b12075f",
//     "side": "ask",
//     "ord_type": "limit",
//     "price": "1005",
//     "state": "wait",
//     "market": "KRW-XRP",
//     "created_at": "2023-08-13T16:35:53.233626+09:00",
//     "volume": "5",
//     "remaining_volume": "5",
//     "reserved_fee": "0",
//     "remaining_fee": "0",
//     "paid_fee": "0",
//     "locked": "5",
//     "executed_volume": "0",
//     "trades_count": 0
// }
