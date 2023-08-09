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
  async function fetchData(url, marketName) {
    try {
      let finalURL = url;
      if (marketName) {
        const params = new URLSearchParams({
          market: marketName
        }).toString();
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

  // dev/scripts/pages/accounts/OrderAsk.js
  var __awaiter, OrderAsk;
  var init_OrderAsk = __esm({
    "dev/scripts/pages/accounts/OrderAsk.js"() {
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
      OrderAsk = class {
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
            const marketName = this.market;
            const data = yield fetchData_default("/getChance", marketName);
            this.data = data;
            const { balance } = data.ask_account;
            if (Number(balance) === 0) {
              this.askButton.remove();
              return;
            }
            this.askButton.addEventListener("click", this.onClick.bind(this));
          });
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
            if (!this.data)
              return;
            this.askButton.disabled = true;
            const data = this.data;
            const { ask_account } = data;
            const { balance, unit_currency } = ask_account;
            const askPrice = this.avgBuyPrice + this.avgBuyPrice * 0.1;
            element.querySelector(".orderAvailable .value").textContent = balance.toString();
            element.querySelector(".orderAvailable .unit").textContent = unit_currency;
            element.querySelector(".sellPrice input").value = askPrice.toString();
          });
        }
        removeOrder(element) {
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
      init_OrderAsk();
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
          this.handleOrder(element, trade_price, avg_buy_price);
          return element;
        }
        handleOrder(element, trade_price, avg_buy_price) {
          const askButton = element.querySelector(".askButton");
          new OrderAsk(this.market, askButton, element, trade_price, avg_buy_price);
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
