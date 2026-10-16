export const up = (pgm) => {
    pgm.sql(`
    CREATE TABLE auth_sessions (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      linkname VARCHAR(255) NOT NULL,
      user_id BIGINT NOT NULL,
      refresh_token_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ NULL,
      last_used_at TIMESTAMPTZ NULL,
      replaced_by BIGINT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down = (pgm) => {
    pgm.sql(`
    DROP TABLE auth_sessions;
  `);
};