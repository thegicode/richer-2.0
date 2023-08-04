const { isProduction, staticPath, port } = require("./config.js");
const apis = require("./apis");
const staicRoutes = require("./staticRoutes.js");
const express = require("express");
const app = express();

console.log(isProduction, port);

app.use(express.static(staticPath));

staicRoutes(app, staticPath);

app.listen(port, () => {
    console.log(`Start: http://localhost:${port}`);
});

// getAccounts
app.get("/getAccounts", async (req, res) => {
    try {
        const data = await apis.accounts();
        res.send(data);
    } catch (error) {
        console.warn(error.message);
    }
});
