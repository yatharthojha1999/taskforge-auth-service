const crypto = require("node:crypto");

function generateRefreshToken() {
    return crypto.randomBytes(32).toString("base64url");
}

module.exports = Object.freeze({
    generateRefreshToken,
});