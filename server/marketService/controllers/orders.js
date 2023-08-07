const request = require("request");
const crypto = require("crypto");
const queryEncode = require("querystring").encode;
const uuidv4 = require("uuid").v4;
const sign = require("jsonwebtoken").sign;

const KEY = require("../../env/key");
// const TOKEN = require("../../env/token");
const URL = require("../../env/url");

const access_key = KEY.access;
const secret_key = KEY.secret;
// const server_url = URL.server_url;

const state = "done";
const uuids = [
    "9ca023a5-851b-4fec-9f0a-48cd83c2eaae",
    //...
];

const non_array_body = {
    state: state,
};
const array_body = {
    uuids: uuids,
};
const body = {
    ...non_array_body,
    ...array_body,
};

const uuid_query = uuids.map((uuid) => `uuids[]=${uuid}`).join("&");
const query = queryEncode(non_array_body) + "&" + uuid_query;

const hash = crypto.createHash("sha512");
const queryHash = hash.update(query, "utf-8").digest("hex");

const payload = {
    access_key: access_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
};

const token = sign(payload, secret_key);

const options = {
    method: "GET",
    url: `${URL.orders}?` + query,
    headers: `Bearer ${token}`,
    json: body,
};

request(options, (error, response, body) => {
    console.log(options);
    if (error) throw new Error(error);
    console.log(body);
});
