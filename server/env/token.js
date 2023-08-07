const crypto = require("crypto");
const { sign } = require("jsonwebtoken");
const uuidv4 = require("uuid").v4;
const { encode: queryEncode } = require("querystring");

const KEY = require("./key");

const generateAuthorizationToken = (payload) =>
    `Bearer ${sign(payload, KEY.SECRET)}`;

const authorizationToken = generateAuthorizationToken({
    access_key: KEY.ACCESS,
    nonce: uuidv4(),
});

const authorizationTokenBody = (body) => {
    const query = queryEncode(body);
    const hash = crypto.createHash("sha512");
    const queryHash = hash.update(query, "utf-8").digest("hex");

    const payload = {
        access_key: KEY.ACCESS,
        nonce: uuidv4(),
        query_hash: queryHash,
        query_hash_alg: "SHA512",
    };

    return {
        query,
        token: generateAuthorizationToken(payload),
    };
};

module.exports = {
    authorizationToken,
    authorizationTokenBody,
};
