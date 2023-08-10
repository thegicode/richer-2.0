var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetchData from "@src/scripts/utils/fetchData";
class SellOrder {
    constructor(market, askButton, parentElement, tradePrice, avg_buy_price) {
        this.market = market;
        this.askButton = askButton;
        this.parentElement = parentElement;
        this.template = document.querySelector("#sellOrder");
        this.tradePrice = tradePrice;
        this.avgBuyPrice = avg_buy_price;
        this.data = null;
        this.iniitialize();
    }
    iniitialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({
                market: this.market,
            }).toString();
            const data = yield fetchData("/getChance", params);
            this.data = data;
            const { balance } = data.ask_account;
            if (Number(balance) === 0) {
                this.askButton.remove();
                return;
            }
            this.askButton.addEventListener("click", this.show.bind(this));
        });
    }
    show() {
        var _a;
        const template = (_a = this.template) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
        const element = template === null || template === void 0 ? void 0 : template.cloneNode(true);
        this.render(element);
        this.addEvent(element);
        this.remove(element);
        this.parentElement.appendChild(element);
    }
    render(element) {
        if (!this.data)
            return;
        this.askButton.disabled = true;
        const data = this.data;
        const { ask_fee, market, ask_account } = data;
        const { currency, balance, unit_currency, } = ask_account;
        const { ask } = market;
        element.querySelectorAll("dl .unit").forEach((el) => {
            el.textContent = unit_currency;
        });
        element.querySelectorAll(".market-unit").forEach((el) => {
            el.textContent = currency;
        });
        element.querySelector(".orderAvailable .value").textContent =
            balance.toString();
        element.querySelector(".sellOrder-memo .minTotal .value").textContent =
            ask.min_total;
        element.querySelector(".sellOrder-memo .fee .value").textContent =
            ask_fee;
    }
    addEvent(element) {
        var _a, _b;
        if (!this.data)
            return;
        const { balance } = this.data.ask_account;
        const sellPriceInput = element.querySelector(".sellPrice input");
        const orderQuantityInput = element.querySelector(".orderQuantity input");
        const totalOrderAmountInput = element.querySelector(".totalOrderAmount input");
        const sellPriceRadios = element.querySelectorAll("input[name='sellPrice-rate']");
        const sellPriceOptioonInput = element.querySelector("input[name='sellPrcie-rate-input']");
        const cautionElement = element.querySelector(".sellOrder-caution");
        const submitButton = element.querySelector("button[type='submit']");
        const validate = () => {
            if (sellPriceInput.value &&
                orderQuantityInput.value &&
                totalOrderAmountInput.value)
                submitButton.disabled = false;
            else
                submitButton.disabled = true;
        };
        const fromSellPriceToTotalOrderAmount = () => {
            if (orderQuantityInput.value) {
                totalOrderAmountInput.value = (Number(sellPriceInput.value) *
                    Number(orderQuantityInput.value)).toString();
            }
            validate();
        };
        const sellPriceByRate = (rate) => {
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
            const checkedInput = document.querySelector("input[name='sellPrice-rate']:checked");
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
            }
            else {
                cautionElement.textContent = "주문 가능 수량 초과입니다. ";
                cautionElement.hidden = false;
            }
            validate();
        });
        totalOrderAmountInput.addEventListener("input", () => {
            const quantity = Number(totalOrderAmountInput.value) /
                Number(sellPriceInput.value);
            if (quantity < balance) {
                orderQuantityInput.value = quantity.toString();
                cautionElement.textContent = "";
                cautionElement.hidden = true;
            }
            else {
                cautionElement.textContent = "주문 가능 수량 초과입니다.";
                cautionElement.hidden = false;
            }
            validate();
        });
        (_a = element
            .querySelector("form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const params = new URLSearchParams({
                market: this.market,
                side: "ask",
                volume: orderQuantityInput.value,
                price: sellPriceInput.value,
                ord_type: "limit",
            }).toString();
            const reponse = yield fetchData("/getOrders", params);
            console.log(reponse);
        }));
        (_b = element.querySelector("form")) === null || _b === void 0 ? void 0 : _b.addEventListener("reset", () => {
            submitButton.disabled = true;
        });
    }
    remove(element) {
        const closeButton = element === null || element === void 0 ? void 0 : element.querySelector(".closeButton");
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener("click", () => {
            this.parentElement.removeChild(element);
            this.askButton.disabled = false;
        });
    }
}
export { SellOrder };
//# sourceMappingURL=SellOrder.js.map