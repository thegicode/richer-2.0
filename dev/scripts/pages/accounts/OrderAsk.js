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
class OrderAsk {
    constructor(market, askButton, parentElement, tradePrice, avg_buy_price) {
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
        var _a;
        const template = (_a = this.template) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
        const element = template === null || template === void 0 ? void 0 : template.cloneNode(true);
        this.renderOrder(element);
        this.removeOrder(element);
        this.parentElement.appendChild(element);
    }
    renderOrder(element) {
        return __awaiter(this, void 0, void 0, function* () {
            this.askButton.disabled = true;
            const marketName = this.market;
            const data = yield fetchData("/getChance", marketName);
            const { ask_fee, market, ask_account } = data;
            const { currency, balance, locked, avg_buy_price, avg_buy_price_modified, unit_currency, } = ask_account;
            const askPrice = this.avgBuyPrice + this.avgBuyPrice * 0.1;
            element.querySelector(".balance .value").textContent = balance;
            element.querySelector(".balance .unit").textContent = unit_currency;
            element.querySelector(".askPrice input").value =
                askPrice.toString();
        });
    }
    removeOrder(element) {
        const closeButton = element === null || element === void 0 ? void 0 : element.querySelector(".closeButton");
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener("click", () => {
            this.parentElement.removeChild(element);
            this.askButton.disabled = false;
        });
    }
}
export { OrderAsk };
//# sourceMappingURL=OrderAsk.js.map