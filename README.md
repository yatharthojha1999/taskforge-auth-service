# TaskForge AI — Auth Service

The Auth Service is a microservice within **TaskForge AI**, responsible for authentication, credential management, and token lifecycle management.

It is designed to operate independently from the User Service. The Auth Service owns user credentials and authentication sessions, while the User Service owns tenant and user profile information.

## Responsibilities

- Securely store and verify user passwords.
- Create and manage user credentials.
- Issue and validate JWT access tokens.
- Manage refresh-token sessions.
- Support login, token refresh, and logout operations.
- Provide internal APIs for service-to-service communication.

## Architecture

The Auth Service follows a Clean Architecture approach, separating HTTP routes, controllers, use cases, database queries, and infrastructure.

```text
src/
├── config/
├── controllers/
├── database/
│   ├── migrations/
│   └── queries/
├── errors/
├── infrastructure/
│   └── database/
├── middleware/
├── scripts/
├── usecases/
├── utils/
├── validators/
├── routes.js
└── server.js
```

The structure may evolve as the service grows.

## Service Responsibilities

| Component | Responsibility |
|---|---|
| Auth Service | Password hashes, authentication, JWTs, refresh-token sessions |
| User Service | Tenants, user profiles, and account status |
| PostgreSQL | Persistent storage owned by this service |
| User Service integration | Internal request to create credentials for a registered user |

The Auth Service must not directly modify the User Service database.

## API Endpoints

The following endpoints describe the planned API contract. They should be considered **planned until implemented and tested**.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/internal/v1/credentials` | Create credentials for an existing user |
| `POST` | `/v1/auth/login` | Verify credentials and issue tokens |
| `POST` | `/v1/auth/refresh` | Refresh an access token |
| `POST` | `/v1/auth/logout` | Revoke a refresh-token session |

### Internal credential creation

**Endpoint:** `POST /internal/v1/credentials`

This endpoint is intended for calls from trusted services, such as the User Service, after user registration.

Example request:

```json
{
  "linkname": "acme.com",
  "user_id": 101,
  "password": "ReplaceWithAStrongPassword"
}
```

Expected successful response:

```json
{
  "message": "Credentials created successfully",
  "user_id": 101,
  "linkname": "acme.com"
}
```

The Auth Service will hash the password before storing it. Plaintext passwords and password hashes must never be included in API responses or application logs.

**Security note:** The `/internal` path is a naming convention, not an access-control mechanism. The endpoint must be protected by service-to-service authentication before production deployment.

## Authentication Design

### Access tokens

- JWT access tokens will represent authenticated users.
- Tokens will contain only the claims needed by downstream services.
- Downstream services should validate tokens using trusted signing keys.
- Access tokens should have a limited lifetime.

### Refresh tokens

- Refresh tokens will be managed as persistent authentication sessions.
- Only a secure representation, such as a cryptographic hash, should be stored.
- Sessions should support expiration and revocation.
- Token rotation and reuse detection should be considered.

The signing algorithm, key management, token lifetime, and revocation strategy must be documented when implemented.

## Database Design

The planned database schema includes:

### `user_credentials`

Stores authentication credentials for users.

Proposed fields include:

- `id`
- `linkname`
- `user_id`
- `password_hash`
- `password_changed_at`
- `created_at`
- `updated_at`

A unique constraint on `(linkname, user_id)` will prevent duplicate credentials for the same user within a tenant.

### `auth_sessions`

Stores refresh-token session information.

Proposed fields include:

- `id`
- `linkname`
- `user_id`
- `refresh_token_hash`
- `expires_at`
- `revoked_at`
- `last_used_at`
- `replaced_by`
- `created_at`

The final schema will be documented after its migrations are implemented.

## Technology Stack

- Node.js
- Express.js
- PostgreSQL
- JWT
- Secure password hashing
- JavaScript with CommonJS modules
- `node-pg-migrate` for database migrations

Additional technologies may be introduced as requirements evolve.

## Local Development

### Prerequisites

- Node.js
- npm
- PostgreSQL

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yatharthojha1999/taskforge-auth-service.git
cd taskforge-auth-service
npm install
```

Create a `.env` file in the project root using `.env.example` as a reference, once the example file is available.

Configure the required environment variables for the application and PostgreSQL connection. Do not commit `.env` or actual credentials.

### Run the service

```bash
npm start
```

### Database migrations

The repository is intended to use `node-pg-migrate`.

After migration scripts and their npm commands are configured, use the documented migration commands to apply or roll back schema changes. Do not assume migrations are available until they have been implemented.

## Security Guidelines

- Never store plaintext passwords.
- Never return password hashes or tokens unnecessarily.
- Never commit secrets, signing keys, or database credentials.
- Use parameterized SQL queries.
- Protect internal endpoints with service-to-service authentication.
- Validate and normalize incoming requests.
- Enforce account and tenant status checks during authentication.
- Use HTTPS in deployed environments.
- Apply appropriate rate limits to authentication endpoints.

## Project Status

**Current milestone:** Auth Service foundation and credential-management design.

| Feature | Status |
|---|---|
| Service repository and initial structure | Created |
| Database connection foundation | Based on the service template; verify in this repository |
| `user_credentials` migration | Planned |
| Internal credential creation endpoint | Planned |
| Password hashing and verification | Planned |
| Login and JWT issuance | Planned |
| Refresh-token management | Planned |
| Logout and session revocation | Planned |
| Service-to-service security | Planned |

Update this section as features are implemented and tested.

## Related Project

TaskForge AI is a multi-tenant task management platform being developed with a microservice architecture.

The Auth Service is responsible for authentication and credentials; other services retain ownership of their respective domain data.

