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

async function rotateRefreshTokenSession({
    refreshTokenHash,
    newRefreshTokenHash,
    newExpiresAt,
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Find and lock the current session.
        const result = await client.query(
            `SELECT *
             FROM auth_sessions
             WHERE refresh_token_hash = $1
             FOR UPDATE`,
            [refreshTokenHash]
        );

        const session = result.rows[0];

        // 2. Validate the session while holding the lock.
        if (
            !session ||
            session.revoked_at ||
            session.replaced_by ||
            new Date(session.expires_at).getTime() <= Date.now()
        ) {
            throw new Error("Invalid refresh token. Please login again.");
        }

        // 3. Create the new session.
        const newSession = await client.query(
            `INSERT INTO auth_sessions (
                linkname,
                user_id,
                refresh_token_hash,
                expires_at
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
            [
                session.linkname,
                session.user_id,
                newRefreshTokenHash,
                newExpiresAt,
            ]
        );

        const newSessionId = newSession.rows[0].id;

        // 4. Revoke the old session and link its replacement.
        const updateResult = await client.query(
            `UPDATE auth_sessions
             SET revoked_at = CURRENT_TIMESTAMP,
                 last_used_at = CURRENT_TIMESTAMP,
                 replaced_by = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
               AND revoked_at IS NULL
               AND replaced_by IS NULL`,
            [newSessionId, session.id]
        );

        if (updateResult.rowCount !== 1) {
            throw new Error("Session rotation failed");
        }

        // 5. Commit both changes together.
        await client.query("COMMIT");

        return session;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function revokeAuthSession({ refreshTokenHash }) {
    const query = `
        UPDATE ${TABLE_NAME}
        SET revoked_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE refresh_token_hash = $1
          AND revoked_at IS NULL
          AND replaced_by IS NULL
        RETURNING id
    `;

    const result = await pool.query(query, [refreshTokenHash]);

    return result.rows[0] ?? null;
}

module.exports = Object.freeze({
    createAuthSession,
    rotateRefreshTokenSession,
    revokeAuthSession,
})