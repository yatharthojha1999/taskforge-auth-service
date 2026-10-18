# TaskForge AI — Auth Service

The Auth Service is responsible for authentication and session management in TaskForge AI, a multi-tenant task management platform built using a microservice architecture.

It manages user credential verification, access-token issuance, refresh-token rotation, and logout.

## Features

- User credential creation through an internal API.
- Password hashing and verification using Argon2id.
- Login using tenant identity, email, and password.
- Access-token generation using JWT with RS256.
- Refresh tokens generated using cryptographically secure randomness.
- SHA-256 hashing of refresh tokens before database storage.
- Refresh-token rotation with PostgreSQL transactions and row locking.
- Session revocation during logout.
- Input validation using Joi.
- PostgreSQL persistence using parameterized queries.
- Clean Architecture with separate controllers, use cases, and database operations.

## Technology Stack

- Node.js
- Express.js
- PostgreSQL
- `pg`
- JSON Web Tokens (`jsonwebtoken`)
- Argon2
- Joi
- Axios for communication with the User Service
- `node-pg-migrate` for database migrations

## Architecture

The Auth Service follows a layered architecture:

```text
HTTP Request
    |
    v
Routes
    |
    v
Controllers
    |
    v
Use Cases
    |
    v
Database Queries
    |
    v
PostgreSQL
```

Supporting utilities handle password hashing, password verification, access-token generation, refresh-token generation, and refresh-token hashing.

The Auth Service communicates with the User Service when it needs to retrieve user information and verify the user's status.

## Prerequisites

- Node.js and npm
- PostgreSQL
- A running TaskForge User Service for login and registration integration
- RSA private and public keys for JWT signing and verification

## Getting Started

Clone the repository:

```bash
git clone <YOUR_AUTH_SERVICE_REPOSITORY_URL>
cd taskforge-auth-service
```

Install dependencies:

```bash
npm install
```

Create a local `.env` file based on your environment configuration. Never commit the real `.env` file or private keys.

Example configuration:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:<PASSWORD>@localhost:5432/taskforge

JWT_PRIVATE_KEY_PATH=private.pem
JWT_PUBLIC_KEY_PATH=public.pem
JWT_ACCESS_EXPIRES_IN=15m
JWT_ISSUER=taskforge-auth-service
JWT_AUDIENCE=taskforge-api
```

Use the actual variable names expected by the application's configuration. Configure the User Service URL and any internal service-authentication secrets required by your implementation.

Generate an RSA key pair for local development if you do not already have one. Keep the private key secret. Distribute the public key to services that need to verify access tokens.

Run the database migrations using the migration command configured in `package.json`.

Start the service using the start or development script defined in `package.json`.

## API Endpoints

### 1. Create User Credentials

**Method:** `POST`

**Endpoint:** `/internal/v1/credentials`

Creates password credentials for an existing user.

Example request:

```json
{
  "linkname": "acme.com",
  "user_id": 101,
  "password": "StrongPassword123!"
}
```

The Auth Service hashes the password before storing it. Plaintext passwords and password hashes must not be returned in API responses or logged.

This is an internal endpoint and must be protected with service-to-service authentication.

### 2. Login

**Method:** `POST`

**Endpoint:** `/auth/v1/login`

Authenticates a user and creates a refresh-token session.

Example request:

```json
{
  "linkname": "acme.com",
  "email": "john@acme.com",
  "password": "StrongPassword123!"
}
```

Successful response:

```json
{
  "accessToken": "<access-token>",
  "refreshToken": "<refresh-token>"
}
```

The access token is a signed JWT. The refresh token is a securely generated opaque token; only its SHA-256 hash is stored in PostgreSQL.

### 3. Refresh Access Token

**Method:** `POST`

**Endpoint:** `/auth/v1/refresh`

Issues a new access token and rotates the refresh token.

Example request:

```json
{
  "refreshToken": "<current-refresh-token>"
}
```

Successful response:

```json
{
  "accessToken": "<new-access-token>",
  "refreshToken": "<new-refresh-token>"
}
```

The previous refresh token is invalidated and linked to the replacement session. Reusing the old token must be rejected.

The implementation uses a PostgreSQL transaction and row locking to prevent concurrent requests from successfully rotating the same session.

### 4. Logout

**Method:** `POST`

**Endpoint:** `/auth/v1/logout`

Revokes the session associated with the supplied refresh token.

Example request:

```json
{
  "refreshToken": "<current-refresh-token>"
}
```

Example response:

```json
{
  "message": "Logged out successfully."
}
```

Logout revokes the refresh session. An already-issued access token can remain valid until it expires unless an additional access-token revocation mechanism is implemented.

## Database Design

### `user_credentials`

Stores password credentials associated with a tenant and user.

Important fields include:

- `id`
- `linkname`
- `user_id`
- `password_hash`
- `password_changed_at`
- `created_at`
- `updated_at`

Passwords are hashed using Argon2id.

### `auth_sessions`

Stores refresh-token sessions.

Important fields include:

- `id`
- `linkname`
- `user_id`
- `refresh_token_hash`
- `expires_at`
- `revoked_at`
- `last_used_at`
- `replaced_by`
- `created_at`
- `updated_at`

The `replaced_by` field links an old session to the session created during refresh-token rotation.

The `refresh_token_hash` column has a unique constraint so that a hash cannot identify multiple sessions.

## Token Lifecycle

### Access Token

- Signed using RS256.
- Short-lived, configured for 15 minutes by default.
- Contains claims identifying the user and tenant.
- Verified by downstream services using the corresponding public key.
- Must be checked for signature validity, expiry, issuer, and audience.

### Refresh Token

- Generated using cryptographically secure random bytes.
- Returned to the client.
- Stored in PostgreSQL only as a SHA-256 hash.
- Valid for seven days in the current implementation.
- Rotated whenever the refresh endpoint succeeds.
- Revoked when the user logs out.

## Security Considerations

- Never store plaintext passwords or refresh tokens in PostgreSQL.
- Never log passwords, access tokens, or raw refresh tokens.
- Keep the JWT private key and environment secrets out of source control.
- Protect internal service endpoints with service-to-service authentication.
- Validate access-token claims in every downstream service.
- Enforce tenant isolation and authorization independently of authentication.
- Use HTTPS in deployed environments.
- Configure rate limiting and appropriate monitoring for authentication endpoints.
- Return consistent HTTP status codes for validation failures, invalid credentials, and unexpected server errors.

## Testing

The following scenarios have been manually tested during development:

- Successful login.
- Successful refresh-token rotation.
- Rejection of a previously used refresh token.
- Rejection of invalid, expired, revoked, or replaced refresh sessions.
- Concurrent refresh requests using the same token.
- Logout and rejection of a revoked refresh token.

Automated tests should also cover these scenarios, database rollback behavior, and HTTP status-code handling.

## Current Scope and Future Improvements

Potential improvements include:

- Automated unit and integration tests.
- Access-token verification middleware shared across services.
- Session listing and individual-session revocation.
- Device metadata for session management.
- Rate limiting and security monitoring.
- Improved handling of retries when a refresh succeeds in the database but its response never reaches the client.
- Production key management and rotation.

## Project

TaskForge AI is being developed as a collection of independent microservices. The Auth Service handles identity verification and authentication sessions, while the User Service owns tenant and user-profile information.
