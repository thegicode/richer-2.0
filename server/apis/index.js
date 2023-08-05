const accounts = require("./accounts");
const tickers = require("./tickers");

const handleRequest = (fn) => {
    return async (req, res, next) => {
        try {
            const data = await fn();
            res.send(data);
        } catch (error) {
            next(error);
        }
    };
};

const handleError = (error, req, res, next) => {
    console.warn(error.message);
    res.status(500).send({ error: error.message });
};

module.exports = (app) => {
    app.get("/getAccounts", handleRequest(accounts));
    app.get("/getTickers", handleRequest(tickers));

    app.use(handleError);
};

// module.exports = async (app) => {
//     app.get("/getAccounts", async (req, res) => {
//         try {
//             const data = await accounts();
//             res.send(data);
//         } catch (error) {
//             console.warn(error.message);
//         }
//     });
//     app.get("/getTickers", async (req, res) => {
//         try {
//             const data = await tickers();
//             res.send(data);
//         } catch (error) {
//             console.warn(error.message);
//         }
//     });
// };
