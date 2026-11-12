const pool = require("../../infrastructure/database/postgres.db.js");

async function invalidatePendingInvitations({ userId, linkname }) {
    const query = `
        UPDATE invitations
        SET consumed_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
          AND linkname = $2
          AND consumed_at IS NULL;
    `;

    await pool.query(query, [userId, linkname]);
}

async function createInvitation({ userId, linkname, email, tokenHash, expiresAt}) {
    const query = `
        INSERT INTO invitations (
            user_id,
            linkname,
            email,
            token_hash,
            expires_at
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, user_id, linkname, email, expires_at, created_at;
    `;

    const result = await pool.query(query, [userId, linkname, email, tokenHash, expiresAt]);

    return result.rows[0];
}

module.exports = Object.freeze({
    invalidatePendingInvitations,
    createInvitation,
});
