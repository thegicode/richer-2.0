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
      let finalURL = url;
      if (params) {
        finalURL = `${url}?${params}`;
      }
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
          this.data = null;
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
            if (sellPriceInput.value && orderQuantityInput.value && totalOrderAmountInput.value)
              submitButton.disabled = false;
            else
              submitButton.disabled = true;
          };
          const fromSellPriceToTotalOrderAmount = () => {
            if (orderQuantityInput.value) {
              totalOrderAmountInput.value = (Number(sellPriceInput.value) * Number(orderQuantityInput.value)).toString();
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
            } else {
              cautionElement.textContent = "\uC8FC\uBB38 \uAC00\uB2A5 \uC218\uB7C9 \uCD08\uACFC\uC785\uB2C8\uB2E4. ";
              cautionElement.hidden = false;
            }
            validate();
          });
          totalOrderAmountInput.addEventListener("input", () => {
            const quantity = Number(totalOrderAmountInput.value) / Number(sellPriceInput.value);
            if (quantity < balance) {
              orderQuantityInput.value = quantity.toString();
              cautionElement.textContent = "";
              cautionElement.hidden = true;
            } else {
              cautionElement.textContent = "\uC8FC\uBB38 \uAC00\uB2A5 \uC218\uB7C9 \uCD08\uACFC\uC785\uB2C8\uB2E4.";
              cautionElement.hidden = false;
            }
            validate();
          });
          (_a = element.querySelector("form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const params = new URLSearchParams({
              market: this.market,
              side: "ask",
              volume: orderQuantityInput.value,
              price: sellPriceInput.value,
              ord_type: "limit"
            }).toString();
            const reponse = yield fetchData_default("/getOrders", params);
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
