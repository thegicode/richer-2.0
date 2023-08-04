"use strict";
(() => {
  // dev/scripts/pages/accounts/AccountItem.js
  var AccountItem = class {
    constructor() {
      this.template = document.querySelector("#accountsItem");
    }
    render(data) {
      var _a;
      const { currency } = data;
      const template = (_a = this.template) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
      const element = template === null || template === void 0 ? void 0 : template.cloneNode(true);
      element.querySelector("th").textContent = currency;
      return element;
    }
  };

  // dev/scripts/pages/accounts/index.js
  var Accounts = class {
    constructor() {
      this.getFetch();
    }
    getFetch() {
      fetch(`/getAccounts`, {
        method: "GET"
      }).then((data) => data.json()).then((response) => {
        this.renderList(response);
      }).catch((error) => {
        console.warn(error instanceof Error ? error.message : error);
      });
    }
    renderList(myAccounts) {
      var _a;
      const accountItem = new AccountItem();
      const fragment = new DocumentFragment();
      myAccounts.map((account) => accountItem.render(account)).forEach((element) => fragment.appendChild(element));
      (_a = document.querySelector("tbody")) === null || _a === void 0 ? void 0 : _a.appendChild(fragment);
    }
  };
  new Accounts();
})();
//# sourceMappingURL=index.js.map