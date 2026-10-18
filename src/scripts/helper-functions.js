const argon2 = require("argon2");
const crypto = require("node:crypto");


// this is used to generate a password_hash using user provided password while login.
const hashPassword = async (password) => {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
    });
};

// this is used to verify hash_password(DB) and password(user)  
const verifyPassword = async (passwordHash, password) => {
    return await argon2.verify(passwordHash, password);
};

// this is used to verify jwt tokens using public keys.
function verifyAccessToken(token) {
    return jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
    });
}

// hashing function to generate refresh token hash specifically.
function hashRefreshToken(token) {
    return crypto
        .createHash("sha256")
        .update(token, "utf8")
        .digest("hex");
}

module.exports = Object.freeze({
    hashPassword,
    verifyPassword,
    verifyAccessToken,
    hashRefreshToken,
});
