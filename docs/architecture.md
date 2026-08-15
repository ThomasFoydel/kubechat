# KubeChat Architecture

## Overview

KubeChat is a scalable chat application designed as a practical system-design exercise. The application is structured around independently deployable frontend and API components, with PostgreSQL providing durable relational storage and Redis providing distributed ephemeral state.

The application is deployed to Kubernetes, with an Ingress acting as the public entry point.

```text
Internet
   |
   v
Ingress
   |
   +----------------+
   |                |
   v                v
Frontend           API
                    |
              +-----+-----+
              |           |
              v           v
          PostgreSQL     Redis
```

## API Architecture

The API is organized by feature rather than by technical layer.

```text
api/src/features/
├── auth/
├── users/
├── messages/
└── ...
```

Each feature owns the code associated with its domain, including controllers, services, repositories, DTOs, and routes where appropriate.

This keeps related behavior together and allows individual features to evolve without creating a large set of globally shared technical layers.

The application still separates responsibilities within each feature:

- **Routes** define HTTP endpoints.
- **Controllers** translate HTTP requests into application operations and HTTP responses.
- **Services** contain application and business logic.
- **Repositories** handle persistence.
- **DTOs** define API input and output contracts.
- **Mappers** translate persistence models into API responses.

For example, the authentication feature contains authentication-specific concerns:

```text
auth/
├── controller.ts
├── dto.ts
├── middleware.ts
├── password.ts
├── service.ts
└── session.ts
```

The user feature owns user-domain concerns:

```text
users/
├── controller.ts
├── dto.ts
├── mapper.ts
├── repository.ts
├── routes.ts
└── service.ts
```

## Data Architecture

PostgreSQL is the source of truth for durable application data such as users and messages.

Redis is used for state that benefits from fast access and does not represent the primary durable record of the application.

For authentication, Redis stores server-side session state while PostgreSQL stores the user's identity and password hash.

This separation allows PostgreSQL to remain the authoritative system of record while Redis handles workloads where low-latency distributed state is more appropriate.

## Deployment Architecture

Frontend and API components are deployed independently in Kubernetes.

This allows the two components to scale and deploy independently and prevents frontend concerns from being tightly coupled to API runtime concerns.

Kubernetes Services provide stable internal endpoints for application components, while the Ingress provides the external HTTP/HTTPS entry point.

TLS termination and certificate management are handled at the Ingress layer.

## Authentication Architecture

KubeChat uses server-side sessions rather than embedding authentication state in client-side JWTs.

The browser receives an HTTP-only session cookie. The corresponding session state is stored in Redis.

```text
Login
  |
  v
API validates credentials
  |
  +----> PostgreSQL
  |       User + password hash
  |
  v
Create session
  |
  v
Redis
  |
  v
HTTP-only session cookie
  |
  v
Browser
```

Subsequent authenticated requests provide the session cookie. The API resolves the session through Redis and obtains the associated user identity.

This keeps the session identifier opaque to the client and allows sessions to be invalidated centrally.

## Architectural Goals

The architecture prioritizes:

1. Clear separation of responsibilities.
2. Horizontal scalability of stateless API instances.
3. Durable relational storage through PostgreSQL.
4. Distributed ephemeral state through Redis.
5. Independent deployment and scaling of application components.
6. Explicit boundaries between domain features.
7. Infrastructure that can evolve toward a production-scale architecture without requiring a fundamental redesign.
