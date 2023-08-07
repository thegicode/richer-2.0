const crypto2 = require("crypto");
const { sign } = require("jsonwebtoken");
const uuidv4 = require("uuid").v4;
const queryEncode = require("querystring").encode;

const KEY = require("./key");

const payload = {
    access_key: KEY.ACCESS,
    nonce: uuidv4(),
};
const jwtToken = sign(payload, KEY.SECRET);
const authorizationToken = `Bearer ${jwtToken}`;

const authorizationTokenBody = (body) => {
    const query = queryEncode(body);
    const hash = crypto2.createHash("sha512");
    const queryHash = hash.update(query, "utf-8").digest("hex");

    const payload = {
        access_key: KEY.ACCESS,
        nonce: uuidv4(),
        query_hash: queryHash,
        query_hash_alg: "SHA512",
    };

    const jwtToken = sign(payload, KEY.SECRET);
    const authorizationToken = `Bearer ${jwtToken}`;

    return {
        query,
        token: authorizationToken,
    };
};

module.exports = {
    authorizationToken,
    authorizationTokenBody,
};
