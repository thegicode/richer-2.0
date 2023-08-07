"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // dev/scripts/pages/accounts/AccountItem.js
  var AccountItem;
  var init_AccountItem = __esm({
    "dev/scripts/pages/accounts/AccountItem.js"() {
      "use strict";
      AccountItem = class {
        constructor() {
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
          const { avg_buy_price, buy_price, currency, unit_currency, volume, trade_price } = data;
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
          return element;
        }
        tradeAsset(asset) {
          const { balance, locked } = asset;
          const amount = Number(balance) + Number(locked);
          const totalAmount = this.totalBuyAmount + amount;
          const totalAppraisalPrice = this.totalBuyAmount + this.totalGainsLosses;
          const values = {
            ".amount .value": Math.round(amount).toLocaleString(),
            ".totalAmount .value": Math.round(totalAmount).toLocaleString(),
            ".totalBuyAmount .value": Math.round(this.totalBuyAmount).toLocaleString(),
            ".totalGainsLosses .value": Math.round(this.totalGainsLosses).toLocaleString(),
            ".totalAppraisalPrice .value": Math.round(totalAppraisalPrice).toLocaleString()
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
      var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
        fetchData(url) {
          return __awaiter(this, void 0, void 0, function* () {
            try {
              const response = yield fetch(url, { method: "GET" });
              const data = yield response.json();
              return data;
            } catch (error) {
              console.warn(error instanceof Error ? error.message : error);
            }
          });
        }
        initializeAccounts() {
          return __awaiter(this, void 0, void 0, function* () {
            const { krwAsset, myMarkets } = yield this.fetchData("/getAccounts");
            this.updateAccountsWithTickers(myMarkets, krwAsset);
          });
        }
        updateAccountsWithTickers(myAccounts, krwAsset) {
          return __awaiter(this, void 0, void 0, function* () {
            const tickers = yield this.fetchData("/getTickers");
            const chance = yield this.fetchData("/getChance");
            console.log(chance);
            this.combineAccountsWithTickers(myAccounts, tickers, krwAsset);
          });
        }
        combineAccountsWithTickers(myAccounts, ticekrs, krwAsset) {
          if (myAccounts.length === void 0)
            return;
          const data = myAccounts.map((account, index) => {
            const { trade_price } = ticekrs[index];
            return Object.assign(Object.assign({}, account), { trade_price });
          });
          this.displayAccounts(data, krwAsset);
        }
        displayAccounts(myAccounts, krwAsset) {
          var _a;
          const accountItem = new AccountItem();
          const fragment = new DocumentFragment();
          myAccounts.map((account) => accountItem.render(account)).forEach((element) => fragment.appendChild(element));
          (_a = document.querySelector(".accountsList")) === null || _a === void 0 ? void 0 : _a.appendChild(fragment);
          accountItem.tradeAsset(krwAsset);
        }
      };
      new AccountManager();
    }
  });
  require_accounts();
})();
//# sourceMappingURL=index.js.map
