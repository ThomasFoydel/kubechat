# ADR 002: Organize the API by Feature

## Status

Accepted

## Context

The API contains multiple domains such as users, authentication, and messages.

There are two reasonable ways to organize the source code.

### Layer-based organization

```text
controllers/
services/
repositories/
dto/
routes/
```

All controllers would live together, all services would live together, and so on.

### Feature-based organization

```text
features/
├── auth/
├── users/
├── messages/
└── ...
```

Each feature contains the code associated with that domain.

Both approaches are widely used in production applications.

## Decision

KubeChat will organize application code primarily by **business feature**, with technical responsibilities separated inside each feature.

For example:

```text
features/
└── users/
    ├── controller.ts
    ├── dto.ts
    ├── mapper.ts
    ├── repository.ts
    ├── routes.ts
    └── service.ts
```

## Rationale

Feature-based organization keeps the code associated with a business capability together.

For example, changes to authentication can generally be made within the `auth` feature without navigating through globally shared controller, service, and repository directories.

This becomes increasingly valuable as the application grows.

A layer-based structure can work well for smaller applications, but it tends to create large directories containing unrelated functionality and makes domain boundaries less obvious.

Feature-based organization also provides a natural boundary for future development. A feature can grow internally while exposing a relatively small interface to the rest of the application.

## Consequences

### Positive

- Related code is colocated.
- Business boundaries are visible in the filesystem.
- Features can evolve independently.
- Large technical directories are avoided.
- New developers can locate functionality based on what the application does rather than how the code is implemented.

### Negative

- Some common functionality may need explicit shared modules.
- Developers must avoid creating unnecessary cross-feature dependencies.
- Small features can contain several files even when their implementation is simple.

## Dependency Direction

Features may depend on other features when there is a clear domain relationship, but dependencies should remain intentional.

For example, authentication may use the user feature to locate a user, while password hashing remains an authentication concern.

The goal is not to eliminate dependencies between features, but to prevent the application from developing an uncontrolled web of dependencies.

## Example

Authentication owns credential verification and session creation:

```text
auth/
├── controller.ts
├── dto.ts
├── middleware.ts
├── password.ts
├── service.ts
└── session.ts
```

The user feature owns user persistence and user-facing user operations:

```text
users/
├── controller.ts
├── dto.ts
├── mapper.ts
├── repository.ts
├── routes.ts
└── service.ts
```

This keeps authentication-specific concerns out of the user repository while allowing authentication to use user-domain operations when necessary.
