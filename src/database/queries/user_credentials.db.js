const pool = require("../../infrastructure/database/postgres.db.js");
const TABLE_NAME = "user_credentials";

async function addUserCredentials({
    linkname, userId, passwordHash
}) {
    try {
        const query = `INSERT INTO ${TABLE_NAME} (linkname, user_id, password_hash) VALUES ($1, $2, $3) RETURNING id`;
        const values = [linkname, userId, passwordHash];
        const credentials = await pool.query(query, values);
        return credentials.rows[0];
    } catch (e) {
        console.log(e);
    }
}

module.exports = Object.freeze({
    addUserCredentials
})