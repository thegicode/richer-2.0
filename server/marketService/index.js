const accounts = require("./controllers/accounts");
const tickers = require("./controllers/tickers");

const { handleRequest, handleError } = require("./middleware");

module.exports = (app) => {
    app.get("/getAccounts", handleRequest(accounts));
    app.get("/getTickers", handleRequest(tickers));

    app.use(handleError);
};
