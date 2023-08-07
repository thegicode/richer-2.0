const express = require("express");
const app = express();

const { isProduction, staticPath, port } = require("./config.js");
const staticRoutes = require("./staticRoutes");
const marketService = require("./marketService");

console.log(
    `Server is running in ${
        isProduction ? "production" : "development"
    } mode on port ${port}`
);

app.use(express.static(staticPath));

staticRoutes(app, staticPath);

marketService(app);

app.listen(port, () => {
    console.log(`Server is started at http://localhost:${port}`);
});
