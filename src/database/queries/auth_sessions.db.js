const pool = require("../../infrastructure/database/postgres.db.js");
const TABLE_NAME = "auth_sessions";

async function createAuthSession({
    linkname, userId, refreshTokenHash, expiresAt,
}) {
    const query = `INSERT INTO ${TABLE_NAME} (linkname, user_id, refresh_token_hash, expires_at) VALUES ($1, $2, $3, $4) RETURNING id`;
    const values = [linkname, userId, refreshTokenHash, expiresAt,];
    const credentials = await pool.query(query, values);
    return credentials.rows[0] ?? null;
}

module.exports = Object.freeze({
    createAuthSession,
})