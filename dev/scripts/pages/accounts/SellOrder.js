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
        this.balance = 0;
        this.minTotal = 0;
        this.data = null;
        this.element = null;
        this.sellPriceInput = null;
        this.orderQuantityInput = null;
        this.totalOrderAmountInput = null;
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
        this.element = element;
        this.sellPriceInput = element.querySelector(".sellPrice input");
        this.orderQuantityInput = element.querySelector(".orderQuantity input");
        this.totalOrderAmountInput = element.querySelector(".totalOrderAmount input");
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
        this.minTotal = Number(ask.min_total);
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
    isFormValid(sellPrice, orderQuantity, totalOrderAmount) {
        const isQuantitiyTrue = Number(orderQuantity) <= this.balance;
        if (isQuantitiyTrue) {
        }
        else {
            this.showCaution("주문 가능 수량 초과");
        }
        const isTotalPriceTrue = Number(totalOrderAmount) >= this.minTotal;
        if (isTotalPriceTrue) {
        }
        else {
            this.showCaution("최소 주문 가격 이하 ");
        }
        const isValid = sellPrice && isQuantitiyTrue && isTotalPriceTrue ? true : false;
        if (isValid) {
            this.hideCaution();
        }
        return isValid;
    }
    showCaution(message) {
        var _a;
        const cautionElement = (_a = this.element) === null || _a === void 0 ? void 0 : _a.querySelector(".sellOrder-caution");
        cautionElement.textContent = message;
        cautionElement.hidden = false;
    }
    hideCaution() {
        var _a;
        const cautionElement = (_a = this.element) === null || _a === void 0 ? void 0 : _a.querySelector(".sellOrder-caution");
        cautionElement.textContent = "";
        cautionElement.hidden = true;
    }
    setTotalPrice() {
        var _a, _b;
        this.totalOrderAmountInput.value = (Number((_a = this.sellPriceInput) === null || _a === void 0 ? void 0 : _a.value) *
            Number((_b = this.orderQuantityInput) === null || _b === void 0 ? void 0 : _b.value)).toString();
    }
    updateSubmitButtonState(element) {
        const submitButton = element.querySelector("button[type='submit']");
        submitButton.disabled = !this.isFormValid(this.sellPriceInput.value, this.orderQuantityInput.value, this.totalOrderAmountInput.value);
    }
    setSellPriceLast(element, price) {
        var _a;
        const remainder = price % 5;
        let step = 1;
        if (price > 1000) {
            if (remainder >= 2.5) {
                price += 5 - remainder;
            }
            else {
                price -= remainder;
            }
            step = 5;
        }
        else {
            price = Math.round(price);
        }
        (_a = this.sellPriceInput) === null || _a === void 0 ? void 0 : _a.setAttribute("step", step.toString());
        this.sellPriceInput.value = price.toString();
    }
    addEvent(element) {
        var _a, _b, _c, _d;
        if (!this.data)
            return;
        const { balance } = this.data.ask_account;
        this.balance = balance;
        const sellPriceRadios = element.querySelectorAll("input[name='sellPrice-rate']");
        const sellPriceEtcInput = element.querySelector("input[name='sellPrcie-rate-etc']");
        const submitButton = element.querySelector("button[type='submit']");
        this.sellPriceInput.value = this.tradePrice.toString();
        (_a = this.sellPriceInput) === null || _a === void 0 ? void 0 : _a.addEventListener("input", () => {
            this.setSellPriceLast(element, Number(this.sellPriceInput.value));
            this.setTotalPrice();
            this.updateSubmitButtonState(element);
        });
        sellPriceRadios.forEach((radio) => {
            radio.addEventListener("change", () => {
                sellPriceEtcInput.value = "";
                const price = this.tradePrice + this.tradePrice * Number(radio.value);
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
        (_b = this.orderQuantityInput) === null || _b === void 0 ? void 0 : _b.addEventListener("input", () => {
            const quantity = Number(this.orderQuantityInput.value);
            const result = quantity * Number(this.sellPriceInput.value);
            this.totalOrderAmountInput.value = Math.round(result).toString();
            this.setTotalPrice();
            this.updateSubmitButtonState(element);
        });
        this.totalOrderAmountInput.addEventListener("input", () => {
            const quantity = Number(this.totalOrderAmountInput.value) /
                Number(this.sellPriceInput.value);
            this.orderQuantityInput.value = quantity.toString();
            this.updateSubmitButtonState(element);
        });
        (_c = element
            .querySelector("form")) === null || _c === void 0 ? void 0 : _c.addEventListener("submit", (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const params = new URLSearchParams({
                market: this.market,
                side: "ask",
                volume: this.orderQuantityInput.value,
                price: this.sellPriceInput.value,
                ord_type: "limit",
            }).toString();
        }));
        (_d = element.querySelector("form")) === null || _d === void 0 ? void 0 : _d.addEventListener("reset", () => {
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