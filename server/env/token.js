const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid").v4;
const key = require("./key");

const payload = {
    access_key: key.access,
    nonce: uuidv4(),
};

const jwtToken = jwt.sign(payload, key.secret);
const authorizationToken = `Bearer ${jwtToken}`;

module.exports = authorizationToken;

// "use strict";
// const key = require('./key');
// const sign = require('jsonwebtoken').sign;
// const uuidv4 = require('uuid').v4;
// const accessKey = key.access;
// const secretKey = key.secret;
// const payload = {
//     access_key: accessKey,
//     nonce: uuidv4(),
// };
// module.exports = sign(payload, secretKey);
