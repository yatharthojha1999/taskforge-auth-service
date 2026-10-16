export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE user_credentials (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      linkname VARCHAR(255) NOT NULL,
      user_id BIGINT NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      password_changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT user_credentials_linkname_user_id_unique
                UNIQUE (linkname, user_id)
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE user_credentials;
  `);
};