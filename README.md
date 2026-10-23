TaskForge AI --- Auth Service
The Auth Service handles authentication and credential/session
operations for TaskForge AI. It is a Node.js/Express service using
PostgreSQL, Argon2, JWT, and Axios for internal service calls.
Current responsibilities
- Create user credentials for the User Service's registration flow.
- Hash passwords using Argon2id.
- Authenticate users.
- Issue RS256 access JWTs.
- Create and rotate refresh tokens.
- Revoke refresh sessions on logout.
- Query the User Service to verify the user and tenant during login.
Technology
- Node.js
- Express
- PostgreSQL
- argon2
- jsonwebtoken
- node-pg-migrate
- Axios
- Docker Compose
Run with Docker Compose
Run commands from the main taskforge-ai repository root.

Ensure the root .env contains POSTGRES_PASSWORD, and ensure the
PostgreSQL container has a database named taskforge_auth. If it does
not exist, create it:
docker compose exec postgres psql -U taskforge -d postgres -c "CREATE DATABASE taskforge_auth;"
Run the Auth Service migrations:
docker compose --profile migrations run --build --rm auth-migrate
Start or rebuild the service:
docker compose up -d --build auth-service
Check status and logs:
docker compose ps
docker compose logs --tail=80 auth-service
The service is exposed at http://localhost:3001 on the host. Other
Compose services should reach it at http://auth-service:3001.
Environment variables
  Variable                  Docker Compose value / purpose
  PORT                    3001
  DB_HOST                 postgres
  DB_PORT                 5432
  DB_NAME                 taskforge_auth
  DB_USER                 taskforge
  DB_PASSWORD             Read from root .env as POSTGRES_PASSWORD
  USER_SERVICE_URL        http://user-service:3000 in Docker
  JWT_PRIVATE_KEY_PATH    /run/secrets/jwt-private-key in Docker
  JWT_ACCESS_EXPIRES_IN   15m
  JWT_ISSUER              taskforge-auth-service
  JWT_AUDIENCE            taskforge-api

The JWT private key is mounted through the Compose secret
jwt-private-key, sourced from
taskforge-auth-service/jwt-private.pem. Keep the private key out of
version control and do not paste its contents into logs or chats.

The application configuration should read process.env.USER_SERVICE_URL
and use http://localhost:3000 only as a fallback for local
development.
API routes
  Method                  Endpoint                     Purpose
  POST                  /internal/v1/credentials   Internal credential
                                                       creation called by User
                                                       Service

  POST                  /auth/v1/login             Authenticate a user

  POST                  /auth/v1/refresh           Refresh/rotate a
                                                       session token

  POST                  /auth/v1/logout            Log out/revoke a
                                                   refresh session
Confirm required fields, validation rules, status codes, and response
formats in the current route/controller/validator implementation before
using these endpoints.
Database
The service database is taskforge_auth. After migrations, the expected
tables are:
- user_credentials
- auth_sessions
- pgmigrations
Verify:
docker compose exec postgres psql -U taskforge -d taskforge_auth -c "\dt"
Run migrations after adding a migration file:
docker compose --profile migrations run --build --rm auth-migrate
Each service has its own database and migration history. Do not point
both services at the same database while using the current migration
setup.
Authentication notes
- Passwords are hashed with Argon2id.
- Access tokens use RS256 and are configured for a 15-minute lifetime
  in Compose.
- Refresh tokens are random values; their SHA-256 hashes are stored in
  the database.
- Refresh operations rotate refresh tokens.
- Logout revokes the relevant refresh session.
These implementation notes describe the current design; test refresh
rotation, expired-token handling, and post-logout refresh rejection
before treating those flows as fully verified.
Service-to-service login flow
The Auth Service calls the User Service using USER_SERVICE_URL to look
up the user and check the user status. Inside Docker, use
http://user-service:3000; do not hardcode localhost:3000 for
container-to-container calls.
Troubleshooting
docker compose logs --tail=100 auth-service
docker compose exec auth-service printenv USER_SERVICE_URL
Expected Docker URL:
http://user-service:3000
If JWT key loading fails, verify the configured secret file exists at
taskforge-auth-service/jwt-private.pem on the host and is mounted at
/run/secrets/jwt-private-key in the container. Do not expose the
private key.

If PostgreSQL reports that the database does not exist, create the
database and run the migration job. Do not remove the PostgreSQL volume
to resolve this issue.
Tests and documentation
Registration, login, and logout have been tested in the Dockerized
environment. Keep this status current as further tests are performed.
When adding endpoints or migrations, update this README with the method,
path, request/response examples, configuration changes, and test
results.