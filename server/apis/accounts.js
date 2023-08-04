const request = require("request");
const { accounts: ACCOUNTS_URL } = require(`../env/url`);
const token = require("../env/token");

const options = {
    method: "GET",
    url: ACCOUNTS_URL,
    headers: { Authorization: token },
};

request(options, (error, response, body) => {
    if (error) throw new Error(error);
    console.log(JSON.parse(body));
});
