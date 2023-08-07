const accounts = require("./controllers/accounts");
const tickers = require("./controllers/tickers");
const chance = require("./controllers/chance");

const { handleRequest, handleError } = require("./middleware");

module.exports = (app) => {
    app.get("/getAccounts", handleRequest(accounts));
    app.get("/getTickers", handleRequest(tickers));
    app.get("/getChance", handleRequest(chance));

    app.use(handleError);
};
