const { isProduction, staticPath, port } = require("./config.js");
const marketService = require("./marketService");
const staicRoutes = require("./staticRoutes.js");
const express = require("express");
const app = express();

console.log(isProduction, port);

app.use(express.static(staticPath));

marketService(app);

staicRoutes(app, staticPath);

app.listen(port, () => {
    console.log(`Start: http://localhost:${port}`);
});
