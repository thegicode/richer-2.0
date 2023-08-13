"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/scripts/utils/fetchData.ts
  async function fetchData(url, params) {
    try {
      const finalURL = params ? `${url}?${params}` : url;
      const response = await fetch(finalURL, { method: "GET" });
      return await response.json();
    } catch (error) {
      console.warn(error instanceof Error ? error.message : error);
    }
  }
  var fetchData_default;
  var init_fetchData = __esm({
    "src/scripts/utils/fetchData.ts"() {
      "use strict";
      fetchData_default = fetchData;
    }
  });

  // dev/scripts/pages/accounts/SellOrder.js
  var __awaiter, SellOrder;
  var init_SellOrder = __esm({
    "dev/scripts/pages/accounts/SellOrder.js"() {
      "use strict";
      init_fetchData();
      __awaiter = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      SellOrder = class {
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
              market: this.market
            }).toString();
            const data = yield fetchData_default("/getChance", params);
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
          const { currency, balance, unit_currency } = ask_account;
          const { ask } = market;
          this.minTotal = Number(ask.min_total);
          element.querySelectorAll("dl .unit").forEach((el) => {
            el.textContent = unit_currency;
          });
          element.querySelectorAll(".market-unit").forEach((el) => {
            el.textContent = currency;
          });
          element.querySelector(".orderAvailable .value").textContent = balance.toString();
          element.querySelector(".sellOrder-memo .minTotal .value").textContent = ask.min_total;
          element.querySelector(".sellOrder-memo .fee .value").textContent = ask_fee;
        }
        isFormValid(sellPrice, orderQuantity, totalOrderAmount) {
          const isQuantitiyTrue = Number(orderQuantity) <= this.balance;
          if (isQuantitiyTrue) {
          } else {
            this.showCaution("\uC8FC\uBB38 \uAC00\uB2A5 \uC218\uB7C9 \uCD08\uACFC");
          }
          const isTotalPriceTrue = Number(totalOrderAmount) >= this.minTotal;
          if (isTotalPriceTrue) {
          } else {
            this.showCaution("\uCD5C\uC18C \uC8FC\uBB38 \uAC00\uACA9 \uC774\uD558 ");
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
          this.totalOrderAmountInput.value = (Number((_a = this.sellPriceInput) === null || _a === void 0 ? void 0 : _a.value) * Number((_b = this.orderQuantityInput) === null || _b === void 0 ? void 0 : _b.value)).toString();
        }
        updateSubmitButtonState(element) {
          const submitButton = element.querySelector("button[type='submit']");
          submitButton.disabled = !this.isFormValid(this.sellPriceInput.value, this.orderQuantityInput.value, this.totalOrderAmountInput.value);
        }
        setSellPriceLast(element, price) {
          var _a;
          const remainder = price % 5;
          let step = 1;
          if (price > 1e3) {
            if (remainder >= 2.5) {
              price += 5 - remainder;
            } else {
              price -= remainder;
            }
            step = 5;
          } else {
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
            const quantity = Number(this.totalOrderAmountInput.value) / Number(this.sellPriceInput.value);
            this.orderQuantityInput.value = quantity.toString();
            this.updateSubmitButtonState(element);
          });
          (_c = element.querySelector("form")) === null || _c === void 0 ? void 0 : _c.addEventListener("submit", (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const params = new URLSearchParams({
              market: this.market,
              side: "ask",
              volume: this.orderQuantityInput.value,
              price: this.sellPriceInput.value,
              ord_type: "limit"
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
      };
    }
  });

  // dev/scripts/pages/accounts/AccountItem.js
  var AccountItem;
  var init_AccountItem = __esm({
    "dev/scripts/pages/accounts/AccountItem.js"() {
      "use strict";
      init_SellOrder();
      AccountItem = class {
        constructor() {
          this.market = "";
          this.totalBuyAmount = 0;
          this.totalGainsLosses = 0;
          this.template = document.querySelector("#accountsItem");
        }
        toLocalStringRounded(value) {
          return Math.round(value).toLocaleString();
        }
        render(data) {
          if (!this.template) {
            console.error("Template is not found.");
            return null;
          }
          const { market, avg_buy_price, buy_price, currency, unit_currency, volume, trade_price } = data;
          this.market = market;
          const difference = trade_price - avg_buy_price;
          const gainsLosses = difference * volume;
          const appraisalPrice = buy_price + gainsLosses;
          const returnRate = difference / avg_buy_price * 100;
          this.totalBuyAmount += buy_price;
          this.totalGainsLosses += gainsLosses;
          const values = {
            h3: currency,
            ".volume .value": volume.toString(),
            ".avgBuyPrice .value": this.toLocalStringRounded(avg_buy_price),
            ".buyPrice .value": this.toLocalStringRounded(buy_price),
            ".gainsLosses .value": this.toLocalStringRounded(gainsLosses),
            ".returnRate .value": returnRate.toFixed(2),
            ".appraisalPrice .value": this.toLocalStringRounded(appraisalPrice)
          };
          const template = this.template.content.firstElementChild;
          const element = template === null || template === void 0 ? void 0 : template.cloneNode(true);
          for (const [selector, value] of Object.entries(values)) {
            element.querySelector(selector).textContent = value;
          }
          element.querySelectorAll(".unit").forEach((el) => {
            el.textContent = unit_currency;
          });
          element.querySelectorAll(".market-unit").forEach((el) => {
            el.textContent = currency;
          });
          element.dataset.increase = gainsLosses > 0 ? "true" : "false";
          this.handleOrder(element, trade_price, avg_buy_price);
          return element;
        }
        handleOrder(element, trade_price, avg_buy_price) {
          const askButton = element.querySelector(".askButton");
          new SellOrder(this.market, askButton, element, trade_price, avg_buy_price);
        }
        overviewAssets(asset) {
          const { balance, locked } = asset;
          const amount = Number(balance) + Number(locked);
          const totalAmount = this.totalBuyAmount + amount;
          const totalAppraisalPrice = this.totalBuyAmount + this.totalGainsLosses;
          const totalReturnRate = this.totalGainsLosses / this.totalBuyAmount * 100;
          const values = {
            ".amount .value": Math.round(amount).toLocaleString(),
            ".totalAmount .value": Math.round(totalAmount).toLocaleString(),
            ".totalBuyAmount .value": Math.round(this.totalBuyAmount).toLocaleString(),
            ".totalGainsLosses .value": Math.round(this.totalGainsLosses).toLocaleString(),
            ".totalAppraisalPrice .value": Math.round(totalAppraisalPrice).toLocaleString(),
            ".totalReturnRate .value": totalReturnRate.toFixed(2)
          };
          for (const [selector, value] of Object.entries(values)) {
            document.querySelector(selector).textContent = value;
          }
        }
      };
    }
  });

  // dev/scripts/pages/accounts/index.js
  var require_accounts = __commonJS({
    "dev/scripts/pages/accounts/index.js"(exports) {
      init_AccountItem();
      init_fetchData();
      var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var AccountManager = class {
        constructor() {
          this.initializeAccounts();
        }
        initializeAccounts() {
          return __awaiter2(this, void 0, void 0, function* () {
            const { krwAsset, myMarkets } = yield fetchData_default("/getAccounts");
            this.updateAccountsWithTickers(myMarkets, krwAsset);
          });
        }
        updateAccountsWithTickers(myAccounts, krwAsset) {
          return __awaiter2(this, void 0, void 0, function* () {
            const tickers = yield fetchData_default("/getTickers");
            this.combineAccountsWithTickers(myAccounts, tickers, krwAsset);
          });
        }
        combineAccountsWithTickers(myAccounts, ticekrs, krwAsset) {
          try {
            const data = myAccounts.map((account, index) => {
              const { trade_price } = ticekrs[index];
              return Object.assign(Object.assign({}, account), { trade_price });
            });
            this.displayAccounts(data, krwAsset);
          } catch (error) {
            console.error(error instanceof Error ? error.message : error);
            this.displayAccountsFail();
          }
        }
        displayAccounts(myAccounts, krwAsset) {
          var _a;
          const accountItem = new AccountItem();
          const fragment = new DocumentFragment();
          myAccounts.map((account) => accountItem.render(account)).forEach((element) => fragment.appendChild(element));
          (_a = document.querySelector(".accounts-list")) === null || _a === void 0 ? void 0 : _a.appendChild(fragment);
          accountItem.overviewAssets(krwAsset);
        }
        displayAccountsFail() {
          document.querySelector(".assets-overview").textContent = "\uC790\uB8CC\uB97C \uAC00\uC838\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.";
        }
      };
      new AccountManager();
    }
  });
  require_accounts();
})();
//# sourceMappingURL=index.js.map
