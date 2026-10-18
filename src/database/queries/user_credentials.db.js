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

async function getUserCredentialsByDomainAndUserId({ domain, userId }) {
    let whereClause = `linkname=$1`;
    const values = [domain];
    if (userId) {
        whereClause += ` AND user_id=$2`;
        values.push(userId);
    }
    const tenantQuery = `SELECT * FROM ${TABLE_NAME} WHERE ${whereClause};`;
    const tenantResult = await pool.query(tenantQuery, values);
    return tenantResult.rows[0] ?? null;
}


module.exports = Object.freeze({
    addUserCredentials,
    getUserCredentialsByDomainAndUserId,
})