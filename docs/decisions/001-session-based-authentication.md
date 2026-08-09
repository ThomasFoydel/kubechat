# ADR 001: Use Server-Side Sessions for Authentication

## Status

Accepted

## Context

KubeChat needs authenticated users and must maintain authentication state across multiple API instances.

Two viable approaches were considered:

1. Stateless authentication using signed JWTs.
2. Server-side sessions identified by an opaque cookie.

Both approaches are commonly used in production systems.

## Decision

KubeChat will use **server-side sessions stored in Redis**, with an opaque session identifier delivered to the browser through an HTTP-only cookie.

The browser does not receive the user's identity or authorization information as part of the session token.

The API resolves the session through Redis on authenticated requests.

## Rationale

Server-side sessions provide several properties that are useful for KubeChat:

* Sessions can be invalidated immediately by deleting them from Redis.
* Logout can invalidate the server-side session rather than merely deleting a client-side token.
* Session lifetime and security policies can be changed centrally.
* Sensitive authentication state does not need to be encoded into a client-held token.
* The approach works naturally with multiple horizontally scaled API instances when session state is centralized.

JWTs would provide advantages for some architectures, particularly systems requiring independently verifiable tokens across many services. However, KubeChat currently has a centralized API and does not require independent services to validate authentication tokens.

The additional complexity of token rotation, revocation, and short-lived access/refresh token management would therefore not provide enough benefit at this stage.

## Consequences

### Positive

* Centralized session invalidation.
* Straightforward logout semantics.
* API instances remain stateless with respect to local process memory.
* Authentication state can be shared across API replicas through Redis.
* HTTP-only cookies reduce exposure of the session identifier to client-side JavaScript.

### Negative

* Authenticated requests require a Redis lookup.
* Redis becomes an important dependency for authentication.
* Session expiration and cleanup must be managed.
* Distributed session storage must be available to all API instances.

## Security Considerations

Session cookies are configured with:

* `HttpOnly`
* `SameSite=Lax`
* `Secure` in production
* A finite expiration period

Session identifiers are randomly generated and stored server-side rather than containing user information.
