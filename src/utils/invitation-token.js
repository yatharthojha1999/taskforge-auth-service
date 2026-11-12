
const crypto = require("node:crypto");

function generateInvitationToken() {
    return crypto.randomBytes(32).toString("base64url");
}

function hashInvitationToken(token) {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
}

module.exports = Object.freeze({
    generateInvitationToken,
    hashInvitationToken,
});
