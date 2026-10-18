export const up = (pgm) => {
    pgm.sql(`
    ALTER TABLE auth_sessions
    ADD CONSTRAINT auth_sessions_refresh_token_hash_unique
    UNIQUE (refresh_token_hash);
  `);
};

export const down = (pgm) => {
    pgm.sql(`
    ALTER TABLE auth_sessions
    DROP CONSTRAINT auth_sessions_refresh_token_hash_unique;
  `);
};