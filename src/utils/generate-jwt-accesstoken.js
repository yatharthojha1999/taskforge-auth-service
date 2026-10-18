const fs = require("node:fs");
const path = require("node:path");
const jwt = require("jsonwebtoken");

function loadPrivateKey() {
    const keyPath = process.env.JWT_PRIVATE_KEY_PATH;

    if (!keyPath) {
        throw new Error("JWT_PRIVATE_KEY_PATH is not configured");
    }

    return fs.readFileSync(path.resolve(keyPath), "utf8");
}

function generateAccessToken({ userId, linkname }) {
    const privateKey = loadPrivateKey();

    return jwt.sign(
        { linkname },
        privateKey,
        {
            algorithm: "RS256",
            subject: String(userId),
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
            issuer: process.env.JWT_ISSUER || "taskforge-auth-service",
            audience: process.env.JWT_AUDIENCE || "taskforge-api",
        }
    );
}

module.exports = Object.freeze({
    generateAccessToken,
});