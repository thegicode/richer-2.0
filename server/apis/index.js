const accounts = require("./accounts");

module.exports = async (app) => {
    app.get("/getAccounts", async (req, res) => {
        try {
            const data = await accounts();
            res.send(data);
        } catch (error) {
            console.warn(error.message);
        }
    });
};
