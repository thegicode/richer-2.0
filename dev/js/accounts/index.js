"use strict";
(() => {
  // dev/scripts/pages/accounts/AccountItem.js
  var AccountItem = class {
    constructor() {
      this.template = document.querySelector("#accountsItem");
    }
    render(data) {
      var _a;
      const { avg_buy_price, buy_price, currency, unit_currency, volume, trade_price } = data;
      const averageBuyPrice = Math.round(avg_buy_price);
      const currentPrice = Math.round(trade_price);
      const difference = currentPrice - averageBuyPrice;
      const gainsLosses = Math.round(difference * volume);
      const appraisalPrice = Math.round(buy_price) + gainsLosses;
      const returnRate = difference / averageBuyPrice * 100;
      const template = (_a = this.template) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
      const element = template === null || template === void 0 ? void 0 : template.cloneNode(true);
      element.querySelector("h3").textContent = currency;
      element.querySelector(".volume").textContent = volume.toString();
      element.querySelector(".avgBuyPrice .value").textContent = `${averageBuyPrice.toLocaleString()}`;
      element.querySelector(".buyPrice .value").textContent = `${Math.round(buy_price).toLocaleString()}`;
      element.querySelector(".gainsLosses .value").textContent = `${gainsLosses.toLocaleString()}`;
      element.querySelector(".returnRate .value").textContent = `${returnRate.toFixed(2)}`;
      element.querySelector(".appraisalPrice .value").textContent = `${appraisalPrice.toLocaleString()}`;
      element.querySelectorAll(".unit").forEach((el) => {
        el.textContent = unit_currency;
      });
      return element;
    }
  };

  // dev/scripts/pages/accounts/index.js
  var Accounts = class {
    constructor() {
      this.getAccounts();
    }
    getAccounts() {
      fetch(`/getAccounts`, {
        method: "GET"
      }).then((data) => data.json()).then((response) => {
        this.getTickers(response);
      }).catch((error) => {
        console.warn(error instanceof Error ? error.message : error);
      });
    }
    getTickers(myAccounts) {
      fetch(`/getTickers`, {
        method: "GET"
      }).then((data) => data.json()).then((response) => {
        this.renderTickers(myAccounts, response);
      }).catch((error) => {
        console.warn(error instanceof Error ? error.message : error);
      });
    }
    renderTickers(myAccounts, tickers) {
      const data = myAccounts.map((account, index) => {
        const { trade_price } = tickers[index];
        return Object.assign(Object.assign({}, account), { trade_price });
      });
      this.renderAccounts(data);
    }
    renderAccounts(myAccounts) {
      var _a;
      const accountItem = new AccountItem();
      const fragment = new DocumentFragment();
      myAccounts.map((account) => accountItem.render(account)).forEach((element) => fragment.appendChild(element));
      (_a = document.querySelector("ul")) === null || _a === void 0 ? void 0 : _a.appendChild(fragment);
    }
  };
  new Accounts();
})();
//# sourceMappingURL=index.js.map
