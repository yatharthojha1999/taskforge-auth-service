export const up = (pgm) => {
    pgm.sql(`
        CREATE TABLE invitations (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id BIGINT NOT NULL,
        linkname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        token_hash CHAR(64) NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        consumed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX invitations_user_id_idx
        ON invitations (user_id);

    CREATE INDEX invitations_expiration_idx
        ON invitations (expires_at);
  `);
};

export const down = (pgm) => {
    pgm.sql(`
    DROP TABLE invitations;
  `);
};