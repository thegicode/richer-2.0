const accounts = require("./accounts");
const tickers = require("./tickers");

module.exports = async (app) => {
    app.get("/getAccounts", async (req, res) => {
        try {
            const data = await accounts();
            res.send(data);
        } catch (error) {
            console.warn(error.message);
        }
    });
    app.get("/getTickers", async (req, res) => {
        try {
            const data = await tickers();
            res.send(data);
        } catch (error) {
            console.warn(error.message);
        }
    });
};
