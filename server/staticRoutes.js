const fs = require("fs");
const path = require("path");

const setupStaticRoutes = (app, staticPath) => {
    const routes = ["accounts"];
    routes.forEach((route) => {
        app.get(`/${route}`, async (req, res) => {
            console.log("route: ", route);
            const htmlPath = path.join(staticPath, "html", `${route}.html`);
            readFile(htmlPath, res);
        });
    });
};

const readFile = (htmlPath, res) => {
    fs.readFile(htmlPath, "utf8", (err, markup) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .send(
                    "서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
                );
        }
        res.send(markup);
    });
};

module.exports = setupStaticRoutes;
